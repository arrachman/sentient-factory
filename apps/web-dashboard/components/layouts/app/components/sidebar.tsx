import { useEffect, useRef } from 'react';
import { useLayout } from './context';
import { SidebarHeader } from './sidebar-header';
import { SidebarMenu } from './sidebar-menu';

export function Sidebar() {
  const {
    sidebarCollapse,
    sidebarHoverExpand,
    setSidebarHoverExpand,
  } = useLayout();
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
        className="sidebar dark shrink-0 flex-col items-stretch bg-[#11141b] text-[#b6bcc9] lg:fixed lg:top-0 lg:bottom-0 lg:z-20 lg:flex lg:border-e lg:border-[#1e2330]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <SidebarHeader />
        <div className="min-h-0 flex-1 overflow-hidden">
          <div className="h-full w-(--sidebar-default-width)">
            <SidebarMenu />
          </div>
        </div>
        <div className="sidebar-footer flex shrink-0 items-center gap-2.5 border-t border-[#1e2330] px-3.5 py-3.5 text-xs">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#50cd89] to-[#17c653] text-xs font-bold text-white">
            N
          </div>
          <div className="min-w-0 leading-tight">
            <strong className="block truncate font-semibold text-white">Nadia Pratama</strong>
            <span className="block truncate text-[11px] text-[#6c7280]">Factory Admin</span>
          </div>
        </div>
      </div>
    </>
  );
}
