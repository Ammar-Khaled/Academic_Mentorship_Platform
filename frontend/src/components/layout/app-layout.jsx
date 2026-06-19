import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';
import { getHomePathForRole } from '@/lib/roles';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { Navbar } from './navbar';

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
  return (
    <div className="relative min-h-screen bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-linear-to-b from-primary/5 to-transparent"
      />

      <Navbar />

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
