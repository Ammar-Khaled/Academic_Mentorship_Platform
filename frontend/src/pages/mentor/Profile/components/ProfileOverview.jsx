import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function ProfileOverview({ profile }) {
  const stackName = profile?.stack?.name ?? null;
  const stackDescription = profile?.stack?.description ?? null;

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle>Profile Overview</CardTitle>
        <CardDescription>
          A snapshot of what students see on your mentor profile.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="text-sm font-medium">Bio</div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {profile?.bio ?? "—"}
          </p>
        </div>

        {stackName ? (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="text-sm font-medium">Technical Stack</div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="font-normal">
                  {stackName}
                </Badge>
              </div>
              {stackDescription ? (
                <p className="text-sm text-muted-foreground">
                  {stackDescription}
                </p>
              ) : null}
            </div>
          </>
        ) : null}

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="text-xs text-muted-foreground">Member since</div>
            <div className="mt-1 text-sm font-medium">
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString()
                : "—"}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="text-xs text-muted-foreground">Last updated</div>
            <div className="mt-1 text-sm font-medium">
              {profile?.updatedAt
                ? new Date(profile.updatedAt).toLocaleDateString()
                : "—"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}