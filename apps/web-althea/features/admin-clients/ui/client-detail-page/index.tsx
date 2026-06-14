'use client';

/**
 * Halaman detail klien penuh (menggantikan aside lama).
 * Layout: header + grid 2 kolom (profil | daftar booking).
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useClientDetail, useDeleteClient, useUpdateClient } from '../../hooks/use-client';
import type { Client, CreateClientInput } from '../../model/types';
import { ClientFormDialog } from '../client-form-dialog';
import { DetailHeader } from './detail-header';
import {
  ContactSection,
  CurrentServiceSection,
  IdentitySection,
  InactiveBanner,
  NextSessionSection,
  NotesSection,
  ServicesSection,
  WaOptedOutBanner,
} from './profile-sections';
import { ClientBookingsSection } from './client-bookings-section';

function toFormInput(c: Client): CreateClientInput {
  return {
    name: c.name,
    gender: c.gender,
    age: c.age ?? undefined,
    category: c.category ?? undefined,
    phoneWa: c.phoneWa,
    medicalRecordNumber: c.medicalRecordNumber ?? '',
    serviceIds: c.serviceIds ?? [],
    email: c.email ?? '',
    address: c.address ?? '',
    notes: c.notes ?? '',
    waOptedOut: c.waOptedOut,
    isActive: c.isActive,
  };
}

export function ClientDetailPage({
  clientId,
  basePath = '/admin/clients',
  schedulePath = '/admin/daftar-jadwal',
}: {
  clientId: number;
  basePath?: string;
  schedulePath?: string;
}) {
  const router = useRouter();
  const detail = useClientDetail(clientId);
  const updateMut = useUpdateClient();
  const deleteMut = useDeleteClient();

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<CreateClientInput | null>(null);

  const sel = detail.data?.data ?? null;

  if (detail.isLoading) {
    return (
      <div className="p-6 text-center text-fg-muted">Memuat detail klien…</div>
    );
  }

  if (detail.isError || !sel) {
    return (
      <div className="p-6 flex flex-col items-center gap-3 text-center">
        <p className="text-fg-muted">Klien tidak ditemukan atau gagal dimuat.</p>
        <Link href={basePath} className="btn btn-outline btn-sm">
          Kembali ke daftar klien
        </Link>
      </div>
    );
  }

  function openEdit() {
    if (!sel) return;
    setForm(toFormInput(sel));
    setEditOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form || !sel) return;
    const payload: CreateClientInput = {
      ...form,
      email: form.email?.trim() || undefined,
      medicalRecordNumber: form.medicalRecordNumber?.trim() || undefined,
      address: form.address?.trim() || undefined,
      notes: form.notes?.trim() || undefined,
    };
    updateMut.mutate(
      { id: sel.id, input: payload },
      { onSuccess: () => setEditOpen(false) },
    );
  }

  function handleDelete() {
    if (!sel) return;
    if (!confirm(`Hapus klien "${sel.name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    deleteMut.mutate(sel.id, { onSuccess: () => router.push(basePath) });
  }

  return (
    <div className="p-6 flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <DetailHeader
        sel={sel}
        onEdit={openEdit}
        onDelete={handleDelete}
        deleting={deleteMut.isPending}
        basePath={basePath}
        schedulePath={schedulePath}
      />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="flex flex-col gap-5">
          <IdentitySection sel={sel} />
          <ContactSection sel={sel} />
          <ServicesSection sel={sel} />
          {sel.currentService ? <CurrentServiceSection sel={sel} /> : null}
          {sel.nextSession ? <NextSessionSection sel={sel} /> : null}
          <NotesSection notes={sel.notes} />
          {sel.waOptedOut ? <WaOptedOutBanner /> : null}
          {!sel.isActive ? <InactiveBanner /> : null}
        </div>

        <ClientBookingsSection clientId={sel.id} />
      </div>

      {editOpen && form && (
        <ClientFormDialog
          editing={sel as Client}
          form={form}
          submitting={updateMut.isPending}
          onClose={() => setEditOpen(false)}
          onChangeForm={(next) => setForm(next)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
