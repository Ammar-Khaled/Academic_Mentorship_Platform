import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="bg-muted rounded-full p-6 mb-6">
        <FileQuestion className="h-16 w-16 text-muted-foreground" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-2">404 - Page Not Found</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="default" size="lg">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/support">Contact Support</Link>
        </Button>
      </div>
    </div>
  );
}