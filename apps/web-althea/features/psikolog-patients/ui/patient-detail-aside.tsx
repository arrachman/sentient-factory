'use client';

/**
 * Detail panel kanan halaman Klien saya — composer dari sub-cards.
 *
 * Layout vertikal: header → kontak → sesi mendatang → progres paket
 * (kalau ada) → asesmen (stub) → catatan klinis → privacy reminder.
 */
import type { AggregatedClient } from '../model/types';
import { AssessmentCard } from './aside/assessment-card';
import { ClinicalNotesSection } from './aside/clinical-notes-section';
import { ContactCard } from './aside/contact-card';
import { DetailHeader } from './aside/detail-header';
import { NextSessionCard } from './aside/next-session-card';
import { PrivacyReminder } from './aside/privacy-reminder';
import { ProgressCard } from './aside/progress-card';

export function PatientDetailAside({
  client,
}: {
  client: AggregatedClient;
}) {
  const sesiPct = Math.round(
    (client.sessionN / Math.max(1, client.sessionTotal)) * 100,
  );

  return (
    <aside
      className="hidden lg:block"
      style={{
        width: 380,
        padding: 22,
        background: 'var(--cream-50)',
        overflow: 'auto',
        flexShrink: 0,
      }}
    >
      <DetailHeader client={client} />
      <ContactCard wa={client.wa} email={client.email} />
      <NextSessionCard
        next={client.next}
        room={client.nextRoom}
        sessionN={client.sessionN}
        sessionTotal={client.sessionTotal}
      />
      {client.sessionTotal > 0 ? (
        <ProgressCard
          service={client.service}
          sessionN={client.sessionN}
          sessionTotal={client.sessionTotal}
          pct={sesiPct}
          lastSession={client.lastSession}
          lastGap={client.lastGap}
        />
      ) : null}
      <AssessmentCard />
      <ClinicalNotesSection />
      <PrivacyReminder />
    </aside>
  );
}
