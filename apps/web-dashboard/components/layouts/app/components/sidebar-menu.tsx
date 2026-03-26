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
    sidebarTheme,
  } = useLayout();
  const isDarkSidebar = sidebarTheme === 'dark' || pathname.includes('dark-sidebar');
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
    root: 'lg:ps-1 space-y-3',
    group: 'gap-px',
    label: cn(
      'pt-2.25 pb-px text-[11px] font-semibold uppercase tracking-[0.14em]',
      isDarkSidebar ? 'text-[#565674]' : 'text-[#A1A5B7]',
    ),
    separator: '',
    item: cn(
      "h-10 rounded-xl px-3 text-[13px] font-medium transition before:pointer-events-none before:absolute before:start-0 before:top-2 before:h-[calc(100%-1rem)] before:w-[3px] before:rounded-full before:bg-transparent [&_svg]:stroke-[1.75]",
      isDarkSidebar
        ? 'text-[#A1A5B7] hover:bg-[#1B1B28] hover:text-white data-[selected=true]:bg-[#1B84FF]/15 data-[selected=true]:font-semibold data-[selected=true]:text-white data-[selected=true]:before:bg-[#1B84FF]'
        : 'text-[#5E6278] hover:bg-white hover:text-[#009EF7] hover:shadow-[0px_0px_20px_0px_rgba(76,87,125,0.03)] data-[selected=true]:bg-[#009EF7]/10 data-[selected=true]:font-semibold data-[selected=true]:text-[#009EF7] data-[selected=true]:shadow-none data-[selected=true]:before:bg-[#009EF7]',
    ),
    sub: '',
    subTrigger: cn(
      "h-10 rounded-xl px-3 text-[13px] font-medium transition before:pointer-events-none before:absolute before:start-0 before:top-2 before:h-[calc(100%-1rem)] before:w-[3px] before:rounded-full before:bg-transparent [&_svg]:stroke-[1.75]",
      isDarkSidebar
        ? 'text-[#A1A5B7] hover:bg-[#1B1B28] hover:text-white data-[selected=true]:bg-[#1B84FF]/15 data-[selected=true]:font-semibold data-[selected=true]:text-white data-[selected=true]:before:bg-[#1B84FF]'
        : 'text-[#5E6278] hover:bg-white hover:text-[#009EF7] hover:shadow-[0px_0px_20px_0px_rgba(76,87,125,0.03)] data-[selected=true]:bg-[#009EF7]/10 data-[selected=true]:font-semibold data-[selected=true]:text-[#009EF7] data-[selected=true]:shadow-none data-[selected=true]:before:bg-[#009EF7]',
    ),
    subContent: 'py-0 ps-3',
    indicator: isDarkSidebar ? 'text-[#565674]' : '',
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
          <AccordionMenuSubTrigger className="text-sm font-medium">
            {item.icon && <item.icon data-slot="accordion-menu-icon" />}
            <span data-slot="accordion-menu-title">{item.title}</span>
          </AccordionMenuSubTrigger>
          <AccordionMenuSubContent
            type="single"
            collapsible
            parentValue={item.path || `root-${index}`}
            className="ps-6"
          >
            <AccordionMenuGroup>
              {buildMenuItemChildren(item.children, 1)}
            </AccordionMenuGroup>
          </AccordionMenuSubContent>
        </AccordionMenuSub>
      );
    } else {
      return (
        <AccordionMenuItem
          key={index}
          value={item.path || ''}
          className="text-sm font-medium"
        >
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
      <AccordionMenuItem
        key={index}
        value={`disabled-${index}`}
        className="text-sm font-medium"
      >
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
          <AccordionMenuSubTrigger className="text-[13px]">
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
              'ps-4',
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
        <AccordionMenuItem
          key={index}
          value={item.path || ''}
          className="text-[13px]"
        >
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
        className="text-[13px]"
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
      className="flex grow shrink-0 px-5 py-5 lg:h-[calc(100vh-5.5rem)]"
      onClickCapture={handleMenuClickCapture}
    >
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
