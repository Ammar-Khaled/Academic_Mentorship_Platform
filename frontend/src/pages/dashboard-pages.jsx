import { HugeiconsIcon } from '@hugeicons/react';
import {
  Calendar01Icon,
  DashboardCircleIcon,
  Search01Icon,
  Shield01Icon,
  StudentIcon,
  TeacherIcon,
  User02Icon,
} from '@hugeicons/core-free-icons';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

const dashboardConfig = {
  student: {
    eyebrow: 'Student workspace',
    title: 'Your learning dashboard',
    description: 'Track booked reviews, manage upcoming sessions, and review mentor feedback.',
    accent: 'from-sky-500/10 to-transparent',
    stats: [
      { label: 'Upcoming sessions', value: '—' },
      { label: 'Completed reviews', value: '—' },
      { label: 'Mentors saved', value: '—' },
    ],
    actions: [
      { icon: Search01Icon, title: 'Browse mentors', body: 'Discover experts by stack and rating.' },
      { icon: Calendar01Icon, title: 'My sessions', body: 'View and manage your booked slots.' },
      { icon: StudentIcon, title: 'Profile', body: 'Update your student profile details.' },
    ],
  },
  mentor: {
    eyebrow: 'Mentor workspace',
    title: 'Your mentorship dashboard',
    description: 'Set availability, monitor pending reviews, and deliver thoughtful evaluations.',
    accent: 'from-violet-500/10 to-transparent',
    stats: [
      { label: 'Pending reviews', value: '—' },
      { label: 'This week', value: '—' },
      { label: 'Average rating', value: '—' },
    ],
    actions: [
      { icon: Calendar01Icon, title: 'Availability', body: 'Configure your weekly operating hours.' },
      { icon: TeacherIcon, title: 'Sessions', body: 'Review upcoming and completed bookings.' },
      { icon: User02Icon, title: 'Profile', body: 'Edit bio, stack, and mentor details.' },
    ],
  },
  admin: {
    eyebrow: 'Admin workspace',
    title: 'Platform administration',
    description: 'Moderate users, approve mentors, and manage technical stack categories.',
    accent: 'from-amber-500/10 to-transparent',
    stats: [
      { label: 'Total users', value: '—' },
      { label: 'Pending mentors', value: '—' },
      { label: 'Active stacks', value: '—' },
    ],
    actions: [
      { icon: User02Icon, title: 'User moderation', body: 'Approve, block, and inspect accounts.' },
      { icon: Shield01Icon, title: 'Mentor verification', body: 'Review mentor applications and status.' },
      { icon: DashboardCircleIcon, title: 'Stack management', body: 'Create and maintain tech categories.' },
    ],
  },
};

function DashboardPage({ role }) {
  const { user } = useAuthStore();
  const config = dashboardConfig[role];

  return (
    <div className="flex flex-col gap-8">
      <section
        className={cn(
          'overflow-hidden rounded-3xl border bg-linear-to-br px-6 py-8 sm:px-8',
          config.accent,
        )}
      >
        <PageHeader
          eyebrow={config.eyebrow}
          title={config.title}
          description={config.description}
        >
          <Badge variant="outline" className="capitalize">
            {user.role}
          </Badge>
        </PageHeader>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-2 text-sm backdrop-blur-sm">
          <span className="text-muted-foreground">Signed in as</span>
          <span className="font-medium">{user.email}</span>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {config.stats.map((stat) => (
          <Card key={stat.label} className="bg-card/80">
            <CardHeader className="gap-2">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl font-semibold tracking-tight">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Live data arrives in Phase 2</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-heading text-lg font-semibold">Quick actions</h2>
          <p className="text-sm text-muted-foreground">
            These sections will become fully interactive as features are built.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {config.actions.map((action) => (
            <Card key={action.title} className="transition-colors hover:bg-muted/30">
              <CardHeader className="gap-3">
                <div className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <HugeiconsIcon icon={action.icon} strokeWidth={2} className="size-5" />
                </div>
                <CardTitle className="text-base">{action.title}</CardTitle>
                <CardDescription className="leading-relaxed">{action.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export function StudentDashboardPage() {
  return <DashboardPage role="student" />;
}

export function MentorDashboardPage() {
  return <DashboardPage role="mentor" />;
}

export function AdminDashboardPage() {
  return <DashboardPage role="admin" />;
}
