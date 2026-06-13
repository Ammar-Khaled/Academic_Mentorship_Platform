import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { CodeIcon, MentorIcon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

export function AuthPageShell({
  title,
  description,
  children,
  footer,
  showHighlights = true,
  sidebarTitle = 'Grow through guided code review',
  sidebarDescription = 'Book focused mentorship sessions, receive actionable feedback, and level up with experts across modern tech stacks.',
}) {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm ring-1 ring-foreground/5">
        <div className="grid lg:grid-cols-[1.05fr_1fr]">
          <aside
            className={cn(
              'relative hidden flex-col overflow-hidden bg-linear-to-br from-primary/10 via-primary/5 to-transparent p-10 lg:flex',
              showHighlights ? 'justify-between' : 'justify-center',
            )}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-primary/10 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-primary/5 blur-3xl"
            />

            <div className="relative space-y-6">
              <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <HugeiconsIcon icon={CodeIcon} strokeWidth={2} className="size-6" />
              </div>
              <div className="space-y-3">
                <h2 className="font-heading text-2xl font-semibold tracking-tight">
                  {sidebarTitle}
                </h2>
                <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {sidebarDescription}
                </p>
              </div>
            </div>

            {showHighlights && (
              <ul className="relative space-y-4 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  45-minute structured review sessions
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  Role-based dashboards for students and mentors
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  Unified authentication across the platform
                </li>
              </ul>
            )}
          </aside>

          <div className="flex flex-col justify-center p-6 sm:p-10">
            <div className="mb-8 space-y-2 lg:hidden">
              <div className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HugeiconsIcon icon={MentorIcon} strokeWidth={2} className="size-5" />
              </div>
              <h1 className="font-heading text-xl font-semibold tracking-tight">{title}</h1>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            <div className="hidden space-y-2 lg:block">
              <h1 className="font-heading text-2xl font-semibold tracking-tight">{title}</h1>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            <div className="mt-8">{children}</div>

            {footer && <div className="mt-6 text-center text-xs text-muted-foreground">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthFooterLink({ prompt, linkText, to }) {
  return (
    <p>
      {prompt}{' '}
      <Link to={to} className="font-medium text-primary underline-offset-4 hover:underline">
        {linkText}
      </Link>
    </p>
  );
}

export function RoleOption({ selected, onSelect, icon, title, description }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition-all',
        selected
          ? 'border-primary bg-primary/5 shadow-sm'
          : 'border-border bg-background hover:border-primary/30 hover:bg-muted/40',
      )}
    >
      <div
        className={cn(
          'inline-flex size-9 items-center justify-center rounded-lg',
          selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground',
        )}
      >
        <HugeiconsIcon icon={icon} strokeWidth={2} className="size-4.5" />
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </button>
  );
}
