import { AppShell } from '@/components/templates/app-shell';

interface Props {
  params: Promise<{ workspace: string; route: string[] }>;
}

export default async function WorkspaceRoutePage({ params }: Props) {
  const { workspace, route } = await params;
  const initialRoute = '/' + route.join('/');
  return <AppShell workspaceId={workspace} initialRoute={initialRoute} />;
}
