import { useState } from 'react';
import { subDays } from 'date-fns';
import { FilterState } from '../../../../components/admin/activity-logs/orders/FilterBar';

import { EventRow } from '@/types/admin/order';

export function useFilterBar(
  onFiltersChange: (filters: FilterState) => void,
  onDateRangeChange: (startDate: Date, endDate: Date) => void,
  events: EventRow[]
) {
  const [filters, setFilters] = useState<FilterState>({
    statusText: 'all',
    actionRequired: 'all',
    localStatusId: 'all',
    attempts: 'all'
  });
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDateChange = (type: 'start' | 'end', date: Date | undefined) => {
    if (!date) return;
    if (type === 'start') {
      setStartDate(date);
      setIsStartDateOpen(false);
      onDateRangeChange(date, endDate);
    } else {
      setEndDate(date);
      setIsEndDateOpen(false);
      onDateRangeChange(startDate, date);
    }
  };

  // Compute unique values for dropdowns
  const uniqueStatusTexts = Array.from(new Set(events.map(e => e.status_text).filter(Boolean)));
  const uniqueLocalStatusIds = Array.from(
    new Set(events.map(e => e.local_status_id?.toString()).filter(Boolean))
  ).sort();
  const uniqueAttempts = Array.from(new Set(events.map(e => e.manual_attempts.toString()))).sort();

  return {
    filters,
    setFilters,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isStartDateOpen,
    setIsStartDateOpen,
    isEndDateOpen,
    setIsEndDateOpen,
    handleFilterChange,
    handleDateChange,
    uniqueStatusTexts,
    uniqueLocalStatusIds,
    uniqueAttempts
  };
}
