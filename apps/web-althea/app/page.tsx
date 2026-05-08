import { redirect } from 'next/navigation';

/**
 * Root entry. Middleware seharusnya sudah handle redirect berdasarkan role.
 * Fallback ke /login kalau request sampai di sini tanpa session.
 */
export default function RootPage() {
  redirect('/login');
}
