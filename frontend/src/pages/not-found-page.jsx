import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { Home01Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-lg overflow-hidden text-center shadow-sm">
        <div className="bg-linear-to-b from-primary/10 to-transparent px-6 pt-10">
          <p className="font-heading text-7xl font-semibold tracking-tight text-primary/30 sm:text-8xl">
            404
          </p>
        </div>

        <CardHeader className="items-center gap-3 pt-4">
          <CardTitle className="text-xl">Page not found</CardTitle>
          <CardDescription className="max-w-sm text-center leading-relaxed">
            The page you are looking for does not exist, was moved, or you may not have access to
            it.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-muted">
            <HugeiconsIcon icon={Home01Icon} strokeWidth={2} className="size-7 text-muted-foreground" />
          </div>
        </CardContent>

        <CardFooter className="justify-center gap-2 pb-8">
          <Button asChild>
            <Link to="/">
              <HugeiconsIcon icon={Home01Icon} strokeWidth={2} className="size-4" data-icon="inline-start" />
              Back to home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/login">Log in</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
