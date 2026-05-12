/**
 * Header detail aside — avatar besar + nama + meta + status & risk badges.
 */
import {
  RISK_TONE,
  STATUS_TONE,
  type AggregatedClient,
} from '../../model/types';
import { ClientAvatar } from '../client-avatar';

export function DetailHeader({ client }: { client: AggregatedClient }) {
  return (
    <div
      className="flex items-center gap-3"
      style={{ marginBottom: 14 }}
    >
      <ClientAvatar initial={client.initial} risk={client.risk} size={56} />
      <div className="flex flex-col" style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{ fontSize: 16, fontWeight: 600, color: 'var(--teal-800)' }}
        >
          {client.name}
        </span>
        <span className="caption">
          {client.category}
          {client.age ? ` · ${client.age} thn` : ''}
          {client.totalBookings > 0
            ? ` · ${client.totalBookings} sesi total`
            : ''}
        </span>
        <div
          className="flex items-center gap-1"
          style={{ marginTop: 4, flexWrap: 'wrap' }}
        >
          <span
            className="badge"
            style={{
              background: STATUS_TONE[client.status].bg,
              color: STATUS_TONE[client.status].fg,
              height: 18,
              fontSize: 10,
            }}
          >
            {client.status}
          </span>
          <span
            className="badge"
            style={{
              background: RISK_TONE[client.risk].bg,
              color: RISK_TONE[client.risk].fg,
              height: 18,
              fontSize: 10,
              textTransform: 'capitalize',
            }}
          >
            risiko {client.risk}
          </span>
        </div>
      </div>
    </div>
  );
}
