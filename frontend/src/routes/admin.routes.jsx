import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { UserRole } from '@/lib/roles';
import { AdminDashboardPage } from '@/pages/dashboard-pages';

export const adminRoutes = (
  <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
    <Route path="admin" element={<AdminDashboardPage />} />
  </Route>
);