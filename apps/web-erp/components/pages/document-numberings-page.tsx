'use client';

/**
 * F2 Admin — Document Numbering page.
 * Lists sys_document_numberings; supports create, edit, delete +
 * a "Generate next number" preview action per row.
 * Atomic tier: Page.
 */

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from '@/components/organisms/modal';
import { ErpListLayout } from '@/components/organisms/erp-list-layout';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
} from '@/components/organisms/table';
import { confirmAction, notify } from '@/lib/feedback';
import { useErpList } from '@/lib/use-erp-list';
import {
  listDocumentNumberings,
  createDocumentNumbering,
  updateDocumentNumbering,
  deleteDocumentNumbering,
  getNextDocumentNumber,
} from '@/lib/api/document-numberings';
import type { ErpDocumentNumbering } from '@/lib/api/document-numberings';
import {
  NumberingFormFields,
  defaultNumberingForm,
  fromNumbering,
  toNumberingPayload,
  type NumberingForm,
} from './document-numberings-form';

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ErpDocumentNumberingsPage() {
  const { rows, loading, error, reload } = useErpList(() =>
    listDocumentNumberings(),
  );
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ErpDocumentNumbering | null>(
    null,
  );
  const [form, setForm] = React.useState<NumberingForm>(defaultNumberingForm);
  const [saving, setSaving] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    return q
      ? rows.filter(
          (r) =>
            r.documentCode.toLowerCase().includes(q) ||
            r.name.toLowerCase().includes(q) ||
            r.prefix.toLowerCase().includes(q),
        )
      : rows;
  }, [rows, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultNumberingForm());
    setOpen(true);
  };

  const openEdit = (n: ErpDocumentNumbering) => {
    setEditing(n);
    setForm(fromNumbering(n));
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await updateDocumentNumbering(editing.id, toNumberingPayload(form));
        notify('Penomoran diperbarui', 'success');
      } else {
        await createDocumentNumbering(toNumberingPayload(form));
        notify('Penomoran dibuat', 'success');
      }
      setOpen(false);
      reload();
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : 'Gagal menyimpan', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (n: ErpDocumentNumbering) => {
    confirmAction({
      title: 'Hapus penomoran?',
      message: `${n.documentCode} — ${n.name} akan dihapus permanen.`,
      variant: 'danger',
      confirmLabel: 'Hapus',
      confirmIcon: 'trash',
      onConfirm: async () => {
        try {
          await deleteDocumentNumbering(n.id);
          notify('Penomoran dihapus', 'success');
          reload();
        } catch (e: unknown) {
          notify(e instanceof Error ? e.message : 'Gagal', 'danger');
        }
      },
    });
  };

  const handleNext = async (n: ErpDocumentNumbering) => {
    try {
      const res = await getNextDocumentNumber(n.documentCode);
      notify(`Nomor berikutnya: ${res.docNumber}`, 'success');
      reload();
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : 'Gagal', 'danger');
    }
  };

  return (
    <>
      <ErpListLayout
        title="Penomoran Dokumen"
        code="DOCNUM"
        loading={loading}
        error={error}
        search={search}
        onSearch={setSearch}
        onAdd={openCreate}
        onRefresh={reload}
      >
        <div className="lines">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Prefix</TableHead>
                <TableHead>Digit</TableHead>
                <TableHead>Reset</TableHead>
                <TableHead>Berikutnya</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableEmpty colSpan={7} />
              ) : (
                filtered.map((n) => (
                  <TableRow key={n.id}>
                    <TableCell className="mono">{n.documentCode}</TableCell>
                    <TableCell>{n.name}</TableCell>
                    <TableCell className="mono">{n.prefix}</TableCell>
                    <TableCell className="mono">{n.digitCount}</TableCell>
                    <TableCell>
                      <Badge variant="default">{n.resetPolicy}</Badge>
                    </TableCell>
                    <TableCell className="mono">{n.nextNumber}</TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          className="btn sm"
                          onClick={() => handleNext(n)}
                        >
                          Generate
                        </button>
                        <button
                          className="btn sm"
                          onClick={() => openEdit(n)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn sm danger"
                          onClick={() => handleDelete(n)}
                        >
                          Hapus
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </ErpListLayout>

      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {editing ? 'Edit Penomoran' : 'Tambah Penomoran'}
            </ModalTitle>
          </ModalHeader>
          <NumberingFormFields data={form} onChange={setForm} />
          <ModalFooter>
            <button className="btn ghost" onClick={() => setOpen(false)}>
              Batal
            </button>
            <button
              className="btn primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
