import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export function AdminLayout() {
  return (
    <div className="flex gap-8 min-h-full">
      <AdminSidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
