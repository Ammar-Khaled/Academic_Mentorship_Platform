import { SESSION_STATUS_OPTIONS, SESSION_STATUS_TABS } from "../constants";

export function SessionsFilters({ filters, onChange, onTabChange }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {SESSION_STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onTabChange(tab.value)}
            className={`inline-flex h-9 items-center rounded-md border px-3 text-sm ${
              filters.tab === tab.value ? "border-foreground bg-foreground text-background" : "border-border"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-4">
        <div className="space-y-1">
          <label htmlFor="search" className="text-xs font-medium text-muted-foreground">
            Search Student
          </label>
          <input
            id="search"
            value={filters.search}
            onChange={(event) => onChange({ search: event.target.value, page: 1 })}
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
            placeholder="Student name"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="status" className="text-xs font-medium text-muted-foreground">
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(event) => onChange({ status: event.target.value, page: 1 })}
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          >
            {SESSION_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="startDate" className="text-xs font-medium text-muted-foreground">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={filters.startDate}
            onChange={(event) => onChange({ startDate: event.target.value, page: 1 })}
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="endDate" className="text-xs font-medium text-muted-foreground">
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            value={filters.endDate}
            onChange={(event) => onChange({ endDate: event.target.value, page: 1 })}
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
