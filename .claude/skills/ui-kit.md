---
name: ui-kit
description: Skill untuk bekerja dengan packages/ui-kit — React component library bersama dengan Storybook, Tailwind CSS, class-variance-authority, dan integrasi shared-types.
---

Kamu sedang bekerja di `packages/ui-kit` — shared React component library Sentient Factory.

## Tech Stack
- **Package name**: `@sentient-factory/ui-kit`
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v3
- **Variants**: class-variance-authority (CVA)
- **Icons**: Lucide React
- **Utils**: clsx
- **Docs**: Storybook 7
- **Dependencies**: `@sentient-factory/shared-types`, `@sentient-factory/logger`

## Struktur (expected)

```
src/
├── index.ts              # Re-export semua komponen
├── components/
│   ├── button/
│   │   ├── button.tsx
│   │   ├── button.stories.tsx
│   │   └── index.ts
│   ├── input/
│   ├── dialog/
│   ├── table/
│   └── ...
├── hooks/                # Shared React hooks
├── utils/
│   └── cn.ts             # className merger (clsx + tailwind-merge)
└── types/                # Component-specific types
```

## Perintah Umum

```bash
# Development (watch mode)
npm run dev

# Build
npm run build

# Storybook (component explorer)
npm run storybook         # Dev server di port 6006
npm run build-storybook   # Build static Storybook

# Quality
npm run lint
npm run typecheck
```

## Cara Pakai di App Lain

```typescript
import { Button, Input, Dialog } from '@sentient-factory/ui-kit'
import { cn } from '@sentient-factory/ui-kit/utils'
```

## Panduan Tugas Umum

### Membuat Komponen Baru
1. Buat folder `src/components/<nama>/`
2. Buat `<nama>.tsx` — komponen utama
3. Buat `<nama>.stories.tsx` — Storybook stories
4. Buat `index.ts` — re-export
5. Export di `src/index.ts`

### Pola Komponen dengan CVA (class-variance-authority)
```tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90',
        outline: 'border border-input bg-transparent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
}
```

### Storybook Story Pattern
```tsx
// button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  component: Button,
}
export default meta

type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: { children: 'Click me' },
}

export const Outline: Story = {
  args: { variant: 'outline', children: 'Outline' },
}
```

### Sinkronisasi dengan web-dashboard
Komponen di `ui-kit` harus konsisten dengan yang ada di `apps/web-dashboard/components/ui/`.
Jika ada perubahan di ui-kit, update juga di web-dashboard atau sebaliknya.
