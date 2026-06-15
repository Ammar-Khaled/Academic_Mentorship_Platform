import { Navigate, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { AppLayout } from '@/components/layout/app-layout';
import { NotFoundPage } from '@/pages/not-found-page';

import { websiteRoutes } from './website.routes';
import { authRoutes } from './auth.routes';
import { mentorRoutes } from './mentor.routes';
import { adminRoutes } from './admin.routes';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AppLayout />}>
      {websiteRoutes}
      {authRoutes}
      {mentorRoutes}
      {adminRoutes}

      <Route path="404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Route>
  )
);