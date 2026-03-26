import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useLayout } from './context';
import { SidebarHeader } from './sidebar-header';
import { SidebarMenu } from './sidebar-menu';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const {
    sidebarCollapse,
    sidebarHoverExpand,
    setSidebarHoverExpand,
    sidebarTheme,
  } = useLayout();
  const pathname = usePathname();
  const isDarkSidebar = sidebarTheme === 'dark' || pathname.includes('dark-sidebar');
  const hoverOpenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHoverTimers = () => {
    if (hoverOpenTimerRef.current) {
      clearTimeout(hoverOpenTimerRef.current);
      hoverOpenTimerRef.current = null;
    }

    if (hoverCloseTimerRef.current) {
      clearTimeout(hoverCloseTimerRef.current);
      hoverCloseTimerRef.current = null;
    }
  };

  useEffect(() => clearHoverTimers, []);

  const handleMouseEnter = () => {
    if (sidebarCollapse) {
      if (hoverCloseTimerRef.current) {
        clearTimeout(hoverCloseTimerRef.current);
        hoverCloseTimerRef.current = null;
      }

      if (!hoverOpenTimerRef.current) {
        hoverOpenTimerRef.current = setTimeout(() => {
          setSidebarHoverExpand(true);
          hoverOpenTimerRef.current = null;
        }, 120);
      }
    }
  };

  const handleMouseLeave = () => {
    if (sidebarCollapse) {
      if (hoverOpenTimerRef.current) {
        clearTimeout(hoverOpenTimerRef.current);
        hoverOpenTimerRef.current = null;
      }

      if (!hoverCloseTimerRef.current) {
        hoverCloseTimerRef.current = setTimeout(() => {
          setSidebarHoverExpand(false);
          hoverCloseTimerRef.current = null;
        }, 90);
      }
    }
  };

  return (
    <>
      {sidebarCollapse && !sidebarHoverExpand && (
        <div
          className="sidebar-hover-trigger hidden lg:block lg:fixed lg:start-0 lg:top-0 lg:bottom-0 lg:z-20"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={clearHoverTimers}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          'sidebar lg:fixed lg:top-0 lg:bottom-0 lg:z-20 lg:flex shrink-0 flex-col items-stretch lg:border-e',
          isDarkSidebar
            ? 'dark bg-[#1E1E2D] lg:border-[#2B2B40]'
            : 'bg-[#F5F8FA] lg:border-slate-200/80',
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <SidebarHeader />
        <div className="overflow-hidden">
          <div className="w-(--sidebar-default-width)">
            <SidebarMenu />
          </div>
        </div>
      </div>
    </>
  );
}
