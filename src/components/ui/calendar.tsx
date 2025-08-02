import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(props.defaultMonth || new Date());

  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    setCurrentMonth(newMonth);
  };

  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    setCurrentMonth(newMonth);
  };

  return (
    <div className="space-y-4">
      <DayPicker
        showOutsideDays={false}
        className={cn("p-3", className)}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        classNames={{
          months: "space-y-4",
          month: "space-y-4",
          caption: "flex justify-center pt-1 items-center",
          caption_label: "text-sm font-medium",
          nav: "hidden",
          nav_button: "hidden",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell:
            "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "h-9 w-9 text-center text-sm p-0 relative [\u0026:has([aria-selected].day-range-end)]:rounded-r-md [\u0026:has([aria-selected].day-outside)]:bg-accent/50 [\u0026:has([aria-selected])]:bg-accent first:[\u0026:has([aria-selected])]:rounded-l-md last:[\u0026:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
          ),
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          Chevron: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        }}
        {...props}
      />
      <div className="flex justify-center gap-2">
        <button
          type="button"
          className="h-7 w-7 bg-admin-background/80 border border-admin-muted text-admin-foreground p-0 opacity-70 hover:opacity-100 hover:bg-admin-muted/80 transition-all rounded-md flex items-center justify-center"
          onClick={goToPreviousMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="h-7 w-7 bg-admin-background/80 border border-admin-muted text-admin-foreground p-0 opacity-70 hover:opacity-100 hover:bg-admin-muted/80 transition-all rounded-md flex items-center justify-center"
          onClick={goToNextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
