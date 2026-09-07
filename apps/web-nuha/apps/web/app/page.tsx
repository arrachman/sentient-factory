import { DashboardSummary } from '../components/organisms/DashboardSummary';
import { DashboardTemplate } from '../components/templates/DashboardTemplate';

export default function HomePage() {
  return (
    <DashboardTemplate>
      <DashboardSummary />
    </DashboardTemplate>
  );
}
