import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { HugeiconsIcon } from '@hugeicons/react';
import { MentorIcon, StudentIcon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import {
  AuthFooterLink,
  AuthPageShell,
  RoleOption,
} from '@/components/layout/auth-page-shell';
import { getHomePathForRole, UserRole } from '@/lib/roles';
import { getErrorMessage, useAuthStore } from '@/stores/auth-store';

export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const register = useAuthStore((state) => state.register);

  const initialRole =
    searchParams.get('role') === UserRole.MENTOR ? UserRole.MENTOR : UserRole.STUDENT;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initialRole);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const data = await register({ email, password, role });
      toast.success('Account created successfully!');
      navigate(getHomePathForRole(data.user.role), { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthPageShell
      title="Join Mentorship Hub"
      description="Create your account and choose whether you're here to learn or to mentor."
      sidebarTitle="Learn or lead — your choice"
      sidebarDescription="Students book expert code reviews. Mentors set their schedule and guide developers on their growth path."
      showHighlights={false}
      footer={
        <AuthFooterLink prompt="Already have an account?" linkText="Sign in" to="/login" />
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FieldGroup>
          <Field>
            <FieldLabel>I want to</FieldLabel>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <RoleOption
                selected={role === UserRole.STUDENT}
                onSelect={() => setRole(UserRole.STUDENT)}
                icon={StudentIcon}
                title="Learn"
                description="Find mentors and book 45-minute code review sessions."
              />
              <RoleOption
                selected={role === UserRole.MENTOR}
                onSelect={() => setRole(UserRole.MENTOR)}
                icon={MentorIcon}
                title="Mentor"
                description="Offer reviews, manage availability, and help others grow."
              />
            </div>
            <input type="hidden" name="role" value={role} />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email address</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              className="h-10"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="h-10"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
        </FieldGroup>

        <Button type="submit" className="h-10 w-full text-sm" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Spinner className="size-4" />
              Creating account...
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <HugeiconsIcon icon={role === UserRole.MENTOR ? MentorIcon : StudentIcon} strokeWidth={2} className="size-4" />
              {role === UserRole.MENTOR ? 'Create mentor account' : 'Create student account'}
            </span>
          )}
        </Button>
      </form>
    </AuthPageShell>
  );
}
