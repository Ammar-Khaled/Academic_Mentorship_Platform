import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function verificationVariant(isVerified) {
  if (isVerified === true) return "secondary";
  if (isVerified === false) return "destructive";
  return "outline";
}

export function AccountStatusCard({ profile }) {
  const isVerified = profile?.isVerified ?? false;
  const label = isVerified ? "Verified" : "Unverified";

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle>Account Status</CardTitle>
        <CardDescription>Verification status for your account.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-sm font-medium">Verification</div>
            <div className="text-sm text-muted-foreground">
              Account trust level
            </div>
          </div>
          <Badge variant={verificationVariant(isVerified)}>{label}</Badge>
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-sm font-medium">Role</div>
            <div className="text-sm text-muted-foreground">
              Assigned platform role
            </div>
          </div>
          <Badge variant="outline">{profile?.user?.role ?? "mentor"}</Badge>
        </div>

        <Separator />

        <div className="rounded-lg border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground">Email</div>
          <div className="mt-1 text-sm font-medium">
            {profile?.user?.email ?? "—"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}