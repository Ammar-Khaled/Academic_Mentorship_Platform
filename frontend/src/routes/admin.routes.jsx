import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { AdminLayout } from '@/components/layout/admin-layout';
import { UserRole } from '@/lib/roles';
import { AdminDashboardPage } from '@/pages/dashboard-pages';
import { AdminUserManagementPage } from '@/pages/admin/user-management-page';
import { AdminAuditLogsPage } from '@/pages/admin/audit-logs-page';
import { AdminStackManagementPage } from '@/pages/admin/stack-management-page';

export const adminRoutes = (
  <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
    <Route element={<AdminLayout />}>
      <Route path="admin" element={<AdminDashboardPage />} />
      <Route path="admin/users" element={<AdminUserManagementPage />} />
      <Route path="admin/audit" element={<AdminAuditLogsPage />} />
      <Route path="admin/stacks" element={<AdminStackManagementPage />} />
    </Route>
  </Route>
);