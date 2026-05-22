import { AppShell } from '@/components/templates/app-shell';

interface Props {
  params: Promise<{ route: string[] }>;
}

/** Global (no-workspace) mode — deep route. /org/warehouses → initialRoute=/org/warehouses */
export default async function GlobalRoutePage({ params }: Props) {
  const { route } = await params;
  const initialRoute = '/org/' + route.join('/');
  return <AppShell initialRoute={initialRoute} />;
}
