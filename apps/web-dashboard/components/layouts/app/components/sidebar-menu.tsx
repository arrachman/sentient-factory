'use client';

import { JSX, MouseEvent, useCallback, useMemo } from 'react';
import { MenuConfig, MenuItem } from '@/config/types';
import { cn } from '@/lib/utils';
import {
  AccordionMenu,
  AccordionMenuClassNames,
  AccordionMenuGroup,
  AccordionMenuItem,
  AccordionMenuLabel,
  AccordionMenuSub,
  AccordionMenuSubContent,
  AccordionMenuSubTrigger,
} from '@/components/ui/accordion-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAppMenu } from './menu-context';
import { resolveSidebarSelectedValue } from './sidebar-menu-selection';
import { useLayout } from './context';

export function SidebarMenu() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { menus } = useAppMenu();
  const {
    sidebarCollapse,
    setSidebarCollapse,
    sidebarHoverExpand,
    setSidebarHoverExpand,
  } = useLayout();
  const currentPathWithQuery = searchParams.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;
  const currentQueryString = searchParams.toString();

  const resolvedSelectedValue = useMemo(() => {
    return resolveSidebarSelectedValue({
      menus,
      pathname,
      currentQueryString,
    });
  }, [menus, pathname, currentQueryString]);

  // Memoize matchPath to prevent unnecessary re-renders
  const matchPath = useCallback(
    (path: string): boolean => {
      const [pathOnly, queryString] = path.split('?');
      if (queryString) {
        if (pathOnly !== pathname) {
          return false;
        }

        const expectedParams = new URLSearchParams(queryString);
        const currentParams = new URLSearchParams(currentQueryString);
        let isMatch = true;
        expectedParams.forEach((value, key) => {
          if (currentParams.get(key) !== value) {
            isMatch = false;
          }
        });
        return isMatch;
      }

      const samePath = pathOnly === pathname;
      const isNestedPath = pathOnly.length > 1 && pathname.startsWith(`${pathOnly}/`);
      return samePath || isNestedPath;
    },
    [pathname, currentQueryString],
  );

  // Global classNames for consistent styling
  const classNames: AccordionMenuClassNames = {
    root: 'space-y-1',
    group: 'gap-px',
    label: 'px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6c7280]',
    separator: '',
    item: "h-[38px] rounded-md px-3 text-[13px] font-medium text-[#b6bcc9] transition before:pointer-events-none before:absolute before:start-[-12px] before:top-2 before:bottom-2 before:w-[3px] before:rounded-r-sm before:bg-transparent hover:bg-[#181c25] hover:text-white data-[selected=true]:bg-[rgba(62,151,255,0.12)] data-[selected=true]:font-medium data-[selected=true]:text-white data-[selected=true]:before:bg-[#3e97ff] [&_svg]:size-[18px] [&_svg]:stroke-[1.8] [&_svg]:opacity-85 data-[selected=true]:[&_svg]:text-[#3e97ff] data-[selected=true]:[&_svg]:opacity-100",
    sub: '',
    subTrigger: "h-[38px] rounded-md px-3 text-[13px] font-medium text-[#b6bcc9] transition before:pointer-events-none before:absolute before:start-[-12px] before:top-2 before:bottom-2 before:w-[3px] before:rounded-r-sm before:bg-transparent hover:bg-[#181c25] hover:text-white data-[state=open]:bg-[rgba(62,151,255,0.08)] data-[state=open]:text-white [&_svg]:size-[18px] [&_svg]:stroke-[1.8] [&_svg]:opacity-85",
    subContent: 'py-0 ps-[30px]',
    subWrapper: 'border-s border-[#1e2330] ps-2 py-1',
    indicator: 'text-[#6c7280]',
  };

  const buildMenu = (items: MenuConfig): JSX.Element[] => {
    return items.map((item: MenuItem, index: number) => {
      if (item.heading) {
        return buildMenuHeading(item, index);
      } else if (item.disabled) {
        return buildMenuItemRootDisabled(item, index);
      } else {
        return buildMenuItemRoot(item, index);
      }
    });
  };

  const buildMenuItemRoot = (item: MenuItem, index: number): JSX.Element => {
    if (item.children) {
      return (
        <AccordionMenuSub key={index} value={item.path || `root-${index}`}>
          <AccordionMenuSubTrigger>
            {item.icon && <item.icon data-slot="accordion-menu-icon" />}
            <span data-slot="accordion-menu-title">{item.title}</span>
          </AccordionMenuSubTrigger>
          <AccordionMenuSubContent
            type="single"
            collapsible
            parentValue={item.path || `root-${index}`}
          >
            <AccordionMenuGroup>
              {buildMenuItemChildren(item.children, 1)}
            </AccordionMenuGroup>
          </AccordionMenuSubContent>
        </AccordionMenuSub>
      );
    } else {
      return (
        <AccordionMenuItem key={index} value={item.path || ''}>
          <Link
            href={item.path || '#'}
            className="flex items-center justify-start grow gap-2 text-left"
          >
            {item.icon && <item.icon data-slot="accordion-menu-icon" />}
            <span data-slot="accordion-menu-title">{item.title}</span>
          </Link>
        </AccordionMenuItem>
      );
    }
  };

  const buildMenuItemRootDisabled = (
    item: MenuItem,
    index: number,
  ): JSX.Element => {
    return (
        <AccordionMenuItem key={index} value={`disabled-${index}`}>
        {item.icon && <item.icon data-slot="accordion-menu-icon" />}
        <span data-slot="accordion-menu-title">{item.title}</span>
        {item.disabled && (
          <Badge variant="secondary" size="sm" className="ms-auto me-[-10px]">
            Soon
          </Badge>
        )}
      </AccordionMenuItem>
    );
  };

  const buildMenuItemChildren = (
    items: MenuConfig,
    level: number = 0,
  ): JSX.Element[] => {
    return items.map((item: MenuItem, index: number) => {
      if (item.disabled) {
        return buildMenuItemChildDisabled(item, index, level);
      } else {
        return buildMenuItemChild(item, index, level);
      }
    });
  };

  const buildMenuItemChild = (
    item: MenuItem,
    index: number,
    level: number = 0,
  ): JSX.Element => {
    if (item.children) {
      return (
        <AccordionMenuSub
          key={index}
          value={item.path || `child-${level}-${index}`}
        >
          <AccordionMenuSubTrigger>
            {item.collapse ? (
              <span className="text-muted-foreground">
                <span className="hidden [[data-state=open]>span>&]:inline">
                  {item.collapseTitle}
                </span>
                <span className="inline [[data-state=open]>span>&]:hidden">
                  {item.expandTitle}
                </span>
              </span>
            ) : (
              item.title
            )}
          </AccordionMenuSubTrigger>
          <AccordionMenuSubContent
            type="single"
            collapsible
            parentValue={item.path || `child-${level}-${index}`}
            className={cn(
              'ps-2',
              !item.collapse && 'relative',
              !item.collapse && (level > 0 ? '' : ''),
            )}
          >
            <AccordionMenuGroup>
              {buildMenuItemChildren(
                item.children,
                item.collapse ? level : level + 1,
              )}
            </AccordionMenuGroup>
          </AccordionMenuSubContent>
        </AccordionMenuSub>
      );
    } else {
      return (
        <AccordionMenuItem key={index} value={item.path || ''}>
          <Link href={item.path || '#'}>{item.title}</Link>
        </AccordionMenuItem>
      );
    }
  };

  const buildMenuItemChildDisabled = (
    item: MenuItem,
    index: number,
    level: number = 0,
  ): JSX.Element => {
    return (
      <AccordionMenuItem
        key={index}
        value={`disabled-child-${level}-${index}`}
      >
        <span data-slot="accordion-menu-title">{item.title}</span>
        {item.disabled && (
          <Badge variant="secondary" size="sm" className="ms-auto me-[-10px]">
            Soon
          </Badge>
        )}
      </AccordionMenuItem>
    );
  };

  const buildMenuHeading = (item: MenuItem, index: number): JSX.Element => {
    return <AccordionMenuLabel key={index}>{item.heading}</AccordionMenuLabel>;
  };

  const handleMenuClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const clickedLink = target.closest('a[href]') as HTMLAnchorElement | null;

    if (
      clickedLink &&
      clickedLink.getAttribute('href') !== '#' &&
      sidebarCollapse &&
      sidebarHoverExpand
    ) {
      requestAnimationFrame(() => {
        setSidebarHoverExpand(false);
        setSidebarCollapse(true);
      });
      return;
    }

    if (!sidebarCollapse) {
      return;
    }
  };

  return (
    <ScrollArea
      className="flex h-full grow shrink-0 px-3 py-4"
      onClickCapture={handleMenuClickCapture}
    >
      <div className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6c7280]">
        Workspace
      </div>
      <AccordionMenu
        selectedValue={resolvedSelectedValue ?? currentPathWithQuery}
        matchPath={matchPath}
        type="single"
        collapsible
        classNames={classNames}
      >
        {buildMenu(menus)}
      </AccordionMenu>
    </ScrollArea>
  );
}
