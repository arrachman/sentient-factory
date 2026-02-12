import { ReactNode } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function NotificationsSheet({ trigger }: { trigger: ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="gap-0 sm:w-[500px] inset-5 start-auto h-auto rounded-lg p-0 sm:max-w-none [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="mb-0">
          <SheetTitle className="p-3">Notifications</SheetTitle>
        </SheetHeader>
        <SheetBody className="grow p-5">
          <div className="flex h-[calc(100vh-11rem)] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 text-center">
            <Bell className="mb-3 size-6 text-muted-foreground" />
            <p className="text-sm font-medium text-mono">No notifications yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              New updates will appear here.
            </p>
            <Button variant="outline" size="sm" className="mt-4">
              Refresh
            </Button>
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
