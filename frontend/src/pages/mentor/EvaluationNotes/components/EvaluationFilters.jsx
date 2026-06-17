import { REVIEW_FILTER_OPTIONS } from "../constants";

export function EvaluationFilters({ filters, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-3">
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="searchStudent">
          Search Student
        </label>
        <input
          id="searchStudent"
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
          placeholder="Search by student name"
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="statusFilter">
          Status Filter
        </label>
        <select
          id="statusFilter"
          value={filters.reviewStatus}
          onChange={(event) => onChange({ reviewStatus: event.target.value })}
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
        >
          {REVIEW_FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="dateFilter">
          Date Filter
        </label>
        <input
          id="dateFilter"
          type="date"
          value={filters.date}
          onChange={(event) => onChange({ date: event.target.value })}
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
        />
      </div>
    </div>
  );
}
