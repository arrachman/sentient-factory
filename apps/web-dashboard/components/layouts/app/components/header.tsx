import { useEffect, useState } from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  Bell,
  Menu,
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
  const { getCurrentItem } = useMenu(pathname);
  const currentItem = getCurrentItem(menus);
  const pageTitle = currentItem?.title || '';

  // Close sheet when route changes
  useEffect(() => {
    setIsSidebarSheetOpen(false);
  }, [pathname]);

  return (
    <header
      className="header fixed top-0 z-10 start-0 end-0 flex shrink-0 items-stretch border-b border-border bg-background pe-[var(--removed-body-scroll-bar-size,0px)]"
    >
      <div className="container-fluid flex justify-between items-stretch lg:gap-4">
        <div className="hidden lg:flex items-center">
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
        </div>

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

        <div className="ms-auto flex min-w-0 items-center gap-3">
          <div className="hidden min-w-0 flex-1 items-center lg:flex">
            <div className="min-w-0 truncate text-lg font-semibold leading-none text-mono xl:text-xl">
              {pageTitle}
            </div>
          </div>
          <NotificationsSheet
            trigger={
              <Button
                variant="ghost"
                mode="icon"
                shape="circle"
                className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
              >
                <Bell className="size-4.5!" />
              </Button>
            }
          />
          <UserDropdownMenu
            trigger={
              <img
                className="size-9 rounded-full border-2 border-green-500 shrink-0 cursor-pointer"
                src={toAbsoluteUrl('/media/avatars/300-2.png')}
                alt="User Avatar"
              />
            }
          />
        </div>
      </div>
    </header>
  );
}
