import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function MentorStatisticsCard({ profile }) {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle>Mentor Statistics</CardTitle>
        <CardDescription>Performance overview from your profile.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-sm font-medium">Average Rating</div>
            <div className="text-sm text-muted-foreground">Based on reviews</div>
          </div>
          <Badge variant="outline">★ {typeof profile?.averageRating === "number" ? profile.averageRating : "—"}</Badge>
        </div>

        <Separator />

        <div className="rounded-lg border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground">Hourly Rate</div>
          <div className="mt-1 text-lg font-semibold">
            ${typeof profile?.hourlyRate === "number" ? profile.hourlyRate : "—"}
            /hr
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground">Stack</div>
          <div className="mt-1 text-sm font-medium">{profile?.stack?.name ?? "—"}</div>
        </div>
      </CardContent>
    </Card>
  );
}
