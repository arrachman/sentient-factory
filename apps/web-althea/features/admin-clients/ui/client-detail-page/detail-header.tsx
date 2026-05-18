'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar, MessageCircle, Pencil, Trash2 } from 'lucide-react';
import {
  CATEGORY_LABEL,
  STATUS_BADGE,
  STATUS_LABEL,
  type ClientWithHistory as ClientDetail,
} from '../../model/types';
import { ClientAvatar } from '../client-avatar';

export function DetailHeader({
  sel,
  onEdit,
  onDelete,
  deleting,
  basePath = '/admin/clients',
  schedulePath = '/admin/daftar-jadwal',
}: {
  sel: ClientDetail;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
  basePath?: string;
  schedulePath?: string;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-5">
      <Link
        href={basePath}
        className="caption inline-flex items-center gap-1.5 text-fg-muted hover:text-teal-800 w-fit"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke daftar klien
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <ClientAvatar name={sel.name} category={sel.category ?? undefined} size="lg" />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-semibold text-teal-800 font-serif truncate">
                {sel.name}
              </h1>
              <span className={`badge ${STATUS_BADGE[sel.derivedStatus]} capitalize text-[11px]`}>
                {STATUS_LABEL[sel.derivedStatus]}
              </span>
            </div>
            <span className="caption mt-0.5">
              {sel.age ? `${sel.age} tahun` : ''}
              {sel.age && sel.category ? ' · ' : ''}
              {sel.category ? (
                <span className="capitalize">{CATEGORY_LABEL[sel.category]}</span>
              ) : null}
              {sel.totalBookings > 0 ? ` · ${sel.totalBookings} booking` : ''}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`${schedulePath}?clientId=${sel.id}`}
            className="btn btn-primary btn-sm"
          >
            <Calendar className="h-4 w-4" /> Jadwalkan
          </Link>
          <a
            href={`https://wa.me/${sel.phoneWa.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline btn-sm btn-icon"
            aria-label="WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={onEdit}
            className="btn btn-outline btn-sm"
          >
            <Pencil className="h-4 w-4" /> Edit klien
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="btn btn-outline btn-sm btn-icon text-danger"
            aria-label="Hapus klien"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
