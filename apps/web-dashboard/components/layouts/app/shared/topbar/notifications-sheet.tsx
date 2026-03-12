'use client';

import { cloneElement, isValidElement, ReactNode, useMemo, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { notificationItems } from '@/features/administrator-notification/model/notification-data';

export function NotificationsSheet({ trigger }: { trigger: ReactNode }) {
  const [items, setItems] = useState(notificationItems.slice(0, 5));

  const visibleItems = useMemo(() => items.slice(0, 5), [items]);
  const unreadCount = useMemo(() => items.filter((item) => !item.isRead).length, [items]);

  const markAsRead = (id: string) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, isRead: true } : item)));
  };

  const triggerWithBadge =
    isValidElement<{ className?: string; children?: ReactNode }>(trigger)
      ? cloneElement(trigger, {
        className: `relative ${trigger.props.className ?? ''}`.trim(),
        children: (
            <>
              {trigger.props.children}
              {unreadCount > 0 ? (
                <span className="absolute -end-0.5 -top-0.5 inline-flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium leading-4 text-destructive-foreground">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              ) : null}
            </>
          ),
        })
      : trigger;

  return (
    <Sheet>
      <SheetTrigger asChild>{triggerWithBadge}</SheetTrigger>
      <SheetContent className="inset-5 start-auto h-auto gap-0 rounded-lg p-0 sm:w-[520px] sm:max-w-none [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5">
        <SheetHeader className="border-b border-border px-4 py-3">
          <div>
            <SheetTitle>Notifications</SheetTitle>
          </div>
        </SheetHeader>

        <SheetBody className="p-4">
          <div className="flex h-[calc(100vh-11rem)] flex-col gap-3 overflow-hidden">
            <div className="flex-1 space-y-2 overflow-y-auto pe-1">
              {visibleItems.map((item) => (
                <div key={item.id} className={`cursor-pointer rounded-lg px-3 py-2.5 ${!item.isRead ? 'bg-muted/50' : 'bg-transparent'}`}>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {!item.isRead ? <span className="size-2 rounded-full bg-destructive" aria-hidden="true" /> : null}
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                    <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                    {!item.isRead ? (
                      <Button size="sm" variant="ghost" className="h-auto px-0 py-0 text-xs text-muted-foreground hover:text-foreground" onClick={() => markAsRead(item.id)}>
                        Mark as read
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-2">
              <Button asChild variant="ghost" className="w-full justify-center text-sm">
                <Link href="/app/administrator/notification">View All</Link>
              </Button>
            </div>
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
