import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function DashboardHeader({ mentorName }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-muted text-foreground">
            {String(mentorName || "M")
              .trim()
              .slice(0, 1)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back{mentorName ? `, ${mentorName}` : ""}</h1>
          <p className="text-sm text-muted-foreground">Here’s what’s coming up this week.</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="whitespace-nowrap">
          Mentor
        </Badge>
        <Badge variant="outline" className="whitespace-nowrap">
          Dashboard
        </Badge>
      </div>
    </div>
  );
}
