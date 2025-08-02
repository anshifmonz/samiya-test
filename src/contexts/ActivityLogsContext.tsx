import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import useActivityLogs, { FilterState } from '@/hooks/admin/activity-logs/useActivityLogs';
import { ActivityStatsData } from 'lib/admin/activity-stats/getActivityStats';

interface ActivityLogsContextType {
  // State
  filters: FilterState;
  filteredActivities: ActivityStatsData[];
  isLoading: boolean;
  error: string | null;
  activityData: {
    allActivities: ActivityStatsData[];
    totalActivities: number;
    groupedByDate: Array<{ date: string; count: number; activities: ActivityStatsData[] }>;
    groupedByAction: Array<{ action: string; count: number; activities: ActivityStatsData[] }>;
    groupedByEntityType: Array<{ entity_type: string; count: number; activities: ActivityStatsData[] }>;
    groupedByAdmin: Array<{ admin_id: string; admin_username: string; count: number; activities: ActivityStatsData[] }>;
  };

  // Actions
  updateFilter: (key: keyof FilterState, value: any) => void;
  clearFilters: () => void;
  refetch: () => void;
  getShareableUrl: () => string;

  // Utility functions
  getUniqueAdmins: () => Array<{ id: string; username: string }>;
  getUniqueActions: () => string[];
  getUniqueEntityTypes: () => string[];
  getUniqueStatuses: () => string[];
  getUniqueIpAddresses: () => string[];
  availableFields: Array<{ value: string; label: string }>;
}

const ActivityLogsContext = createContext<ActivityLogsContextType | undefined>(undefined);

interface ActivityLogsProviderProps {
  children: ReactNode;
}

export function ActivityLogsProvider({ children }: ActivityLogsProviderProps) {
  const activityLogs = useActivityLogs();

  // Memoize state values separately for better performance
  const stateValue = useMemo(() => ({
    filters: activityLogs.filters,
    filteredActivities: activityLogs.filteredActivities,
    isLoading: activityLogs.isLoading,
    error: activityLogs.error,
    activityData: activityLogs.activityData,
    availableFields: activityLogs.availableFields,
  }), [
    activityLogs.filters,
    activityLogs.filteredActivities,
    activityLogs.isLoading,
    activityLogs.error,
    activityLogs.activityData,
    activityLogs.availableFields,
  ]);

  // Memoize function values separately (these should be stable)
  const functionsValue = useMemo(() => ({
    updateFilter: activityLogs.updateFilter,
    clearFilters: activityLogs.clearFilters,
    refetch: activityLogs.refetch,
    getShareableUrl: activityLogs.getShareableUrl,
    getUniqueAdmins: activityLogs.getUniqueAdmins,
    getUniqueActions: activityLogs.getUniqueActions,
    getUniqueEntityTypes: activityLogs.getUniqueEntityTypes,
    getUniqueStatuses: activityLogs.getUniqueStatuses,
    getUniqueIpAddresses: activityLogs.getUniqueIpAddresses,
  }), [
    activityLogs.updateFilter,
    activityLogs.clearFilters,
    activityLogs.refetch,
    activityLogs.getShareableUrl,
    activityLogs.getUniqueAdmins,
    activityLogs.getUniqueActions,
    activityLogs.getUniqueEntityTypes,
    activityLogs.getUniqueStatuses,
    activityLogs.getUniqueIpAddresses,
  ]);

  // Combine both state and functions
  const value = useMemo(() => ({
    ...stateValue,
    ...functionsValue,
  }), [stateValue, functionsValue]);

  return (
    <ActivityLogsContext.Provider value={value}>
      {children}
    </ActivityLogsContext.Provider>
  );
}

export function useActivityLogsContext() {
  const context = useContext(ActivityLogsContext);
  if (!context) throw new Error('useActivityLogsContext must be used within an ActivityLogsProvider');
  return context;
}

