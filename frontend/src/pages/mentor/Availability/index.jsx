import { useMemo } from "react";
import { getErrorMessage } from "@/lib/api";
import { useMentorStore } from "@/stores/mentor.store";

import { DAY_OPTIONS } from "./constants";
import { groupSlotsByDay, sortSlots } from "./utils";

import { useAvailabilityList } from "./hooks/useAvailabilityList";
import { useCreateAvailability } from "./hooks/useCreateAvailability";
import { useUpdateAvailability } from "./hooks/useUpdateAvailability";
import { useDeleteAvailability } from "./hooks/useDeleteAvailability";
import { useToggleAvailabilityStatus } from "./hooks/useToggleAvailabilityStatus";

import { PageHeader } from "./components/PageHeader";
import { WeeklyOverview } from "./components/WeeklyOverview";
import { AvailabilityTable } from "./components/AvailabilityTable";
import { SlotsByDay } from "./components/SlotsByDay";
import { AvailabilityDialog } from "./components/AvailabilityDialog";
import { AvailabilitySkeleton } from "./components/AvailabilitySkeleton";
import { AvailabilityEmptyState } from "./components/AvailabilityEmptyState";

export default function MentorAvailabilityPage() {
  const { isCreateDialogOpen, isEditDialogOpen, selectedAvailability, selectedDayFilter, openCreateDialog, closeCreateDialog, openEditDialog, closeEditDialog, setSelectedDayFilter } = useMentorStore();

  const availabilityQuery = useAvailabilityList();
  const createMutation = useCreateAvailability();
  const updateMutation = useUpdateAvailability();
  const deleteMutation = useDeleteAvailability();
  const toggleMutation = useToggleAvailabilityStatus();

  const allSlots = sortSlots(availabilityQuery.data ?? []);

  const filteredSlots = useMemo(() => {
    if (selectedDayFilter === "all") return allSlots;
    return allSlots.filter((slot) => slot.dayOfWeek === selectedDayFilter);
  }, [allSlots, selectedDayFilter]);

  const groupedSlots = useMemo(() => groupSlotsByDay(filteredSlots), [filteredSlots]);

  function handleCreate(values) {
    createMutation.mutate(values, {
      onSuccess: () => closeCreateDialog(),
    });
  }

  function handleUpdate(values) {
    if (!selectedAvailability?._id) return;

    updateMutation.mutate(
      {
        id: selectedAvailability._id,
        payload: values,
      },
      {
        onSuccess: () => closeEditDialog(),
      },
    );
  }

  function handleDelete(slot) {
    const label = DAY_OPTIONS.find((d) => d.value === slot.dayOfWeek)?.label ?? "this day";
    const confirmed = window.confirm(`Delete slot on ${label} (${slot.startTime} - ${slot.endTime})?`);
    if (!confirmed) return;
    deleteMutation.mutate(slot._id);
  }

  function handleToggleStatus(slot) {
    const isActive = slot.isActive !== false;
    toggleMutation.mutate({ id: slot._id, isActive: !isActive });
  }

  if (availabilityQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-6">
        <AvailabilitySkeleton />
      </div>
    );
  }

  if (availabilityQuery.isError) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-6">
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{getErrorMessage(availabilityQuery.error)}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      <div className="space-y-6">
        <PageHeader onAdd={openCreateDialog} />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground" htmlFor="dayFilter">
              Filter
            </label>
            <select
              id="dayFilter"
              className="h-9 rounded-md border border-border bg-background px-3 text-sm"
              value={selectedDayFilter}
              onChange={(event) => {
                const value = event.target.value;
                setSelectedDayFilter(value === "all" ? "all" : Number(value));
              }}>
              <option value="all">All days</option>
              {DAY_OPTIONS.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>

          <p className="text-sm text-muted-foreground">
            {filteredSlots.length} slot{filteredSlots.length === 1 ? "" : "s"}
          </p>
        </div>

        {filteredSlots.length === 0 ? (
          <AvailabilityEmptyState onCreate={openCreateDialog} />
        ) : (
          <>
            <WeeklyOverview slots={filteredSlots} />

            <AvailabilityTable slots={filteredSlots} isDeleting={deleteMutation.isPending} isToggling={toggleMutation.isPending} onEdit={openEditDialog} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />

            <SlotsByDay groupedSlots={groupedSlots} />
          </>
        )}
      </div>

      <AvailabilityDialog
        open={isCreateDialogOpen}
        title="Create Availability"
        description="Set day and time range in 24-hour format."
        submitLabel="Create Slot"
        isSubmitting={createMutation.isPending}
        errorMessage={createMutation.isError ? getErrorMessage(createMutation.error) : null}
        onClose={closeCreateDialog}
        onSubmit={handleCreate}
      />

      <AvailabilityDialog
        open={isEditDialogOpen}
        title="Edit Availability"
        description="Update the selected recurring time window."
        submitLabel="Save Changes"
        isSubmitting={updateMutation.isPending}
        errorMessage={updateMutation.isError ? getErrorMessage(updateMutation.error) : null}
        defaultValues={
          selectedAvailability
            ? {
                dayOfWeek: selectedAvailability.dayOfWeek,
                startTime: selectedAvailability.startTime,
                endTime: selectedAvailability.endTime,
                isActive: selectedAvailability.isActive !== false,
              }
            : undefined
        }
        onClose={closeEditDialog}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
