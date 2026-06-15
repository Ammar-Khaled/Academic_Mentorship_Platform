import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function ActionButton({ title, description, to }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="space-y-1">
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      <div className="mt-4">
        <Button className="w-full" variant="secondary" onClick={() => navigate(to)}>
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
        <CardDescription>Shortcuts to common mentor tasks.</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <ActionButton title="Manage Availability" description="Update weekly slots and time ranges." to="/mentor/availability" />
          <ActionButton title="Edit Profile" description="Keep your mentor profile up to date." to="/mentor/profile" />
          <ActionButton title="View Sessions" description="Review upcoming and past sessions." to="/mentor/sessions" />
        </div>
      </CardContent>
    </Card>
  );
}
