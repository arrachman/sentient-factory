import { ReactNode, useMemo } from 'react';
import {
  Moon,
  UserCircle,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';

export function UserDropdownMenu({ trigger }: { trigger: ReactNode }) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const user = useMemo(() => getUserFromTokenCookie(), []);

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  const handleLogout = () => {
    document.cookie = 'sf_token=; Path=/; Max-Age=0; SameSite=Lax';
    router.replace('/auth/login');
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" side="bottom" align="end">
        {/* Header */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <img
              className="size-9 rounded-full border-2 border-green-500"
              src={toAbsoluteUrl('/media/avatars/300-2.png')}
              alt="User avatar"
            />
            <div className="flex flex-col">
              <Link
                href="#"
                className="text-sm text-mono hover:text-primary font-semibold"
              >
                {user.name}
              </Link>
              <a
                href={`mailto:${user.email}`}
                className="text-xs text-muted-foreground hover:text-primary"
              >
                {user.email}
              </a>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            href="#"
            className="flex items-center gap-2"
          >
            <UserCircle />
            My Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Footer */}
        <DropdownMenuItem
          className="flex items-center gap-2"
          onSelect={(event) => event.preventDefault()}
        >
          <Moon />
          <div className="flex items-center gap-2 justify-between grow">
            Dark Mode
            <Switch
              size="sm"
              checked={theme === 'dark'}
              onCheckedChange={handleThemeToggle}
            />
          </div>
        </DropdownMenuItem>
        <div className="p-2 mt-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getTokenFromCookie() {
  if (typeof document === 'undefined') {
    return '';
  }

  const tokenPart = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('sf_token='));

  if (!tokenPart) {
    return '';
  }

  const rawToken = tokenPart.substring('sf_token='.length);
  try {
    return decodeURIComponent(rawToken);
  } catch {
    return rawToken;
  }
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) {
      return null;
    }

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const payload = atob(padded);
    return JSON.parse(payload) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function getUserFromTokenCookie() {
  const token = getTokenFromCookie();
  const payload = token ? decodeJwtPayload(token) : null;

  const email = typeof payload?.email === 'string' && payload.email.length > 0 ? payload.email : '-';
  const name =
    (typeof payload?.fullName === 'string' && payload.fullName.length > 0
      ? payload.fullName
      : typeof payload?.name === 'string' && payload.name.length > 0
        ? payload.name
        : 'User');

  return {
    name,
    email,
  };
}
