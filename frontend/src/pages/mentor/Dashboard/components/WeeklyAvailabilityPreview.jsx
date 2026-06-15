import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DAY_NAMES } from "../constants";
import { groupAvailabilityByDay } from "../utils";

export function WeeklyAvailabilityPreview({ availability = [] }) {
  const navigate = useNavigate();

  // Group raw slots by dayOfWeek → shape per day
  const days = groupAvailabilityByDay(availability);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle>Weekly Availability</CardTitle>
          <CardDescription>Preview of your availability for the week.</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/mentor/availability")}
        >
          Manage
        </Button>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {days.length === 0 ? (
            <div className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
              No availability configured.
            </div>
          ) : (
            days.map((d) => {
              const isOff = d.slots.length === 0;
              return (
                <div
                  key={d.dayOfWeek}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3"
                >
                  <div className="min-w-0">
                    <div className="font-medium">{DAY_NAMES[d.dayOfWeek]}</div>
                    {isOff ? (
                      <div className="text-xs text-muted-foreground">—</div>
                    ) : (
                      <div className="text-xs text-muted-foreground">
                        {d.slots.map((s) => `${s.startTime}–${s.endTime}`).join(", ")}
                      </div>
                    )}
                  </div>

                  <Badge variant={isOff ? "outline" : "secondary"} className="shrink-0">
                    {isOff ? "Off" : `${d.slots.length} slot${d.slots.length > 1 ? "s" : ""}`}
                  </Badge>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}