import { useState, useMemo, useCallback, useEffect } from 'react';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import { useToast } from 'ui/use-toast';
import { ActivityStatsData } from 'lib/api/admin/activity-stats/getActivityStats';
import { apiRequest } from 'utils/apiRequest';
import { isDateInInclusiveRange } from 'utils/dateRange';
import { QueryCondition } from 'components/admin/activity-logs/AdvancedQueryBuilder';

export interface FilterState {
  admin: string;
  action: string;
  entityType: string;
  status: string;
  dateRange: {
    from: Date;
    to: Date;
  };
  search: string;
  ipAddress: string;
  advancedQuery: QueryCondition[];
}

interface ApiResponse {
  success: boolean;
  data?: {
    allActivities: ActivityStatsData[];
    totalActivities: number;
    groupedByDate: Array<{ date: string; count: number; activities: ActivityStatsData[] }>;
    groupedByAction: Array<{ action: string; count: number; activities: ActivityStatsData[] }>;
    groupedByEntityType: Array<{
      entity_type: string;
      count: number;
      activities: ActivityStatsData[];
    }>;
    groupedByAdmin: Array<{
      admin_id: string;
      admin_username: string;
      count: number;
      activities: ActivityStatsData[];
    }>;
  };
  error?: string;
}

const useActivityLogs = () => {
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activityData, setActivityData] = useState<{
    allActivities: ActivityStatsData[];
    totalActivities: number;
    groupedByDate: Array<{ date: string; count: number; activities: ActivityStatsData[] }>;
    groupedByAction: Array<{ action: string; count: number; activities: ActivityStatsData[] }>;
    groupedByEntityType: Array<{
      entity_type: string;
      count: number;
      activities: ActivityStatsData[];
    }>;
    groupedByAdmin: Array<{
      admin_id: string;
      admin_username: string;
      count: number;
      activities: ActivityStatsData[];
    }>;
  }>({
    allActivities: [],
    totalActivities: 0,
    groupedByDate: [],
    groupedByAction: [],
    groupedByEntityType: [],
    groupedByAdmin: []
  });

  // Default filters - consistent between server and client
  const getDefaultFilters = (): FilterState => ({
    admin: 'all',
    action: 'all',
    entityType: 'all',
    status: 'all',
    dateRange: {
      from: startOfDay(subDays(new Date(), 7)),
      to: endOfDay(new Date())
    },
    search: '',
    ipAddress: 'all',
    advancedQuery: []
  });

  const [filters, setFilters] = useState<FilterState>(getDefaultFilters);
  const defaultFilters: FilterState = getDefaultFilters();

  const evaluateAdvancedQuery = (
    activity: ActivityStatsData,
    conditions: QueryCondition[]
  ): boolean => {
    if (conditions.length === 0) return true;
    let result = true;
    let currentLogic: 'AND' | 'OR' | undefined = undefined;
    for (const condition of conditions) {
      if (!condition.value || condition.value.trim() === '') {
        continue;
      }
      const fieldValue =
        activity[condition.field as keyof ActivityStatsData]?.toString().toLowerCase() || '';
      const conditionValue = condition.value.toLowerCase();
      let conditionResult = false;
      switch (condition.operator) {
        case 'equals':
          conditionResult = fieldValue === conditionValue;
          break;
        case 'not_equals':
          conditionResult = fieldValue !== conditionValue;
          break;
        case 'contains':
          conditionResult = fieldValue.includes(conditionValue);
          break;
        case 'not_contains':
          conditionResult = !fieldValue.includes(conditionValue);
          break;
        case 'starts_with':
          conditionResult = fieldValue.startsWith(conditionValue);
          break;
        case 'ends_with':
          conditionResult = fieldValue.endsWith(conditionValue);
          break;
      }
      if (currentLogic === 'OR') {
        result = result || conditionResult;
      } else if (currentLogic === 'AND') {
        result = result && conditionResult;
      } else {
        result = conditionResult;
      }
      currentLogic = condition.logic;
    }
    return result;
  };

  // Fetch activity data from API
  const fetchActivityData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Make date range inclusive by ensuring full day coverage:
      // - startDate: 00:00:00 of the selected start date
      // - endDate: 23:59:59 of the selected end date
      const inclusiveStartDate = startOfDay(filters.dateRange.from);
      const inclusiveEndDate = endOfDay(filters.dateRange.to);

      const queryParams = new URLSearchParams({
        groupBy: 'day',
        startDate: inclusiveStartDate.toISOString(),
        endDate: inclusiveEndDate.toISOString(),
        limit: '1000',
        offset: '0'
      });

      const { data, error } = await apiRequest<ApiResponse>(
        `/api/admin/activity-stats?${queryParams.toString()}`,
        {
          showErrorToast: false,
          showLoadingBar: true,
          loadingBarDelay: 200,
          bustCache: true
        }
      );

      if (error) {
        setError(error);
        toast({
          title: 'Error',
          description: error,
          variant: 'destructive'
        });
        return;
      }

      if (!data || !data.success) {
        const errorMsg = data?.error || 'Failed to fetch activity data';
        setError(errorMsg);
        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive'
        });
        return;
      }

      if (data.data) setActivityData(data.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch activity data';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters.dateRange.from, filters.dateRange.to, toast]);

  const filteredActivities = useMemo(() => {
    return activityData.allActivities.filter(activity => {
      const matchesAdmin = filters.admin === 'all' || activity.admin_id === filters.admin;
      const matchesAction = filters.action === 'all' || activity.action === filters.action;
      const matchesEntityType =
        filters.entityType === 'all' || activity.entity_type === filters.entityType;
      const matchesStatus = filters.status === 'all' || activity.status === filters.status;
      const matchesIpAddress =
        filters.ipAddress === 'all' || activity.ip_address === filters.ipAddress;
      const matchesSearch =
        filters.search === '' ||
        activity.message.toLowerCase().includes(filters.search.toLowerCase()) ||
        activity.admin_username.toLowerCase().includes(filters.search.toLowerCase()) ||
        activity.entity_type.toLowerCase().includes(filters.search.toLowerCase());

      // Use inclusive date range for client-side filtering consistency
      const activityDate = new Date(activity.created_at);
      const matchesDateRange = isDateInInclusiveRange(
        activityDate,
        filters.dateRange.from,
        filters.dateRange.to
      );

      const matchesAdvancedQuery = evaluateAdvancedQuery(activity, filters.advancedQuery);
      return (
        matchesAdmin &&
        matchesAction &&
        matchesEntityType &&
        matchesStatus &&
        matchesIpAddress &&
        matchesSearch &&
        matchesDateRange &&
        matchesAdvancedQuery
      );
    });
  }, [filters, activityData.allActivities]);

  // Helper functions for URL parameter compression
  const compressDate = useCallback((date: Date): string => {
    // Convert to timestamp and encode as base36 for shorter URLs
    return Math.floor(date.getTime() / 1000).toString(36);
  }, []);

  const decompressDate = useCallback((compressed: string): Date => {
    // Decode from base36 and convert back to Date
    return new Date(parseInt(compressed, 36) * 1000);
  }, []);

  const compressAdvancedQuery = useCallback((query: QueryCondition[]): string => {
    if (query.length === 0) return '';
    // Convert to a more compact format and encode
    const compact = query
      .map(q => `${q.field}:${q.operator}:${q.value}:${q.logic || ''}`)
      .join('|');
    return btoa(compact).replace(/[+/=]/g, m => ({ '+': '-', '/': '_', '=': '' }[m] || m));
  }, []);

  const decompressAdvancedQuery = useCallback((compressed: string): QueryCondition[] => {
    if (!compressed) return [];
    try {
      // Restore base64 padding and characters
      const restored = compressed.replace(/[-_]/g, m => ({ '-': '+', _: '/' }[m] || m));
      const padded = restored + '='.repeat((4 - (restored.length % 4)) % 4);
      const compact = atob(padded);

      return compact.split('|').map((item, index) => {
        const [field, operator, value, logic] = item.split(':');
        return {
          id: `condition-${index}`,
          field,
          operator,
          value,
          logic: logic || (index > 0 ? 'AND' : undefined)
        } as QueryCondition;
      });
    } catch (e) {
      return [];
    }
  }, []);

  const compressIpAddress = useCallback((ip: string): string => {
    return btoa(ip).replace(/[+/=]/g, m => ({ '+': '-', '/': '_', '=': '' }[m] || m));
  }, []);

  const decompressIpAddress = useCallback((compressed: string): string => {
    try {
      const restored = compressed.replace(/[-_]/g, m => ({ '-': '+', _: '/' }[m] || m));
      const padded = restored + '='.repeat((4 - (restored.length % 4)) % 4);
      return atob(padded);
    } catch (e) {
      return '';
    }
  }, []);

  // Mark as mounted and parse URL params on client-side only
  useEffect(() => {
    setIsMounted(true);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlFilters = { ...getDefaultFilters() };

      if (params.get('a')) urlFilters.admin = params.get('a')!;
      if (params.get('ac')) urlFilters.action = params.get('ac')!;
      if (params.get('et')) urlFilters.entityType = params.get('et')!;
      if (params.get('st')) urlFilters.status = params.get('st')!;
      if (params.get('s')) urlFilters.search = params.get('s')!;
      if (params.get('ip')) {
        const decodedIp = decompressIpAddress(params.get('ip')!);
        if (decodedIp) urlFilters.ipAddress = decodedIp;
      }
      if (params.get('df') && params.get('dt')) {
        try {
          urlFilters.dateRange = {
            from: decompressDate(params.get('df')!),
            to: decompressDate(params.get('dt')!)
          };
        } catch (e) {
          // Keep default date range if decompression fails
        }
      }
      if (params.get('aq')) urlFilters.advancedQuery = decompressAdvancedQuery(params.get('aq')!);

      // Only update filters if they're different from defaults
      if (JSON.stringify(urlFilters) !== JSON.stringify(getDefaultFilters()))
        setFilters(urlFilters);
    }

    setIsInitialized(true);
  }, [decompressDate, decompressAdvancedQuery, decompressIpAddress]);

  useEffect(() => {
    if (isMounted) fetchActivityData();
  }, [isMounted, fetchActivityData]);

  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();

    if (filters.admin !== 'all') params.set('a', filters.admin);
    if (filters.action !== 'all') params.set('ac', filters.action);
    if (filters.entityType !== 'all') params.set('et', filters.entityType);
    if (filters.status !== 'all') params.set('st', filters.status);
    if (filters.search !== '') params.set('s', filters.search);
    if (filters.ipAddress !== 'all') {
      const compressed = compressIpAddress(filters.ipAddress);
      if (compressed) params.set('ip', compressed);
    }

    const defaultFilters = getDefaultFilters();
    if (
      filters.dateRange.from.getTime() !== defaultFilters.dateRange.from.getTime() ||
      filters.dateRange.to.getTime() !== defaultFilters.dateRange.to.getTime()
    ) {
      params.set('df', compressDate(filters.dateRange.from));
      params.set('dt', compressDate(filters.dateRange.to));
    }

    if (filters.advancedQuery.length > 0) {
      const compressed = compressAdvancedQuery(filters.advancedQuery);
      if (compressed) params.set('aq', compressed);
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [
    filters,
    isInitialized,
    compressDate,
    compressAdvancedQuery,
    compressIpAddress,
    getDefaultFilters
  ]);

  const updateFilter = useCallback(
    (key: keyof FilterState, value: any) => {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);
    },
    [filters]
  );

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const getShareableUrl = useCallback(() => {
    if (typeof window !== 'undefined') return window.location.href;
    return '';
  }, []);

  // Helper functions to get unique values from current data
  const getUniqueAdmins = useCallback(() => {
    const admins = activityData.allActivities.map(activity => ({
      id: activity.admin_id,
      username: activity.admin_username
    }));
    return Array.from(new Map(admins.map(admin => [admin.id, admin])).values());
  }, [activityData.allActivities]);

  const getUniqueActions = useCallback(() => {
    return Array.from(new Set(activityData.allActivities.map(activity => activity.action)));
  }, [activityData.allActivities]);

  const getUniqueEntityTypes = useCallback(() => {
    return Array.from(new Set(activityData.allActivities.map(activity => activity.entity_type)));
  }, [activityData.allActivities]);

  const getUniqueStatuses = useCallback(() => {
    return Array.from(new Set(activityData.allActivities.map(activity => activity.status)));
  }, [activityData.allActivities]);

  const getUniqueIpAddresses = useCallback(() => {
    return Array.from(
      new Set(activityData.allActivities.map(activity => activity.ip_address).filter(Boolean))
    );
  }, [activityData.allActivities]);

  const availableFields = [
    { value: 'admin_username', label: 'Admin Username' },
    { value: 'action', label: 'Action' },
    { value: 'entity_type', label: 'Entity Type' },
    { value: 'status', label: 'Status' },
    { value: 'message', label: 'Message' },
    { value: 'ip_address', label: 'IP Address' },
    { value: 'table_name', label: 'Table Name' }
  ];

  return {
    filters,
    filteredActivities,
    updateFilter,
    clearFilters,
    getShareableUrl,
    toast,
    availableFields,
    isLoading,
    error,
    activityData,
    getUniqueAdmins,
    getUniqueActions,
    getUniqueEntityTypes,
    getUniqueStatuses,
    getUniqueIpAddresses,
    refetch: fetchActivityData
  };
};

export default useActivityLogs;
