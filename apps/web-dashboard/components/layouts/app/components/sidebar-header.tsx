import { ChevronFirst, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLayout } from './context';
import Link from 'next/link';

export function SidebarHeader() {
  const { sidebarCollapse, setSidebarCollapse } = useLayout();

  const handleToggleClick = () => {
    setSidebarCollapse(!sidebarCollapse);
  };

  return (
    <div className="sidebar-header hidden shrink-0 items-center justify-between border-b border-[#1e2330] px-5 lg:flex">
      <Link href="/app/home" className="sidebar-logo flex min-w-0 items-center gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#3e97ff] to-[#7239ea] text-white shadow-[0_4px_12px_rgba(62,151,255,0.4)]">
          <ShieldCheck className="size-6 stroke-[2.4]" />
        </div>
        <div className="brand-text min-w-0 leading-none">
          <strong className="block text-[14px] font-bold tracking-[0.02em] text-white">
            SENTIENT
          </strong>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.14em] text-[#6c7280]">
            Factory OS
          </span>
        </div>
      </Link>
      <Button
        onClick={handleToggleClick}
        size="sm"
        mode="icon"
        variant="outline"
        className={cn(
          'absolute start-full top-2/4 z-30 size-7 -translate-x-2/4 -translate-y-2/4 border-[#1e2330] bg-[#181c25] text-[#b6bcc9] hover:bg-[#1d2330] hover:text-white rtl:translate-x-2/4',
          sidebarCollapse ? 'ltr:rotate-180' : 'rtl:rotate-180',
        )}
      >
        <ChevronFirst className="size-4!" />
      </Button>
    </div>
  );
}
