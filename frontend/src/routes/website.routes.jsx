import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserRole } from "@/lib/roles";
import { StudentDashboardPage } from "@/pages/dashboard-pages";
import { HomePage } from "@/pages/home-page";
import { StudentSessionsPage } from "@/pages/student/sessions-page";

export const websiteRoutes = (
  <>
    <Route index element={<HomePage />} />

    <Route element={<ProtectedRoute allowedRoles={[UserRole.STUDENT]} />}>
      <Route path="student" element={<StudentDashboardPage />} />
      <Route path="dashboard/sessions" element={<StudentSessionsPage />} />
    </Route>
  </>
);

