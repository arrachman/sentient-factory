import { useEffect, useState } from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  Bell,
  ChevronRight,
  Menu,
  Search,
  Settings,
} from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { NotificationsSheet } from '@/components/layouts/app/shared/topbar/notifications-sheet';
import { UserDropdownMenu } from '@/components/layouts/app/shared/topbar/user-dropdown-menu';
import { SidebarMenu } from './sidebar-menu';
import { useLayout } from './context';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useMenu } from '@/hooks/use-menu';
import { useAppMenu } from './menu-context';

export function Header() {
  const [isSidebarSheetOpen, setIsSidebarSheetOpen] = useState(false);

  const pathname = usePathname();
  const mobileMode = useIsMobile();
  const { sidebarCollapse, setSidebarCollapse } = useLayout();
  const { menus } = useAppMenu();
  const { getBreadcrumb, getCurrentItem } = useMenu(pathname);
  const currentItem = getCurrentItem(menus);
  const breadcrumbItems = getBreadcrumb(menus);
  const fallbackTitle = pathname
    .split('/')
    .filter(Boolean)
    .pop()
    ?.split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') || 'Home';
  const pageTitle = currentItem?.title || fallbackTitle;
  const visibleBreadcrumbs = breadcrumbItems.length > 0
    ? breadcrumbItems
    : [{ title: pageTitle, path: pathname }];

  // Close sheet when route changes
  useEffect(() => {
    setIsSidebarSheetOpen(false);
  }, [pathname]);

  return (
    <header
      className="header fixed top-0 z-10 start-0 end-0 flex shrink-0 items-stretch border-b border-border bg-background pe-[var(--removed-body-scroll-bar-size,0px)]"
    >
      <div className="container-fluid flex items-center gap-4">
        {/* HeaderLogo */}
        <div className="flex lg:hidden items-center gap-2.5">
          <Link href="/" className="shrink-0">
            <img
              src={toAbsoluteUrl('/media/app/mini-logo.svg')}
              className="h-[25px] w-full"
              alt="mini-logo"
            />
          </Link>
          <div className="flex items-center">
            {mobileMode && (
              <Sheet
                open={isSidebarSheetOpen}
                onOpenChange={setIsSidebarSheetOpen}
              >
                <SheetTrigger asChild>
                  <Button variant="ghost" mode="icon">
                    <Menu className="text-muted-foreground/70" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  className="p-0 gap-0 w-[275px]"
                  side="left"
                  close={false}
                >
                  <SheetHeader className="p-0 space-y-0">
                    <VisuallyHidden asChild>
                      <SheetTitle>Navigasi Sidebar</SheetTitle>
                    </VisuallyHidden>
                  </SheetHeader>
                  <SheetBody className="p-0 overflow-y-auto">
                    <SidebarMenu />
                  </SheetBody>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>

        <div className="hidden min-w-0 flex-1 items-center gap-4 lg:flex">
          <div className="flex min-w-[220px] items-center gap-3">
            {sidebarCollapse && (
              <Button
                variant="ghost"
                mode="icon"
                aria-label="Show sidebar"
                onClick={() => setSidebarCollapse(false)}
              >
                <Menu className="text-muted-foreground/70" />
              </Button>
            )}

            <div className="min-w-0">
              <div className="truncate text-lg font-bold tracking-[-0.01em] text-mono">
                {pageTitle}
              </div>
              <div className="mt-0.5 flex min-w-0 items-center gap-2 text-xs font-medium">
                <span className="shrink-0 text-muted-foreground">Workspace</span>
                {visibleBreadcrumbs.map((item, index) => {
                  const isLast = index === visibleBreadcrumbs.length - 1;

                  return (
                    <span key={`${item.title}-${index}`} className="flex min-w-0 items-center gap-1.5">
                      <ChevronRight className="size-3 shrink-0 text-muted-foreground/70" />
                      {item.path && !isLast ? (
                        <Link
                          href={item.path}
                          className="truncate text-muted-foreground hover:text-primary"
                        >
                          {item.title}
                        </Link>
                      ) : (
                        <span className={isLast ? 'truncate text-mono' : 'truncate text-muted-foreground'}>
                          {item.title}
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="ms-6 hidden h-[38px] min-w-[260px] max-w-[360px] flex-1 items-center gap-2 rounded-lg border border-[#eef0f5] bg-[#f4f6fa] px-3 text-[#78808f] xl:flex">
            <Search className="size-[15px] shrink-0 text-[#a1a8b5]" />
            <input
              aria-label="Search anything"
              className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-[#131720] outline-none placeholder:text-[#78808f]"
              placeholder="Search anything..."
            />
            <kbd className="rounded-[4px] border border-[#eef0f5] bg-white px-1.5 py-0.5 font-mono text-[10.5px] font-medium text-[#78808f]">
              ⌘K
            </kbd>
          </div>

          <div className="hidden shrink-0 items-center gap-2 xl:flex">
            <Button
              type="button"
              variant="outline"
              className="h-[31px] rounded-[7px] border-[#e1e4ed] bg-transparent px-2.5 text-xs font-semibold text-[#131720] hover:bg-[#f9fafc]"
            >
              <span className="size-2 rounded-full bg-emerald-500" />
              Realtime · 30s
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-[31px] rounded-[7px] border-[#e1e4ed] bg-transparent px-2.5 text-xs font-semibold text-[#131720] hover:bg-[#f9fafc]"
            >
              Reset Layout
            </Button>
            <select
              aria-label="Dashboard period"
              className="h-[31px] rounded-[7px] border border-[#e1e4ed] bg-[#fbfbfd] px-2.5 text-xs font-medium text-[#131720] outline-none"
              defaultValue="march-2026"
            >
              <option value="march-2026">March 2026</option>
            </select>
          </div>
        </div>

        <div className="ms-auto flex min-w-0 shrink-0 items-center gap-3">
          <NotificationsSheet
            trigger={
              <Button
                variant="ghost"
                mode="icon"
                className="size-[38px] rounded-lg border border-[#eef0f5] bg-[#fbfbfd] text-[#4b5263] hover:bg-[#f4f6fa] hover:text-[#131720]"
              >
                <Bell className="size-[17px]!" />
              </Button>
            }
          />
          <Button
            type="button"
            variant="ghost"
            mode="icon"
            aria-label="Settings"
            className="hidden size-[38px] rounded-lg border border-[#eef0f5] bg-[#fbfbfd] text-[#4b5263] hover:bg-[#f4f6fa] hover:text-[#131720] lg:inline-flex"
          >
            <Settings className="size-[17px]!" />
          </Button>
          <UserDropdownMenu
            trigger={
              <button
                type="button"
                className="flex shrink-0 cursor-pointer items-center gap-2.5 rounded-full border border-[#eef0f5] bg-[#fbfbfd] py-1 pe-2.5 ps-1 hover:bg-[#f4f6fa]"
              >
                <img
                  className="size-[30px] rounded-full border-2 border-green-500"
                  src={toAbsoluteUrl('/media/avatars/300-2.png')}
                  alt="User Avatar"
                />
                <span className="hidden text-left leading-none lg:block">
                  <span className="block text-[12.5px] font-semibold text-[#131720]">Senti Admin</span>
                  <span className="block text-[11px] text-[#78808f]">admin@sentient.id</span>
                </span>
              </button>
            }
          />
        </div>
      </div>
    </header>
  );
}
