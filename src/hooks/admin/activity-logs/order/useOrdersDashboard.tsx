import { useState } from 'react';
import { mockData } from '../../../../components/admin/activity-logs/orders/mockData';
import { subDays } from 'date-fns';
import { useToast } from 'ui/use-toast';
import { FilterState } from '../../../../components/admin/activity-logs/orders/FilterBar';

export function useOrdersDashboard() {
  const [data, setData] = useState(mockData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    statusText: 'all',
    actionRequired: 'all',
    localStatusId: 'all',
    attempts: 'all'
  });
  const [dateRange, setDateRange] = useState({
    start: subDays(new Date(), 7),
    end: new Date()
  });
  const { toast } = useToast();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: 'Data refreshed',
        description: 'Order events data has been updated successfully.'
      });
    }, 1500);
  };

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setDateRange({ start: startDate, end: endDate });
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: 'Data updated',
        description: `Data filtered for ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
      });
    }, 1000);
  };

  return {
    data,
    setData,
    isRefreshing,
    filters,
    setFilters,
    dateRange,
    setDateRange,
    handleRefresh,
    handleDateRangeChange
  };
}
