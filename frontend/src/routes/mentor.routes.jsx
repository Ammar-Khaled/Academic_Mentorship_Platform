import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserRole } from "@/lib/roles";
import { MentorDashboardPage } from "@/pages/mentor/Dashboard/index";
import { MentorProfilePage } from "@/pages/mentor/Profile/index";
import { MentorDiscoveryPage } from "@/pages/mentor/Discovery/index";
import { PublicMentorProfilePage } from "@/pages/mentor/PublicProfile/index";
import MentorAvailabilityPage from "@/pages/mentor/Availability/index";
import MentorEvaluationNotesPage from "@/pages/mentor/EvaluationNotes/index";
import MentorSessionsPage from "@/pages/mentor/Sessions/index";

export const mentorRoutes = (
  <Route element={<ProtectedRoute allowedRoles={[UserRole.MENTOR]} />}>
    <Route path="mentor" element={<MentorDashboardPage />} />
    <Route path="mentor/profile" element={<MentorProfilePage />} />
    <Route path="mentors" element={<MentorDiscoveryPage />} />
    <Route path="mentors/:id" element={<PublicMentorProfilePage />} />
    <Route path="mentor/availability" element={<MentorAvailabilityPage />} />
    <Route path="mentor/sessions" element={<MentorSessionsPage />} />
    <Route path="mentor/evaluations" element={<MentorEvaluationNotesPage />} />
  </Route>
);
