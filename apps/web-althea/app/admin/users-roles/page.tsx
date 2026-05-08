import type { Metadata } from 'next';
import { UsersRolesPage } from '@/features/admin-users-roles/ui/users-roles-page';

export const metadata: Metadata = { title: 'Users & Roles' };

export default function AdminUsersRolesRoute() {
  return <UsersRolesPage />;
}
