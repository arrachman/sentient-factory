import { Badge, type BadgeStatus } from '../atoms/Badge';
import { Card } from '../atoms/Card';
import { Text } from '../atoms/Text';

export type StatusCardProps = {
  label: string;
  value: string;
  detail: string;
  status?: BadgeStatus;
};

export function StatusCard({ label, value, detail, status = 'ok' }: StatusCardProps) {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
        <Text variant="label" tone="muted">{label}</Text>
        <Badge status={status}>{detail}</Badge>
      </div>
      <Text as="h2" variant="heading">{value}</Text>
    </Card>
  );
}
