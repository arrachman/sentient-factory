'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function TriageFiltersBar({
  search,
  setSearch,
  triageStatusFilter,
  setTriageStatusFilter,
  acknowledgedFilter,
  setAcknowledgedFilter,
  slaStatusFilter,
  setSlaStatusFilter,
  moduleFilter,
  setModuleFilter,
  stageFilter,
  setStageFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}: {
  search: string;
  setSearch: (value: string) => void;
  triageStatusFilter: string;
  setTriageStatusFilter: (value: string) => void;
  acknowledgedFilter: string;
  setAcknowledgedFilter: (value: string) => void;
  slaStatusFilter: string;
  setSlaStatusFilter: (value: string) => void;
  moduleFilter: string;
  setModuleFilter: (value: string) => void;
  stageFilter: string;
  setStageFilter: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <Input value={search} onChange={(event) => setSearch(event.currentTarget.value)} placeholder="Search event, rule, target, owner..." />
      <Select value={triageStatusFilter} onValueChange={setTriageStatusFilter}>
        <SelectTrigger><SelectValue placeholder="Triage Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="investigating">Investigating</SelectItem>
          <SelectItem value="requeued">Requeued</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
        </SelectContent>
      </Select>
      <Select value={acknowledgedFilter} onValueChange={setAcknowledgedFilter}>
        <SelectTrigger><SelectValue placeholder="Acknowledgement" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Ack States</SelectItem>
          <SelectItem value="acknowledged">Acknowledged</SelectItem>
          <SelectItem value="unacknowledged">Unacknowledged</SelectItem>
        </SelectContent>
      </Select>
      <Select value={slaStatusFilter} onValueChange={setSlaStatusFilter}>
        <SelectTrigger><SelectValue placeholder="SLA State" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All SLA States</SelectItem>
          <SelectItem value="healthy">Healthy</SelectItem>
          <SelectItem value="warning">Warning</SelectItem>
          <SelectItem value="overdue">Overdue</SelectItem>
          <SelectItem value="critical">Critical</SelectItem>
        </SelectContent>
      </Select>
      <Select value={moduleFilter} onValueChange={setModuleFilter}>
        <SelectTrigger><SelectValue placeholder="Module" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Modules</SelectItem>
          <SelectItem value="sales">Sales</SelectItem>
          <SelectItem value="finance">Finance</SelectItem>
          <SelectItem value="warehouse">Warehouse</SelectItem>
          <SelectItem value="purchasing">Purchasing</SelectItem>
        </SelectContent>
      </Select>
      <Select value={stageFilter} onValueChange={setStageFilter}>
        <SelectTrigger><SelectValue placeholder="Stage" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Stages</SelectItem>
          <SelectItem value="none">No Stage Policy</SelectItem>
          <SelectItem value="staged">Has Stage Policy</SelectItem>
          <SelectItem value="pending">Pending Next Stage</SelectItem>
          <SelectItem value="final">Final Stage</SelectItem>
          <SelectItem value="reminder">Reminder Mode</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger><SelectValue placeholder="Sort By" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="dead_lettered_at">Dead Lettered At</SelectItem>
          <SelectItem value="age_minutes">Age Minutes</SelectItem>
          <SelectItem value="sla_due_at">SLA Due At</SelectItem>
          <SelectItem value="triage_updated_at">Updated At</SelectItem>
          <SelectItem value="escalation_count">Escalation Count</SelectItem>
          <SelectItem value="event_title">Event Title</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortOrder} onValueChange={setSortOrder}>
        <SelectTrigger><SelectValue placeholder="Sort Order" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">Descending</SelectItem>
          <SelectItem value="asc">Ascending</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        onClick={() => {
          setSearch('');
          setTriageStatusFilter('all');
          setAcknowledgedFilter('all');
          setSlaStatusFilter('all');
          setModuleFilter('all');
          setStageFilter('all');
          setSortBy('dead_lettered_at');
          setSortOrder('desc');
        }}
      >
        Reset Filters
      </Button>
    </div>
  );
}
