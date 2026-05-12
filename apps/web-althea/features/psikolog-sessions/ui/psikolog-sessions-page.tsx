'use client';

/**
 * Psikolog · Catatan Klinis (SOAP) — orchestrator.
 *
 * Layout: split kiri 260px (timeline + asesmen) + kanan flex (editor SOAP).
 */
import { usePsikologSessions } from '../hooks/use-psikolog-sessions';
import { SessionEditor } from './session-editor';
import { SessionsAside } from './sessions-aside';

export function PsikologSessionsPage() {
  const page = usePsikologSessions();

  return (
    <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <SessionsAside
        items={page.items}
        isLoading={page.isLoadingList}
        selectedId={page.selectedId}
        onSelect={(id) => page.setSelectedId(id)}
      />

      <div
        style={{
          flex: 1,
          padding: '20px 28px',
          overflow: 'auto',
          minWidth: 0,
        }}
      >
        {!page.selected ? (
          <div
            className="card-althea"
            style={{
              padding: 32,
              textAlign: 'center',
              maxWidth: 480,
              margin: '40px auto',
            }}
          >
            <p className="caption">
              Pilih sesi dari panel kiri untuk mulai isi catatan klinis.
            </p>
          </div>
        ) : (
          <SessionEditor
            selected={page.selected}
            kind={page.kind}
            setKind={page.setKind}
            soap={page.soap}
            setSoap={page.setSoap}
            savedAt={page.savedAt}
            saving={page.saving}
            onSave={page.save}
          />
        )}
      </div>
    </div>
  );
}
