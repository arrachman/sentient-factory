#!/usr/bin/env python3
"""Execute generated PostgreSQL OBT table SQL files without external clients."""

from __future__ import annotations

import argparse
import base64
import hashlib
import hmac
import os
import secrets
import socket
import struct
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse


ROOT = Path("/home/rania/apps/sentient-factory")
SQL_DIR = ROOT / "apps" / "myerpplus-db-mapping" / "db" / "obt-physical-sql" / "pgsql-tables"
ENV_FILES = [
    ROOT / ".env",
    ROOT / ".env.vault",
]

DEFAULT_CREATE_FILES = [
    "pg_create_table_obt_purchase_line_flow.sql",
    "pg_create_table_obt_sales_line_flow.sql",
    "pg_create_table_obt_pos_to_sales.sql",
]

DEFAULT_INSERT_FILES = [
    "pg_insert_obt_purchase_line_flow.sql",
    "pg_insert_obt_sales_line_flow.sql",
    "pg_insert_obt_pos_to_sales.sql",
]

SOURCE_PROBE_TABLES = [
    "m4_po",
    "m4_po_detail",
    "m5_si",
    "m5_si_detail",
    "m_12_pos_voucher_out",
]

TARGET_TABLES = [
    "obt_purchase_line_flow",
    "obt_sales_line_flow",
    "obt_pos_to_sales",
]


def load_env_files() -> None:
    for path in ENV_FILES:
        if not path.exists():
            continue
        for line in path.read_text().splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip("'").strip('"')
            os.environ[key] = value


def resolve_database_url() -> str:
    user = os.environ.get("POSTGRES_USER")
    password = os.environ.get("POSTGRES_PASSWORD")
    database = os.environ.get("POSTGRES_DB")
    if user and password and database:
        host = os.environ.get("POSTGRES_HOST", "127.0.0.1")
        port = os.environ.get("POSTGRES_PORT", "3208")
        return f"postgresql://{user}:{password}@{host}:{port}/{database}"

    database_url = os.environ.get("DATABASE_URL")
    if database_url:
        return database_url

    raise KeyError("PostgreSQL connection settings are not available")


def iter_sql_files(mode: str, explicit_files: list[str]) -> list[Path]:
    names = explicit_files or (DEFAULT_CREATE_FILES if mode == "create" else DEFAULT_INSERT_FILES)
    return [SQL_DIR / name for name in names]


def _md5_password(user: str, password: str, salt: bytes) -> str:
    inner = hashlib.md5((password + user).encode()).hexdigest().encode()
    outer = hashlib.md5(inner + salt).hexdigest()
    return "md5" + outer


def _scram_hi(password: bytes, salt: bytes, iterations: int) -> bytes:
    return hashlib.pbkdf2_hmac("sha256", password, salt, iterations)


def _xor_bytes(left: bytes, right: bytes) -> bytes:
    return bytes(a ^ b for a, b in zip(left, right))


def _scram_escape(value: str) -> str:
    return value.replace("=", "=3D").replace(",", "=2C")


def _parse_error(payload: bytes) -> str:
    parts = payload.split(b"\x00")
    fields: dict[str, str] = {}
    for part in parts:
        if not part:
            continue
        key = chr(part[0])
        value = part[1:].decode(errors="replace")
        fields[key] = value
    primary = fields.get("M", "Unknown PostgreSQL error")
    detail = fields.get("D")
    hint = fields.get("H")
    out = primary
    if detail:
        out += f" | detail={detail}"
    if hint:
        out += f" | hint={hint}"
    return out


class SimplePgClient:
    def __init__(self, database_url: str) -> None:
        parsed = urlparse(database_url)
        if parsed.scheme not in {"postgresql", "postgres"}:
            raise ValueError("DATABASE_URL must use postgresql:// or postgres://")

        self.host = parsed.hostname or "127.0.0.1"
        self.port = parsed.port or 5432
        self.user = unquote(parsed.username or "")
        self.password = unquote(parsed.password or "")
        self.database = unquote(parsed.path.lstrip("/"))
        if not self.user or not self.database:
            raise ValueError("DATABASE_URL must include user and database")

        self.sock: socket.socket | None = None

    def connect(self) -> None:
        self.sock = socket.create_connection((self.host, self.port), timeout=10)
        self.sock.settimeout(30)
        params = [
            b"user",
            self.user.encode(),
            b"database",
            self.database.encode(),
            b"client_encoding",
            b"UTF8",
        ]
        payload = struct.pack("!I", 196608) + b"".join(p + b"\x00" for p in params) + b"\x00"
        self._send_startup(payload)
        self._handle_authentication()

    def close(self) -> None:
        if not self.sock:
            return
        try:
            self._send_message(b"X", b"")
        except Exception:
            pass
        try:
            self.sock.close()
        finally:
            self.sock = None

    def query(self, sql: str) -> tuple[list[str], list[list[str | None]]]:
        self._send_message(b"Q", sql.encode() + b"\x00")
        columns: list[str] = []
        rows: list[list[str | None]] = []

        while True:
            msg_type, payload = self._read_message()
            if msg_type == b"T":
                field_count = struct.unpack("!H", payload[:2])[0]
                pos = 2
                cols = []
                for _ in range(field_count):
                    end = payload.index(b"\x00", pos)
                    cols.append(payload[pos:end].decode())
                    pos = end + 19
                columns = cols
            elif msg_type == b"D":
                field_count = struct.unpack("!H", payload[:2])[0]
                pos = 2
                row: list[str | None] = []
                for _ in range(field_count):
                    length = struct.unpack("!i", payload[pos : pos + 4])[0]
                    pos += 4
                    if length == -1:
                        row.append(None)
                    else:
                        row.append(payload[pos : pos + length].decode())
                        pos += length
                rows.append(row)
            elif msg_type == b"C":
                continue
            elif msg_type == b"I":
                continue
            elif msg_type == b"N":
                print(f"NOTICE: {_parse_error(payload)}")
            elif msg_type == b"S":
                continue
            elif msg_type == b"E":
                raise RuntimeError(_parse_error(payload))
            elif msg_type == b"Z":
                return columns, rows
            else:
                continue

    def execute(self, sql: str) -> None:
        self.query(sql)

    def _handle_authentication(self) -> None:
        server_signature: bytes | None = None
        expected_server_signature: bytes | None = None

        while True:
            msg_type, payload = self._read_message()
            if msg_type == b"R":
                auth_code = struct.unpack("!I", payload[:4])[0]
                if auth_code == 0:
                    continue
                if auth_code == 3:
                    self._send_message(b"p", self.password.encode() + b"\x00")
                    continue
                if auth_code == 5:
                    salt = payload[4:8]
                    encoded = _md5_password(self.user, self.password, salt).encode() + b"\x00"
                    self._send_message(b"p", encoded)
                    continue
                if auth_code == 10:
                    mechanisms = payload[4:].split(b"\x00")
                    if b"SCRAM-SHA-256" not in mechanisms:
                        raise RuntimeError("PostgreSQL requested unsupported SASL mechanism")
                    nonce = secrets.token_hex(18)
                    client_first_bare = f"n={_scram_escape(self.user)},r={nonce}".encode()
                    client_first = b"n,," + client_first_bare
                    body = (
                        b"SCRAM-SHA-256\x00"
                        + struct.pack("!I", len(client_first))
                        + client_first
                    )
                    self._send_message(b"p", body)

                    cont_type, cont_payload = self._read_message()
                    if cont_type != b"R" or struct.unpack("!I", cont_payload[:4])[0] != 11:
                        raise RuntimeError("Expected SASL continue from PostgreSQL")

                    server_first = cont_payload[4:].decode()
                    attrs = dict(item.split("=", 1) for item in server_first.split(","))
                    server_nonce = attrs["r"]
                    salt = base64.b64decode(attrs["s"])
                    iterations = int(attrs["i"])

                    client_final_without_proof = f"c=biws,r={server_nonce}".encode()
                    auth_message = b",".join(
                        [client_first_bare, server_first.encode(), client_final_without_proof]
                    )
                    salted_password = _scram_hi(self.password.encode(), salt, iterations)
                    client_key = hmac.new(
                        salted_password, b"Client Key", hashlib.sha256
                    ).digest()
                    stored_key = hashlib.sha256(client_key).digest()
                    client_signature = hmac.new(
                        stored_key, auth_message, hashlib.sha256
                    ).digest()
                    client_proof = base64.b64encode(_xor_bytes(client_key, client_signature))
                    server_key = hmac.new(
                        salted_password, b"Server Key", hashlib.sha256
                    ).digest()
                    expected_server_signature = hmac.new(
                        server_key, auth_message, hashlib.sha256
                    ).digest()
                    client_final = (
                        client_final_without_proof + b",p=" + client_proof
                    )
                    self._send_message(b"p", client_final)
                    continue
                if auth_code == 12:
                    attrs = dict(
                        item.split("=", 1)
                        for item in payload[4:].decode().split(",")
                        if "=" in item
                    )
                    if "v" in attrs:
                        server_signature = base64.b64decode(attrs["v"])
                    continue
                raise RuntimeError(f"Unsupported PostgreSQL auth code: {auth_code}")
            elif msg_type == b"S":
                continue
            elif msg_type == b"K":
                continue
            elif msg_type == b"E":
                raise RuntimeError(_parse_error(payload))
            elif msg_type == b"Z":
                if expected_server_signature and server_signature != expected_server_signature:
                    raise RuntimeError("SCRAM server signature verification failed")
                return
            else:
                continue

    def _send_startup(self, payload: bytes) -> None:
        if not self.sock:
            raise RuntimeError("socket is not connected")
        self.sock.sendall(struct.pack("!I", len(payload) + 4) + payload)

    def _send_message(self, msg_type: bytes, payload: bytes) -> None:
        if not self.sock:
            raise RuntimeError("socket is not connected")
        self.sock.sendall(msg_type + struct.pack("!I", len(payload) + 4) + payload)

    def _read_exact(self, size: int) -> bytes:
        if not self.sock:
            raise RuntimeError("socket is not connected")
        chunks = []
        remaining = size
        while remaining > 0:
            chunk = self.sock.recv(remaining)
            if not chunk:
                raise RuntimeError("PostgreSQL connection closed unexpectedly")
            chunks.append(chunk)
            remaining -= len(chunk)
        return b"".join(chunks)

    def _read_message(self) -> tuple[bytes, bytes]:
        msg_type = self._read_exact(1)
        length = struct.unpack("!I", self._read_exact(4))[0]
        payload = self._read_exact(length - 4)
        return msg_type, payload


def print_probe(client: SimplePgClient) -> None:
    cols, rows = client.query("SELECT current_database(), current_user, current_schema()")
    if rows:
        values = dict(zip(cols, rows[0]))
        print(
            "connected "
            f"database={values.get('current_database')} "
            f"user={values.get('current_user')} "
            f"schema={values.get('current_schema')}"
        )

    probe_sql = f"""
    SELECT table_schema, table_name
    FROM information_schema.tables
    WHERE table_name IN ({", ".join(repr(name) for name in SOURCE_PROBE_TABLES)})
    ORDER BY table_schema, table_name
    """
    _, rows = client.query(probe_sql)
    print("source table probe:")
    if not rows:
        print("  no expected source tables found")
    else:
        for schema_name, table_name in rows:
            print(f"  {schema_name}.{table_name}")


def print_targets(client: SimplePgClient) -> None:
    target_sql = f"""
    SELECT table_schema, table_name
    FROM information_schema.tables
    WHERE table_name IN ({", ".join(repr(name) for name in TARGET_TABLES)})
    ORDER BY table_schema, table_name
    """
    _, rows = client.query(target_sql)
    print("target table status:")
    if not rows:
        print("  no OBT target tables found")
    else:
        for schema_name, table_name in rows:
            print(f"  {schema_name}.{table_name}")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--mode",
        choices=["create", "insert"],
        default="create",
        help="choose which generated SQL set to execute",
    )
    parser.add_argument(
        "files",
        nargs="*",
        help="optional explicit SQL filenames under db/obt-physical-sql/pgsql-tables",
    )
    args = parser.parse_args()

    load_env_files()
    database_url = resolve_database_url()
    sql_files = iter_sql_files(args.mode, args.files)
    for path in sql_files:
        if not path.exists():
            raise FileNotFoundError(path)

    client = SimplePgClient(database_url)
    try:
        client.connect()
        print_probe(client)
        for path in sql_files:
            print(f"executing {path.name}")
            client.execute(path.read_text())
        print_targets(client)
    finally:
        client.close()

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise
