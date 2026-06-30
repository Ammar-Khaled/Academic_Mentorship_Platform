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
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { BookSessionDialog } from '@/components/sessions/book-session-dialog';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { useMentors } from '@/pages/mentor/Discovery/hooks/useMentors';
import { useUpcomingSessions, useSessionHistory } from '@/hooks/use-sessions';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

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

function DashboardPage({ role, dynamicStats }) {
  const { user } = useAuthStore();
  const config = dashboardConfig[role];
  const statsToRender = dynamicStats || config.stats;

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
        {statsToRender.map((stat) => (
          <Card key={stat.label} className="bg-card/80">
            <CardHeader className="gap-2">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl font-semibold tracking-tight">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{dynamicStats ? 'Up to date metrics' : 'Live data arrives in Phase 2'}</p>
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
  const { user } = useAuthStore();
  const config = dashboardConfig.student;
  const { mentors, loading } = useMentors({ limit: 20 });

  const { data: upcoming = [] } = useUpcomingSessions();
  const { data: history = [] } = useSessionHistory();

  const dynamicStats = [
    { label: 'Upcoming sessions', value: upcoming.length },
    { label: 'Completed reviews', value: history.filter(s => s.status === 'Completed').length },
    { label: 'Available mentors', value: mentors.length },
  ];

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
            {user?.role ?? 'student'}
          </Badge>
        </PageHeader>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-2 text-sm backdrop-blur-sm">
          <span className="text-muted-foreground">Signed in as</span>
          <span className="font-medium">{user?.email}</span>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {dynamicStats.map((stat) => (
          <Card key={stat.label} className="bg-card/80">
            <CardHeader className="gap-2">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl font-semibold tracking-tight">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Up to date metrics</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-heading text-lg font-semibold">Quick actions</h2>
          <p className="text-sm text-muted-foreground">
            Select an action to browse mentors or view your sessions.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {config.actions.map((action) => {
            const isSessions = action.title === 'My sessions';
            const isBrowse = action.title === 'Browse mentors';
            
            const cardContent = (
              <Card className="h-full transition-colors hover:bg-muted/30 cursor-pointer">
                <CardHeader className="gap-3">
                  <div className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <HugeiconsIcon icon={action.icon} strokeWidth={2} className="size-5" />
                  </div>
                  <CardTitle className="text-base">{action.title}</CardTitle>
                  <CardDescription className="leading-relaxed">{action.body}</CardDescription>
                </CardHeader>
              </Card>
            );

            if (isSessions) {
              return (
                <Link key={action.title} to="/dashboard/sessions">
                  {cardContent}
                </Link>
              );
            }

            if (isBrowse) {
              return (
                <a key={action.title} href="#available-mentors">
                  {cardContent}
                </a>
              );
            }

            if (action.title === 'Profile') {
              return (
                <Link key={action.title} to="/dashboard/profile">
                  {cardContent}
                </Link>
              );
            }

            return <div key={action.title}>{cardContent}</div>;
          })}
        </div>
      </section>

      <section id="available-mentors" className="space-y-4 pt-4">
        <div>
          <h2 className="font-heading text-lg font-semibold">Available Mentors</h2>
          <p className="text-sm text-muted-foreground">
            Select a mentor and book a 45-minute review session.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12 text-muted-foreground text-sm">
            Loading available mentors...
          </div>
        ) : mentors.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground text-sm">
              No mentors available at the moment.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mentors.map((mentor) => (
              <Card key={mentor._id} className="flex flex-col justify-between border transition-all hover:shadow-md">
                <CardHeader className="gap-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-semibold">{mentor.name}</CardTitle>
                      <CardDescription className="text-xs font-medium text-primary uppercase tracking-wider">
                        {mentor.title}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      <span>★</span>
                      <span>{mentor.averageRating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <p className="text-sm text-muted-foreground min-h-[60px] line-clamp-3">
                    {mentor.bio}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.stack && (
                      <Badge variant="secondary" className="text-[10px]">
                        {mentor.stack.name}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between border-t pt-4">
                    <div>
                      <span className="text-xs text-muted-foreground">Rate:</span>
                      <p className="text-sm font-semibold">${mentor.hourlyRate}/hr</p>
                    </div>
                    <BookSessionDialog mentor={mentor}>
                      <Button size="sm">Book Session</Button>
                    </BookSessionDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function MentorDashboardPage() {
  return <DashboardPage role="mentor" />;
}

export function AdminDashboardPage() {
  const { data: users } = useQuery({ 
    queryKey: ['admin-users'], 
    queryFn: () => api.get('/admin/users').then(r => r.data) 
  });
  
  const { data: pendingMentors } = useQuery({ 
    queryKey: ['admin-pending'], 
    queryFn: () => api.get('/admin/users/pending').then(r => r.data) 
  });
  
  const { data: stacks } = useQuery({ 
    queryKey: ['stacks'], 
    queryFn: () => api.get('/stacks').then(r => r.data) 
  });

  const dynamicStats = [
    { label: 'Total users', value: users?.length ?? '—' },
    { label: 'Pending mentors', value: pendingMentors?.length ?? '—' },
    { label: 'Active stacks', value: stacks?.length ?? '—' },
  ];

  return <DashboardPage role="admin" dynamicStats={dynamicStats} />;
}
