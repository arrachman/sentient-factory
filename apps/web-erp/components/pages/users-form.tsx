'use client';

/**
 * User create/edit form — used inside a Modal.
 * Atomic tier: Molecule/Organism sub-part.
 */

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BooleanRadio } from '@/components/ui/radio-group';
import type { ErpUser, ErpUserLevel, CreateUserPayload, UpdateUserPayload } from '@/lib/api/users';

const LEVELS: ErpUserLevel[] = [
  'SUPERADMIN',
  'CENTRAL',
  'BRANCH',
  'SUPERVISOR',
  'STAFF',
  'READONLY',
];

export interface UserFormData {
  username: string;
  fullName: string;
  email: string;
  password: string;
  erpLevel: ErpUserLevel;
  isActive: boolean;
}

const defaultForm = (): UserFormData => ({
  username: '',
  fullName: '',
  email: '',
  password: '',
  erpLevel: 'STAFF',
  isActive: true,
});

function fromUser(u: ErpUser): UserFormData {
  return {
    username: u.username,
    fullName: u.fullName,
    email: u.email ?? '',
    password: '',
    erpLevel: u.erpLevel,
    isActive: u.isActive,
  };
}

export function toCreatePayload(f: UserFormData): CreateUserPayload {
  return {
    username: f.username,
    fullName: f.fullName,
    email: f.email || undefined,
    password: f.password,
    erpLevel: f.erpLevel,
    isActive: f.isActive,
  };
}

export function toUpdatePayload(f: UserFormData): UpdateUserPayload {
  return {
    username: f.username,
    fullName: f.fullName,
    email: f.email || undefined,
    erpLevel: f.erpLevel,
    isActive: f.isActive,
  };
}

interface UserFormProps {
  editing: ErpUser | null;
  data: UserFormData;
  onChange: (d: UserFormData) => void;
}

export function useUserForm(editing: ErpUser | null) {
  const [data, setData] = React.useState<UserFormData>(() =>
    editing ? fromUser(editing) : defaultForm(),
  );
  React.useEffect(() => {
    setData(editing ? fromUser(editing) : defaultForm());
  }, [editing]);
  return { data, setData };
}

export function UserForm({ editing, data, onChange }: UserFormProps) {
  const set = (k: keyof UserFormData, v: string | boolean) =>
    onChange({ ...data, [k]: v });

  return (
    <div className="p-4">
      <FormField label="Username" htmlFor="uf-uname" required>
        <Input
          id="uf-uname"
          value={data.username}
          onChange={(e) => set('username', e.target.value)}
          placeholder="johndoe"
        />
      </FormField>
      <FormField label="Nama Lengkap" htmlFor="uf-fname" required>
        <Input
          id="uf-fname"
          value={data.fullName}
          onChange={(e) => set('fullName', e.target.value)}
          placeholder="John Doe"
        />
      </FormField>
      <FormField label="Email" htmlFor="uf-email">
        <Input
          id="uf-email"
          type="email"
          value={data.email}
          onChange={(e) => set('email', e.target.value)}
          placeholder="john@example.com"
        />
      </FormField>
      {!editing && (
        <FormField label="Password" htmlFor="uf-pass" required>
          <Input
            id="uf-pass"
            type="password"
            value={data.password}
            onChange={(e) => set('password', e.target.value)}
            placeholder="Min 8 karakter"
          />
        </FormField>
      )}
      <FormField label="Level" htmlFor="uf-level" required>
        <Select
          value={data.erpLevel}
          onValueChange={(v) => set('erpLevel', v as ErpUserLevel)}
        >
          <SelectTrigger id="uf-level">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LEVELS.map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Status" htmlFor="uf-active">
        <BooleanRadio
          id="uf-active"
          value={data.isActive}
          onValueChange={(v) => set('isActive', v)}
        />
      </FormField>
    </div>
  );
}
