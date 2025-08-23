import React, { useState, useEffect } from 'react';
import { format, startOfDay, endOfDay } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Button } from 'ui/button';
import { Label } from 'ui/label';
import { Calendar as CalendarComponent } from 'ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from 'ui/popover';
import { cn } from 'lib/utils';
import { useActivityLogsContext } from 'contexts/admin/activity-logs/ActivityLogsContext';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangeFilterProps {
  value: DateRange;
  label?: string;
  className?: string;
  onChange?: (range: DateRange) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  value,
  className,
  label = 'Date Range',
  onChange
}) => {
  const { updateFilter } = useActivityLogsContext();
  const [selectedRange, setSelectedRange] = useState<{ from?: Date; to?: Date }>({
    from: value.from,
    to: value.to
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSelectedRange({ from: value.from, to: value.to });
  }, [value.from, value.to]);

  const handleApply = () => {
    if (selectedRange.from && selectedRange.to) {
      // inclusive dates by using startOfDay and endOfDay
      const range = { from: startOfDay(selectedRange.from), to: endOfDay(selectedRange.to) };
      if (onChange) onChange(range);
      updateFilter('dateRange', range);
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setSelectedRange({ from: value.from, to: value.to });
    setIsOpen(false);
  };

  const hasChanges =
    selectedRange.from?.getTime() !== value.from?.getTime() ||
    selectedRange.to?.getTime() !== value.to?.getTime();

  return (
    <div className={`sm:col-span-1 lg:col-span-1 ${className}`}>
      <Label className="text-admin-foreground text-xs font-medium">{label}</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-min-content mt-1 justify-start text-left font-normal bg-admin-background border-admin-muted text-admin-foreground hover:bg-admin-muted/50 transition-colors',
              !selectedRange.from && 'text-admin-muted-foreground',
              hasChanges && 'border-primary/50 ring-1 ring-primary/20'
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {selectedRange.from ? (
              selectedRange.to ? (
                <>
                  {format(selectedRange.from, 'MMM dd')} -{' '}
                  {format(selectedRange.to, 'MMM dd, yyyy')}
                  {hasChanges && <span className="ml-1 text-xs text-primary">*</span>}
                </>
              ) : (
                <>
                  {format(selectedRange.from, 'MMM dd, yyyy')}
                  {hasChanges && <span className="ml-1 text-xs text-primary">*</span>}
                </>
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-admin-background/95 backdrop-blur-sm border-admin-muted shadow-xl"
          align="start"
        >
          <div className="bg-admin-card/95 backdrop-blur-sm border border-admin-muted/50 rounded-lg p-2">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={value.from}
              selected={{
                from: selectedRange.from,
                to: selectedRange.to
              }}
              onSelect={range => {
                if (range?.from) {
                  setSelectedRange({
                    from: range.from,
                    to: range.to || range.from
                  });
                }
              }}
              numberOfMonths={1}
              showOutsideDays={false}
              className="p-4 rounded-md bg-admin-card"
              classNames={{
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                month: 'space-y-4 flex flex-col',
                caption: 'flex justify-center pt-1 items-center text-admin-foreground mb-2',
                caption_label: 'text-sm font-semibold text-admin-foreground',
                nav: 'hidden',
                nav_button: 'hidden',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex mb-1 justify-between',
                head_cell:
                  'text-admin-muted-foreground rounded-md !w-9 !h-9 !min-w-9 !max-w-9 flex items-center justify-center font-medium text-xs uppercase tracking-wide flex-shrink-0 basis-9',
                row: 'flex w-full mt-1 justify-between',
                cell: cn(
                  'h-9 w-9 text-center text-sm p-0 relative flex items-center justify-center',
                  '[&:has([aria-selected].day-range-end)]:rounded-r-md',
                  '[&:has([aria-selected].day-outside)]:bg-primary/10',
                  '[&:has([aria-selected])]:bg-primary/15',
                  'first:[&:has([aria-selected])]:rounded-l-md',
                  'last:[&:has([aria-selected])]:rounded-r-md',
                  'focus-within:relative focus-within:z-20',
                  'transition-all duration-150'
                ),
                day: cn(
                  'h-9 w-9 p-0 font-normal text-admin-foreground',
                  'hover:bg-primary/20 hover:text-primary-foreground',
                  'transition-all duration-150 rounded-md',
                  'focus:outline-none focus:ring-2 focus:ring-primary/30',
                  'relative z-10'
                ),
                day_range_end:
                  'day-range-end bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-sm',
                day_selected: cn(
                  'bg-primary text-primary-foreground',
                  'hover:bg-primary/90 hover:text-primary-foreground',
                  'focus:bg-primary focus:text-primary-foreground',
                  'font-semibold shadow-sm ring-2 ring-primary/30',
                  'relative z-20'
                ),
                day_today:
                  'bg-admin-muted/50 text-admin-foreground font-bold border-2 border-primary/50 shadow-sm',
                day_outside:
                  'day-outside text-admin-muted-foreground opacity-40 aria-selected:bg-primary/10 aria-selected:text-admin-muted-foreground aria-selected:opacity-50',
                day_disabled: 'text-admin-muted-foreground opacity-20 cursor-not-allowed',
                day_range_middle: cn(
                  'aria-selected:bg-primary/15 aria-selected:text-admin-foreground',
                  'hover:bg-primary/25 transition-colors duration-150',
                  'relative'
                ),
                day_hidden: 'invisible'
              }}
            />
            <div className="flex justify-end gap-2 mt-2 px-4 pb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="bg-admin-background border-admin-muted text-admin-foreground hover:bg-admin-muted/50"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleApply}
                disabled={!selectedRange.from || !selectedRange.to || !hasChanges}
                className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
