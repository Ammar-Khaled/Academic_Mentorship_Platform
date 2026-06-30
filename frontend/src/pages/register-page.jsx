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
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Textarea } from '@/components/ui/textarea';

export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const register = useAuthStore((state) => state.register);

  const initialRole =
    searchParams.get('role') === UserRole.MENTOR ? UserRole.MENTOR : UserRole.STUDENT;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initialRole);
  
  // Profile state
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [title, setTitle] = useState('');
  const [stack, setStack] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: stacks = [] } = useQuery({
    queryKey: ['stacks'],
    queryFn: () => api.get('/stacks').then(r => r.data)
  });

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        email,
        password,
        role,
        name,
        bio,
        ...(role === UserRole.MENTOR ? {
          title,
          stack,
          hourlyRate: Number(hourlyRate) || 0
        } : {
          university,
          major
        })
      };
      
      const data = await register(payload);
      if (data.status === 'pending') {
        toast.success('Account created! Please wait for admin approval.');
        navigate('/login', { replace: true });
      } else {
        toast.success('Account created successfully!');
        navigate(getHomePathForRole(data.user.role), { replace: true });
      }
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

          <div className="pt-4 pb-2 border-b">
            <h3 className="font-semibold text-lg">Profile Details</h3>
          </div>

          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input
              id="name"
              required
              className="h-10"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="bio">Bio</FieldLabel>
            <Textarea
              id="bio"
              className="min-h-[80px]"
              placeholder="Tell us a bit about yourself"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </Field>

          {role === UserRole.MENTOR && (
            <>
              <Field>
                <FieldLabel htmlFor="title">Professional Title</FieldLabel>
                <Input
                  id="title"
                  required
                  className="h-10"
                  placeholder="e.g. Senior Software Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="stack">Primary Stack</FieldLabel>
                <select
                  id="stack"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={stack}
                  onChange={(e) => setStack(e.target.value)}
                >
                  <option value="" disabled>Select a stack</option>
                  {stacks.map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </Field>
              <Field>
                <FieldLabel htmlFor="hourlyRate">Hourly Rate ($)</FieldLabel>
                <Input
                  id="hourlyRate"
                  type="number"
                  min="0"
                  required
                  className="h-10"
                  placeholder="0"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                />
              </Field>
            </>
          )}

          {role === UserRole.STUDENT && (
            <>
              <Field>
                <FieldLabel htmlFor="university">University</FieldLabel>
                <Input
                  id="university"
                  className="h-10"
                  placeholder="Where do you study?"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="major">Major / Program</FieldLabel>
                <Input
                  id="major"
                  className="h-10"
                  placeholder="e.g. Computer Science"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                />
              </Field>
            </>
          )}
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
