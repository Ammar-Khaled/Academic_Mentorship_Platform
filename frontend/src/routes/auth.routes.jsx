import { Route } from 'react-router-dom';
import { GuestRoute } from '@/components/layout/app-layout';
import { LoginPage } from '@/pages/login-page';
import { RegisterPage } from '@/pages/register-page';

export const authRoutes = (
  <Route element={<GuestRoute />}>
    <Route path="login" element={<LoginPage />} />
    <Route path="register" element={<RegisterPage />} />
  </Route>
);