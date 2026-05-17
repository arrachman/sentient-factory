/**
 * Sentient ERP — root entry. Renders the multi-tab application shell
 * (sidebar + topbar + tab bar + command palette) with the dashboard
 * page, ported from `prototype/`.
 */
import { AppShell } from '@/components/templates/app-shell';

export default function HomePage() {
  return <AppShell />;
}
