import { tomorrowDateStr } from './wizard-utils';

export type WizardSession = { date: string; slotIdx: number | null };

export type WizardState = {
  clientId: number | null;
  serviceId: number | null;
  psikologUserId: number | null;
  roomId: number | null;
  sessions: WizardSession[];
  intervalDays: number;
  notes: string;
};

export const INIT: WizardState = {
  clientId: null,
  serviceId: null,
  psikologUserId: null,
  roomId: null,
  sessions: [{ date: tomorrowDateStr(), slotIdx: null }],
  intervalDays: 7,
  notes: '',
};
