/**
 * Domain types untuk halaman Catatan Klinis (psikolog).
 */
export type ServiceKind = 'dewasa' | 'anak' | 'pasangan' | 'tes';

export type ClinicalNote = {
  id: number;
  noteText: string;
  createdAt: string;
};

export type ClinicalNoteListResponse = {
  success: boolean;
  data: ClinicalNote[];
};
