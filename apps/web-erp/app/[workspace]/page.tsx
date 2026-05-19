import { AppShell } from '@/components/templates/app-shell';

interface Props {
  params: Promise<{ workspace: string }>;
}

export default async function WorkspacePage({ params }: Props) {
  const { workspace } = await params;
  return <AppShell workspaceId={workspace} />;
}
