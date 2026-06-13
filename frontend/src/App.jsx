import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { AppLayout, GuestRoute } from '@/components/layout/app-layout';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { UserRole } from '@/lib/roles';
import { useAuthStore } from '@/stores/auth-store';
import {
  AdminDashboardPage,
  MentorDashboardPage,
  StudentDashboardPage,
} from '@/pages/dashboard-pages';
import { HomePage } from '@/pages/home-page';
import { LoginPage } from '@/pages/login-page';
import { NotFoundPage } from '@/pages/not-found-page';
import { RegisterPage } from '@/pages/register-page';

function AuthBootstrap({ children }) {
  const fetchProfile = useAuthStore((state) => state.fetchProfile);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />

        <Route element={<GuestRoute />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[UserRole.STUDENT]} />}>
          <Route path="student" element={<StudentDashboardPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[UserRole.MENTOR]} />}>
          <Route path="mentor" element={<MentorDashboardPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
          <Route path="admin" element={<AdminDashboardPage />} />
        </Route>

        <Route path="404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthBootstrap>
          <AppRoutes />
          <Toaster richColors position="top-right" />
        </AuthBootstrap>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
