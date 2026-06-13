import { Link, Navigate, Outlet } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { CodeIcon } from '@hugeicons/core-free-icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ModeToggle } from '@/components/theme/mode-toggle';
import { getHomePathForRole } from '@/lib/roles';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

function UserBadge({ user }) {
  const initials = user.email.slice(0, 2).toUpperCase();

  return (
    <div className="hidden items-center gap-3 rounded-full border bg-muted/40 py-1 pl-1 pr-3 sm:flex">
      <div className="flex size-7 items-center justify-center rounded-full bg-primary text-[0.65rem] font-semibold text-primary-foreground">
        {initials}
      </div>
      <div className="flex flex-col">
        <span className="max-w-[10rem] truncate text-xs font-medium">{user.email}</span>
        <span className="text-[0.65rem] capitalize text-muted-foreground">{user.role}</span>
      </div>
    </div>
  );
}

export function GuestRoute() {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Spinner className="size-6" />
        <p className="text-xs text-muted-foreground">Loading your session...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={getHomePathForRole(user.role)} replace />;
  }

  return <Outlet />;
}

export function AppLayout() {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <div className="relative min-h-screen bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-linear-to-b from-primary/5 to-transparent"
      />

      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
              <HugeiconsIcon icon={CodeIcon} strokeWidth={2} className="size-4.5" />
            </span>
            <div className="flex flex-col">
              <span className="font-heading text-sm font-semibold leading-none">Mentorship Hub</span>
              <span className="text-[0.65rem] text-muted-foreground">Code review platform</span>
            </div>
          </Link>

          <nav className="flex items-center gap-1.5">
            <ModeToggle />

            {isAuthenticated ? (
              <>
                <UserBadge user={user} />
                <Badge variant="outline" className="capitalize sm:hidden">
                  {user.role}
                </Badge>
                <Button variant="outline" size="sm" asChild>
                  <Link to={getHomePathForRole(user.role)}>Dashboard</Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Sign up</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className={cn('mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10')}>
        <Outlet />
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
          <p>Mentorship Hub</p>
        </div>
      </footer>
    </div>
  );
}
