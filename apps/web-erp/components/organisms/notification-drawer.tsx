'use client';

/**
 * Right slide-over Notifikasi panel — ported from prototype
 * `notifications.jsx#NotificationPanel`. Listens to the
 * `toggle-notif` window event (dispatched by topbar bell), keeps
 * local state for the seed list, and re-broadcasts the unread count
 * via `notif-count` so the topbar badge stays in sync.
 */
import * as React from 'react';
import { Icon, type IconName } from '@/components/ui/icons';
import { Kbd } from '@/components/ui/kbd';
import { DrawerPanel } from '@/components/molecules/drawer-panel';
import { usePanelToggle } from '@/lib/drawer-toggle';
import { notify } from '@/lib/feedback';
import { tGlobal } from '@/lib/mock';

export type NotificationType = 'success' | 'info' | 'danger' | 'warn';

export interface NotificationItem {
  id: number;
  type: NotificationType;
  icon: IconName;
  title: string;
  body: string;
  ts: string;
  route: string | null;
  read: boolean;
}

type Tab = 'all' | 'unread';

const NOTIFS_SEED: NotificationItem[] = [
  {
    id: 1,
    type: 'warn',
    icon: 'info',
    title: 'Menunggu persetujuan',
    body: 'CR-2605-2398 (Rp 4.250.000) perlu Anda setujui.',
    ts: '2 mnt lalu',
    route: 'kas-masuk',
    read: false,
  },
  {
    id: 2,
    type: 'success',
    icon: 'check',
    title: 'Dokumen diposting',
    body: 'RM-2605-0871 berhasil diposting oleh fitri.h.',
    ts: '14 mnt lalu',
    route: 'bank-masuk',
    read: false,
  },
  {
    id: 3,
    type: 'danger',
    icon: 'x',
    title: 'Transaksi ditolak',
    body: 'CD-2605-1640 ditolak oleh maya.p — cek catatan.',
    ts: '38 mnt lalu',
    route: 'kas-keluar',
    read: false,
  },
  {
    id: 4,
    type: 'info',
    icon: 'boxes',
    title: 'Stok menipis',
    body: 'Bearing 6204 di bawah minimum (sisa 12 PCS).',
    ts: '1 jam lalu',
    route: 'm-item',
    read: true,
  },
  {
    id: 5,
    type: 'info',
    icon: 'receipt',
    title: 'Giro jatuh tempo',
    body: 'RG-2605-0231 jatuh tempo besok (20/06/2026).',
    ts: '3 jam lalu',
    route: 'giro-masuk',
    read: true,
  },
  {
    id: 6,
    type: 'success',
    icon: 'check',
    title: 'Backup harian selesai',
    body: 'Backup database 02:00 WIB sukses.',
    ts: 'Kemarin',
    route: null,
    read: true,
  },
];

export interface NotificationDrawerProps {
  onNavigate: (route: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  t: (key: string) => string;
}

const TITLE_STYLE = (read: boolean): React.CSSProperties => ({
  fontSize: 'calc(12.5px * var(--font-scale, 1))',
  fontWeight: read ? 400 : 600,
  display: 'flex',
  alignItems: 'center',
  gap: 6,
});

const TS_STYLE: React.CSSProperties = {
  fontSize: 'calc(10.5px * var(--font-scale, 1))',
  color: 'var(--fg-faint)',
  marginTop: 3,
  fontFamily: 'Geist Mono, monospace',
};

const UNREAD_DOT_STYLE: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: '50%',
  background: 'var(--primary)',
};

function NotifRow({
  item,
  onClick,
}: {
  item: NotificationItem;
  onClick: () => void;
}): React.ReactElement {
  return (
    <div className="notif-row" onClick={onClick}>
      <span
        className={`confirm-ic ${item.type}`}
        style={{ width: 30, height: 30 }}
      >
        <Icon name={item.icon} size={14} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={TITLE_STYLE(item.read)}>
          {item.title}
          {!item.read && <span style={UNREAD_DOT_STYLE} />}
        </div>
        <div className="muted" style={{ fontSize: 'calc(11.5px * var(--font-scale, 1))', marginTop: 2 }}>
          {item.body}
        </div>
        <div style={TS_STYLE}>{item.ts}</div>
      </div>
      {item.route && (
        <Icon name="chevright" size={11} className="muted" />
      )}
    </div>
  );
}

export function NotificationDrawer({
  onNavigate,
}: NotificationDrawerProps): React.ReactElement | null {
  const [open, setOpen] = usePanelToggle('toggle-notif');
  const [items, setItems] = React.useState<NotificationItem[]>(NOTIFS_SEED);
  const [tab, setTab] = React.useState<Tab>('all');

  const unread = items.filter((n) => !n.read).length;

  React.useEffect(() => {
    window.dispatchEvent(
      new CustomEvent<number>('notif-count', { detail: unread }),
    );
  }, [unread]);

  const shown = tab === 'unread' ? items.filter((n) => !n.read) : items;

  const close = (): void => setOpen(false);

  const markAll = (): void => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    notify('Semua notifikasi ditandai dibaca', 'info');
  };

  const openItem = (n: NotificationItem): void => {
    setItems((prev) =>
      prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)),
    );
    if (n.route) {
      onNavigate(n.route);
      setOpen(false);
    }
  };

  return (
    <DrawerPanel
      open={open}
      onClose={close}
      title={tGlobal('Notifikasi')}
      icon="bell"
      sub={`${unread} ${tGlobal('belum dibaca')}`}
      head={
        <button
          className="btn ghost sm"
          onClick={markAll}
          disabled={unread === 0}
        >
          <Icon name="check" size={11} /> {tGlobal('Tandai semua')}
        </button>
      }
    >
      <div className="tabs" style={{ padding: '0 8px' }}>
        <button
          className={`tab ${tab === 'all' ? 'active' : ''}`}
          onClick={() => setTab('all')}
        >
          {tGlobal('Semua')} <span className="muted">{items.length}</span>
        </button>
        <button
          className={`tab ${tab === 'unread' ? 'active' : ''}`}
          onClick={() => setTab('unread')}
        >
          {tGlobal('Belum dibaca')} <span className="muted">{unread}</span>
        </button>
      </div>
      <div className="drawer-bd scrollbar" style={{ padding: 0, gap: 0 }}>
        {shown.length === 0 && (
          <div className="cm-empty" style={{ padding: 48 }}>
            <Icon name="bell" size={26} />
            <div className="muted" style={{ marginTop: 8 }}>
              {tGlobal('Tidak ada notifikasi')}
            </div>
          </div>
        )}
        {shown.map((n) => (
          <NotifRow key={n.id} item={n} onClick={() => openItem(n)} />
        ))}
      </div>
      <div className="drawer-ft">
        <button className="btn ghost" onClick={close}>
          {tGlobal('Tutup')} <Kbd>ESC</Kbd>
        </button>
        <button
          className="btn"
          onClick={() => {
            onNavigate('home');
            setOpen(false);
          }}
        >
          {tGlobal('Buka Dashboard')}
        </button>
      </div>
    </DrawerPanel>
  );
}
