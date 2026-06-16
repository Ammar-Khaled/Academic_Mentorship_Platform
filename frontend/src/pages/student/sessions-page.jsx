import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Empty, EmptyDescription, EmptyTitle } from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';
import { PageHeader } from '@/components/layout/page-header';
import { SessionCard } from '@/components/sessions/session-card';
import { RescheduleDialog } from '@/components/sessions/reschedule-dialog';
import { useUpcomingSessions, useSessionHistory, useCancelSession } from '@/hooks/use-sessions';

export function StudentSessionsPage() {
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const upcoming = useUpcomingSessions();
  const history = useSessionHistory();
  const cancelMutation = useCancelSession();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="My sessions"
        title="Manage your bookings"
        description="View upcoming reviews, your session history, and make changes when you need to."
      />

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-3 pt-4">
          {upcoming.isLoading && <Spinner className="mx-auto size-6" />}
          {upcoming.data?.length === 0 && (
            <Empty>
              <EmptyTitle>No upcoming sessions</EmptyTitle>
              <EmptyDescription>Book a session with a mentor to get started.</EmptyDescription>
            </Empty>
          )}
          {upcoming.data?.map((session) => (
            <SessionCard
              key={session._id}
              session={session}
              onReschedule={setRescheduleTarget}
              onCancel={(id) => cancelMutation.mutate(id)}
            />
          ))}
        </TabsContent>

        <TabsContent value="history" className="space-y-3 pt-4">
          {history.isLoading && <Spinner className="mx-auto size-6" />}
          {history.data?.length === 0 && (
            <Empty>
              <EmptyTitle>No past sessions</EmptyTitle>
              <EmptyDescription>Your completed and canceled sessions will appear here.</EmptyDescription>
            </Empty>
          )}
          {history.data?.map((session) => (
            <SessionCard key={session._id} session={session} showActions={false} />
          ))}
        </TabsContent>
      </Tabs>

      {rescheduleTarget && (
        <RescheduleDialog
          session={rescheduleTarget}
          open={!!rescheduleTarget}
          onOpenChange={(open) => !open && setRescheduleTarget(null)}
        />
      )}
    </div>
  );
}
