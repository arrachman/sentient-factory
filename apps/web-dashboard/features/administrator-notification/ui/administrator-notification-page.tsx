'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { notificationItems } from '@/features/administrator-notification/model/notification-data';

type QuickFilter = 'all' | 'unread' | 'read';

export default function AdministratorNotificationPage() {
  const [items, setItems] = useState(notificationItems);
  const [activeFilter, setActiveFilter] = useState<QuickFilter>('all');

  const filteredItems = useMemo(() => {
    switch (activeFilter) {
      case 'unread':
        return items.filter((item) => !item.isRead);
      case 'read':
        return items.filter((item) => item.isRead);
      default:
        return items;
    }
  }, [activeFilter, items]);

  const filterButtons: Array<{ key: QuickFilter; label: string; count: number }> = [
    { key: 'all', label: 'All', count: items.length },
    { key: 'unread', label: 'Belum Dibaca', count: items.filter((item) => !item.isRead).length },
    { key: 'read', label: 'Sudah Dibaca', count: items.filter((item) => item.isRead).length },
  ];

  const markAsRead = (id: string) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, isRead: true } : item)));
  };

  const markAllAsRead = () => {
    setItems((current) => current.map((item) => ({ ...item, isRead: true })));
  };

  return (
    <div className="container max-w-5xl space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-medium leading-tight text-mono">Notifications</h1>
          <p className="text-sm text-secondary-foreground">Daftar notifikasi ERP dengan pembeda visual untuk unread dan aksi `Mark all as read`.</p>
        </div>

        <Button variant="ghost" onClick={markAllAsRead} className="text-sm text-muted-foreground hover:text-foreground">
          Mark all as read
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filterButtons.map((filter) => (
          <Button key={filter.key} variant={activeFilter === filter.key ? 'primary' : 'outline'} size="sm" onClick={() => setActiveFilter(filter.key)}>
            {filter.label}
            <Badge variant="secondary" appearance="light" className="ms-1">
              {filter.count}
            </Badge>
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className={!item.isRead ? 'cursor-pointer border-border bg-muted/50' : 'cursor-pointer bg-card'}>
            <CardContent className="flex items-start justify-between gap-4 px-5 py-4">
              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  {!item.isRead ? <span className="size-2 rounded-full bg-destructive" aria-hidden="true" /> : null}
                  <p className="font-medium text-foreground">{item.title}</p>
                </div>
                <p className="text-sm text-foreground/80">{item.description}</p>
                <p className="text-xs text-muted-foreground">{item.reference} • {item.timestamp} • {item.module}</p>
              </div>

              <div className="shrink-0">
                {!item.isRead ? (
                  <Button size="sm" variant="outline" onClick={() => markAsRead(item.id)}>
                    <CheckCircle2 />
                    Mark as read
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
