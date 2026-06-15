import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserRole } from "@/lib/roles";
import { MentorDashboardPage } from "@/pages/mentor/Dashboard/index";
import { MentorProfilePage } from "@/pages/mentor/Profile/index";

export const mentorRoutes = (
  <Route element={<ProtectedRoute allowedRoles={[UserRole.MENTOR]} />}>
    <Route path="mentor" element={<MentorDashboardPage />} />
    <Route path="mentor/profile" element={<MentorProfilePage />} />
  </Route>
);
