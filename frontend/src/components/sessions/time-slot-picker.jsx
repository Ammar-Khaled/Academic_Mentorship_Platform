import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// 09:00 -> 18:00, 45-min slots, hourly start points kept simple as on-the-hour starts
const SLOTS = Array.from({ length: 9 }, (_, i) => {
  const hour = 9 + i;
  return `${String(hour).padStart(2, '0')}:00`;
});

function addMinutes(time, mins) {
  const [h, m] = time.split(':').map(Number);
  const date = new Date(0, 0, 0, h, m + mins);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function TimeSlotPicker({ value, onChange, disabledSlots = [] }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {SLOTS.map((slot) => {
        const isDisabled = disabledSlots.includes(slot);
        const isSelected = value === slot;
        return (
          <Button
            key={slot}
            type="button"
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            disabled={isDisabled}
            onClick={() => onChange(slot)}
            className={cn('flex flex-col gap-0.5 py-2', isDisabled && 'opacity-40')}
          >
            <span>{slot}</span>
            <span className="text-[10px] opacity-70">– {addMinutes(slot, 45)}</span>
          </Button>
        );
      })}
    </div>
  );
}

export { addMinutes };
