import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { UserRole } from '@/lib/roles';
import { MentorDashboardPage } from '@/pages/dashboard-pages';

export const mentorRoutes = (
  <Route element={<ProtectedRoute allowedRoles={[UserRole.MENTOR]} />}>
    <Route path="mentor" element={<MentorDashboardPage />} />
  </Route>
);