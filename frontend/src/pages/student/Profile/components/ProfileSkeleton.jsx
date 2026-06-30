import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-7 w-64" />
                <Skeleton className="h-5 w-80" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-2">
              <Skeleton className="h-16 w-40" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
