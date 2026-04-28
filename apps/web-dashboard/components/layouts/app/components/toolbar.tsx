import { Fragment, ReactNode, isValidElement } from 'react';
import { ChevronRight } from 'lucide-react';
import { MenuItem } from '@/config/types';
import { cn } from '@/lib/utils';
import { useMenu } from '@/hooks/use-menu';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAppMenu } from './menu-context';

export interface ToolbarHeadingProps {
  title?: string | ReactNode;
  description?: string | ReactNode;
}

function hasVisibleToolbarChild(node: ReactNode): boolean {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return false;
  }

  if (typeof node === 'string') {
    return node.trim().length > 0;
  }

  if (Array.isArray(node)) {
    return node.some((child) => hasVisibleToolbarChild(child));
  }

  if (!isValidElement(node)) {
    return true;
  }

  const props = node.props as { children?: ReactNode };

  if (node.type === Fragment) {
    return hasVisibleToolbarChild(props.children);
  }

  if (node.type === ToolbarPageTitle) {
    return false;
  }

  if (node.type === ToolbarHeading) {
    return hasVisibleToolbarChild(props.children);
  }

  return true;
}

function Toolbar({ children, className }: { children?: ReactNode; className?: string }) {
  if (!hasVisibleToolbarChild(children)) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-5 pb-7.5', className)}>
      {children}
    </div>
  );
}

function ToolbarActions({ children }: { children?: ReactNode }) {
  return <div className="flex items-center gap-2.5">{children}</div>;
}

function ToolbarBreadcrumbs() {
  const pathname = usePathname();
  const { menus } = useAppMenu();
  const { getBreadcrumb, isActive } = useMenu(pathname);
  const items: MenuItem[] = getBreadcrumb(menus);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex [.header_&]:below-lg:hidden items-center gap-1.25 text-xs lg:text-sm font-medium mb-2.5 lg:mb-0">
      <div className="breadcrumb flex items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const active = item.path ? isActive(item.path) : false;

          return (
            <Fragment key={index}>
              {item.path ? (
                <Link
                  href={item.path}
                  className={cn(
                    'flex items-center gap-1',
                    active
                      ? 'text-mono'
                      : 'text-muted-foreground hover:text-primary',
                  )}
                >
                  {item.title}
                </Link>
              ) : (
                <span
                  className={cn(isLast ? 'text-mono' : 'text-muted-foreground')}
                >
                  {item.title}
                </span>
              )}
              {!isLast && (
                <ChevronRight className="size-3.5 muted-foreground" />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

function ToolbarHeading ({ children }: { children: ReactNode }) {
  if (!hasVisibleToolbarChild(children)) {
    return null;
  }

  return <div className="flex flex-col justify-center gap-2">{children}</div>;
}

function ToolbarPageTitle ({ children }: { children?: string }) {
  return null;
};

function ToolbarDescription ({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-normal text-secondary-foreground">
      {children}
    </div>
  );
};

export { Toolbar, ToolbarActions, ToolbarBreadcrumbs, ToolbarHeading, ToolbarPageTitle, ToolbarDescription };
