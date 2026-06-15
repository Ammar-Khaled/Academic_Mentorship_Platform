import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function ActionItem({ title, description }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="space-y-1">
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      <div className="mt-4">
        <Button className="w-full" variant="secondary" disabled title="Wire up navigation later">
          Open
        </Button>
      </div>
    </div>
  );
}

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Jump to common mentor tasks.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
        <ActionItem title="Manage Availability" description="Update weekly time slots." />
        <ActionItem title="View Sessions" description="See upcoming and past sessions." />
        <ActionItem title="Evaluation Notes" description="Review your recent feedback." />
      </CardContent>
    </Card>
  );
}
