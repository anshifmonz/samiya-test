import { useMemo } from 'react';
import { EventRow, Summary } from '@/types/admin/order';
import { format, parseISO, startOfDay, eachDayOfInterval } from 'date-fns';

export function useChartsSection(
  events: EventRow[],
  summary: Summary,
  startDate: Date,
  endDate: Date
) {
  const pieData = useMemo(
    () =>
      Object.entries(summary.by_action).map(([action, count]) => ({
        name: action.charAt(0).toUpperCase() + action.slice(1),
        value: count
      })),
    [summary.by_action]
  );

  const barData = useMemo(() => {
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    return dateRange.map(date => {
      const dayEvents = events.filter(event => {
        if (!event.event_time) return false;
        const eventDate = startOfDay(parseISO(event.event_time));
        return eventDate.getTime() === startOfDay(date).getTime();
      });
      return {
        date: format(date, 'MMM dd'),
        count: dayEvents.length
      };
    });
  }, [events, startDate, endDate]);

  return { pieData, barData };
}
