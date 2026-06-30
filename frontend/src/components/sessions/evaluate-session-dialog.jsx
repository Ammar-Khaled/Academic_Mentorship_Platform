import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEvaluateSession } from '@/hooks/use-sessions';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function EvaluateSessionDialog({ session, children }) {
  const [open, setOpen] = useState(false);
  const [evaluationNotes, setEvaluationNotes] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  
  const evaluateMutation = useEvaluateSession();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return; // Rating is required

    evaluateMutation.mutate(
      { id: session._id, evaluationNotes, rating },
      {
        onSuccess: () => {
          setOpen(false);
          setEvaluationNotes('');
          setRating(0);
          setHoverRating(0);
        },
      }
    );
  };

  const renderStar = (index) => {
    const isFilled = (hoverRating || rating) >= index;
    return (
      <svg
        key={index}
        className={`w-8 h-8 cursor-pointer transition-colors ${
          isFilled ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground fill-muted'
        }`}
        onMouseEnter={() => setHoverRating(index)}
        onMouseLeave={() => setHoverRating(0)}
        onClick={() => setRating(index)}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Evaluate Session</DialogTitle>
          <DialogDescription>
            Mark this session with {session.mentor?.name} as completed and provide your feedback. Your rating and notes help improve the mentorship experience.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="flex flex-col items-center gap-2">
            <Label className="text-sm font-semibold">How was your session?</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((index) => renderStar(index))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="evaluationNotes">Evaluation Notes (Optional)</Label>
            <Textarea
              id="evaluationNotes"
              placeholder="What did you learn? How was the mentor?"
              value={evaluationNotes}
              onChange={(e) => setEvaluationNotes(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={evaluateMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={evaluateMutation.isPending || rating === 0}>
              {evaluateMutation.isPending && (
                <Spinner className="mr-2 h-4 w-4" />
              )}
              Complete & Evaluate
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
