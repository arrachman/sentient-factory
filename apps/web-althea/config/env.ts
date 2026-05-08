/**
 * Type-safe env access. Hanya field yang di-deklarasikan di sini yang
 * boleh dipakai di app. Hindari `process.env.X` langsung — pakai ENV.X.
 */

function required(name: string, value: string | undefined): string {
  if (!value || value.trim() === '') {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

function optional(value: string | undefined, fallback: string): string {
  return value && value.trim() !== '' ? value : fallback;
}

export const ENV = {
  API_URL: optional(process.env.NEXT_PUBLIC_API_URL, 'http://localhost:3203'),
  APP_URL: optional(process.env.NEXT_PUBLIC_APP_URL, 'http://localhost:3202'),
  NODE_ENV: optional(process.env.NODE_ENV, 'development'),
} as const;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _typecheck = required;
