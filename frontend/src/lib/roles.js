export const UserRole = {
  ADMIN: 'admin',
  MENTOR: 'mentor',
  STUDENT: 'student',
};

export const ROLE_HOME = {
  [UserRole.ADMIN]: '/admin',
  [UserRole.MENTOR]: '/mentor',
  [UserRole.STUDENT]: '/student',
};

export function getHomePathForRole(role) {
  return ROLE_HOME[role] ?? '/';
}
