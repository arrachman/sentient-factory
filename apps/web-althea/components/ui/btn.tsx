import { forwardRef } from 'react';

type BtnVariant = 'primary' | 'outline' | 'ghost' | 'danger';
type BtnSize = 'sm' | 'md';

export interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: BtnSize;
}

/**
 * Typed wrapper around the `.btn` CSS class system from althea-components.css.
 *
 * - `size="sm"` (default) → adds `.btn-sm` → height 30px
 * - `size="md"` → no size modifier → height 36px (base `.btn`)
 * - `variant` → adds `.btn-{variant}` (primary/outline/ghost/danger)
 *
 * Default `type="button"` prevents accidental form submission.
 */
export const Btn = forwardRef<HTMLButtonElement, BtnProps>(function Btn(
  {
    variant,
    size = 'sm',
    type = 'button',
    className = '',
    children,
    ...rest
  },
  ref,
) {
  const classes = [
    'btn',
    variant ? `btn-${variant}` : '',
    size === 'sm' ? 'btn-sm' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button ref={ref} type={type} className={classes} {...rest}>
      {children}
    </button>
  );
});
