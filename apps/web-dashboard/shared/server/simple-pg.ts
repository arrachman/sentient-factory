import { createHash, createHmac, pbkdf2Sync, randomBytes } from 'node:crypto';
import net from 'node:net';

type PgMessage = {
  type: string;
  payload: Buffer;
};

function md5Password(user: string, password: string, salt: Buffer) {
  const inner = createHash('md5').update(password + user).digest('hex');
  const outer = createHash('md5').update(Buffer.concat([Buffer.from(inner), salt])).digest('hex');
  return `md5${outer}`;
}

function parseConnectionString() {
  const databaseUrl =
    process.env.DATABASE_URL ||
    `postgresql://${process.env.POSTGRES_USER || 'root'}:${process.env.POSTGRES_PASSWORD || 'PasswordSuperRahasia123!'}@${process.env.POSTGRES_HOST || 'postgres'}:${process.env.POSTGRES_PORT || '5432'}/${process.env.POSTGRES_DB || 'sentient_factory'}`;

  const parsed = new URL(databaseUrl);
  if (parsed.protocol !== 'postgresql:' && parsed.protocol !== 'postgres:') {
    throw new Error('DATABASE_URL must use postgresql:// or postgres://');
  }

  return {
    host: parsed.hostname || 'postgres',
    port: Number(parsed.port || '5432'),
    user: decodeURIComponent(parsed.username || ''),
    password: decodeURIComponent(parsed.password || ''),
    database: decodeURIComponent(parsed.pathname.replace(/^\//, '')),
  };
}

function parseError(payload: Buffer) {
  const parts = payload.toString('utf8').split('\x00');
  const fields = new Map<string, string>();
  for (const part of parts) {
    if (!part) continue;
    fields.set(part[0], part.slice(1));
  }
  const primary = fields.get('M') || 'Unknown PostgreSQL error';
  const detail = fields.get('D');
  const hint = fields.get('H');
  return [primary, detail ? `detail=${detail}` : '', hint ? `hint=${hint}` : '']
    .filter(Boolean)
    .join(' | ');
}

function xorBytes(left: Buffer, right: Buffer) {
  const out = Buffer.alloc(Math.min(left.length, right.length));
  for (let index = 0; index < out.length; index += 1) {
    out[index] = left[index] ^ right[index];
  }
  return out;
}

function scramEscape(value: string) {
  return value.replaceAll('=', '=3D').replaceAll(',', '=2C');
}

export class SimplePgClient {
  private socket: net.Socket | null = null;
  private buffer = Buffer.alloc(0);
  private pendingReads: Array<(message: PgMessage) => void> = [];
  private readonly config = parseConnectionString();

  async connect() {
    this.socket = net.createConnection({
      host: this.config.host,
      port: this.config.port,
    });

    this.socket.on('data', (chunk) => {
      this.buffer = Buffer.concat([this.buffer, chunk]);
      this.flushMessages();
    });

    await new Promise<void>((resolve, reject) => {
      this.socket?.once('connect', () => resolve());
      this.socket?.once('error', reject);
    });

    this.socket.setTimeout(30000);
    const params = [
      'user',
      this.config.user,
      'database',
      this.config.database,
      'client_encoding',
      'UTF8',
    ];
    const pairs = params.flatMap((value) => [Buffer.from(value), Buffer.from([0])]);
    const payload = Buffer.concat([
      Buffer.from([0, 3, 0, 0]),
      ...pairs,
      Buffer.from([0]),
    ]);
    this.sendStartup(payload);
    await this.handleAuthentication();
  }

  async close() {
    if (!this.socket) return;
    this.sendMessage('X', Buffer.alloc(0));
    this.socket.end();
    this.socket.destroy();
    this.socket = null;
  }

  async query(sql: string) {
    this.sendMessage('Q', Buffer.concat([Buffer.from(sql, 'utf8'), Buffer.from([0])]));
    let columns: string[] = [];
    const rows: Array<Array<string | null>> = [];

    for (;;) {
      const { type, payload } = await this.readMessage();
      if (type === 'T') {
        const fieldCount = payload.readUInt16BE(0);
        let pos = 2;
        const cols: string[] = [];
        for (let index = 0; index < fieldCount; index += 1) {
          const end = payload.indexOf(0, pos);
          cols.push(payload.subarray(pos, end).toString('utf8'));
          pos = end + 19;
        }
        columns = cols;
      } else if (type === 'D') {
        const fieldCount = payload.readUInt16BE(0);
        let pos = 2;
        const row: Array<string | null> = [];
        for (let index = 0; index < fieldCount; index += 1) {
          const length = payload.readInt32BE(pos);
          pos += 4;
          if (length === -1) {
            row.push(null);
          } else {
            row.push(payload.subarray(pos, pos + length).toString('utf8'));
            pos += length;
          }
        }
        rows.push(row);
      } else if (type === 'E') {
        throw new Error(parseError(payload));
      } else if (type === 'Z') {
        return { columns, rows };
      }
    }
  }

  async execute(sql: string) {
    await this.query(sql);
  }

  private async handleAuthentication() {
    let expectedServerSignature: Buffer | null = null;
    let serverSignature: Buffer | null = null;

    for (;;) {
      const { type, payload } = await this.readMessage();
      if (type === 'R') {
        const authCode = payload.readUInt32BE(0);
        if (authCode === 0) continue;
        if (authCode === 3) {
          this.sendMessage('p', Buffer.concat([Buffer.from(this.config.password, 'utf8'), Buffer.from([0])]));
          continue;
        }
        if (authCode === 5) {
          const salt = payload.subarray(4, 8);
          this.sendMessage('p', Buffer.concat([Buffer.from(md5Password(this.config.user, this.config.password, salt), 'utf8'), Buffer.from([0])]));
          continue;
        }
        if (authCode === 10) {
          const nonce = randomBytes(18).toString('hex');
          const clientFirstBare = `n=${scramEscape(this.config.user)},r=${nonce}`;
          const clientFirst = `n,,${clientFirstBare}`;
          const mechanism = Buffer.from('SCRAM-SHA-256\0', 'utf8');
          const clientFirstBuf = Buffer.from(clientFirst, 'utf8');
          const length = Buffer.alloc(4);
          length.writeUInt32BE(clientFirstBuf.length, 0);
          this.sendMessage('p', Buffer.concat([mechanism, length, clientFirstBuf]));

          const continueMessage = await this.readMessage();
          if (continueMessage.type !== 'R' || continueMessage.payload.readUInt32BE(0) !== 11) {
            throw new Error('Expected SASL continue from PostgreSQL');
          }

          const serverFirst = continueMessage.payload.subarray(4).toString('utf8');
          const attrs = Object.fromEntries(serverFirst.split(',').map((item) => item.split('=', 2)));
          const serverNonce = attrs.r;
          const salt = Buffer.from(attrs.s, 'base64');
          const iterations = Number(attrs.i);
          const clientFinalWithoutProof = `c=biws,r=${serverNonce}`;
          const authMessage = `${clientFirstBare},${serverFirst},${clientFinalWithoutProof}`;
          const saltedPassword = pbkdf2Sync(Buffer.from(this.config.password, 'utf8'), salt, iterations, 32, 'sha256');
          const clientKey = createHmac('sha256', saltedPassword).update('Client Key').digest();
          const storedKey = createHash('sha256').update(clientKey).digest();
          const clientSignature = createHmac('sha256', storedKey).update(authMessage).digest();
          const clientProof = xorBytes(clientKey, clientSignature).toString('base64');
          const serverKey = createHmac('sha256', saltedPassword).update('Server Key').digest();
          expectedServerSignature = createHmac('sha256', serverKey).update(authMessage).digest();
          this.sendMessage('p', Buffer.from(`${clientFinalWithoutProof},p=${clientProof}`, 'utf8'));
          continue;
        }
        if (authCode === 12) {
          const attrs = Object.fromEntries(
            continueMessageParts(payload.subarray(4).toString('utf8')).map((item) => item.split('=', 2)),
          );
          if (attrs.v) {
            serverSignature = Buffer.from(attrs.v, 'base64');
          }
          continue;
        }
        throw new Error(`Unsupported PostgreSQL auth code: ${authCode}`);
      }
      if (type === 'E') {
        throw new Error(parseError(payload));
      }
      if (type === 'Z') {
        if (
          expectedServerSignature &&
          serverSignature &&
          !expectedServerSignature.equals(serverSignature)
        ) {
          throw new Error('SCRAM server signature verification failed');
        }
        return;
      }
    }
  }

  private sendStartup(payload: Buffer) {
    if (!this.socket) throw new Error('socket is not connected');
    const length = Buffer.alloc(4);
    length.writeUInt32BE(payload.length + 4, 0);
    this.socket.write(Buffer.concat([length, payload]));
  }

  private sendMessage(type: string, payload: Buffer) {
    if (!this.socket) throw new Error('socket is not connected');
    const length = Buffer.alloc(4);
    length.writeUInt32BE(payload.length + 4, 0);
    this.socket.write(Buffer.concat([Buffer.from(type, 'utf8'), length, payload]));
  }

  private async readMessage(): Promise<PgMessage> {
    const existing = this.tryParseMessage();
    if (existing) return existing;
    return await new Promise<PgMessage>((resolve) => {
      this.pendingReads.push(resolve);
    });
  }

  private flushMessages() {
    while (this.pendingReads.length > 0) {
      const message = this.tryParseMessage();
      if (!message) break;
      const resolve = this.pendingReads.shift();
      resolve?.(message);
    }
  }

  private tryParseMessage(): PgMessage | null {
    if (this.buffer.length < 5) return null;
    const type = this.buffer.subarray(0, 1).toString('utf8');
    const length = this.buffer.readUInt32BE(1);
    if (this.buffer.length < 1 + length) return null;
    const payload = this.buffer.subarray(5, 1 + length);
    this.buffer = this.buffer.subarray(1 + length);
    return { type, payload };
  }
}

function continueMessageParts(value: string) {
  return value.split(',').filter(Boolean);
}
