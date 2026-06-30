import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { LayoutDashboard, Users, BarChart3, Package, LogOut } from 'lucide-react';

const menuItems = [
  {
    icon: LayoutDashboard,
    label: 'Overview',
    href: '/admin',
  },
  {
    icon: Users,
    label: 'User Management',
    href: '/admin/users',
  },
  {
    icon: BarChart3,
    label: 'Audit Logs',
    href: '/admin/audit',
  },
  {
    icon: Package,
    label: 'Tech Stacks',
    href: '/admin/stacks',
  },
];

export function AdminSidebar() {
  const location = useLocation();
  const { logout } = useAuthStore();

  const isActive = (href) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside className="hidden border-r bg-muted/40 lg:block">
      <nav className="flex flex-col gap-2 p-4">
        <div className="mb-4">
          <h2 className="px-2 text-lg font-semibold">Admin Panel</h2>
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'inline-flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                isActive(item.href)
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="size-5" strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}

        <div className="mt-auto border-t pt-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="size-5" strokeWidth={2} />
            Logout
          </Button>
        </div>
      </nav>
    </aside>
  );
}
