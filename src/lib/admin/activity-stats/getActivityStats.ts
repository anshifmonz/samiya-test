import { supabaseAdmin } from 'lib/supabase';

export interface ActivityStatsParams {
  groupBy?: 'day' | 'week';
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface ActivityStatsData {
  id: string;
  admin_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  table_name: string | null;
  message: string;
  metadata: Record<string, any> | null;
  status: string;
  request_path: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
  admin_username: string;
  date_group: string;
}

export interface AggregatedStats {
  totalActivities: number;
  groupedByDate: Array<{
    date: string;
    count: number;
    activities: ActivityStatsData[];
  }>;
  groupedByAction: Array<{
    action: string;
    count: number;
    activities: ActivityStatsData[];
  }>;
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
  allActivities: ActivityStatsData[];
}

export async function getActivityStats(params: ActivityStatsParams = {}): Promise<AggregatedStats & { error?: string, status?: number }> {
  const {
    groupBy = 'day',
    startDate,
    endDate,
    limit = 1000,
    offset = 0
  } = params;

  if (limit === undefined || typeof limit !== 'number' || limit <= 0)
    return { totalActivities: 0, groupedByDate: [], groupedByAction: [], groupedByEntityType: [], groupedByAdmin: [], allActivities: [], error: 'Limit is required and must be a positive number', status: 400 };
  if (offset === undefined || typeof offset !== 'number' || offset < 0)
    return { totalActivities: 0, groupedByDate: [], groupedByAction: [], groupedByEntityType: [], groupedByAdmin: [], allActivities: [], error: 'Offset is required and must be a non-negative number', status: 400 };

    let query = supabaseAdmin
      .from('admin_activity_logs')
      .select(`
        *,
        admin_users!inner(username)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    query = query.abortSignal(AbortSignal.timeout(30000));

    if (startDate) query = query.gte('created_at', startDate);
    if (endDate) query = query.lte('created_at', endDate);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching activity stats:', error);
      return { totalActivities: 0, groupedByDate: [], groupedByAction: [], groupedByEntityType: [], groupedByAdmin: [], allActivities: [], error: 'Failed to fetch activity stats', status: 500 };
    }

    if (!data || data.length === 0)
      return {
        totalActivities: 0,
        groupedByDate: [],
        groupedByAction: [],
        groupedByEntityType: [],
        groupedByAdmin: [],
        allActivities: []
      };

    // Transform the data to include admin username and date grouping
    const activities: ActivityStatsData[] = data.map(activity => {
      const createdAt = new Date(activity.created_at);
      let dateGroup: string;

      if (groupBy === 'week') {
        // Get start of week (Sunday)
        const startOfWeek = new Date(createdAt);
        startOfWeek.setDate(createdAt.getDate() - createdAt.getDay());
        dateGroup = startOfWeek.toISOString().split('T')[0];
      } else {
        // Default to day grouping
        dateGroup = createdAt.toISOString().split('T')[0];
      }

      return {
        id: activity.id,
        admin_id: activity.admin_id,
        action: activity.action,
        entity_type: activity.entity_type,
        entity_id: activity.entity_id,
        table_name: activity.table_name,
        message: activity.message,
        metadata: activity.metadata,
        status: activity.status,
        request_path: activity.request_path,
        ip_address: activity.ip_address,
        user_agent: activity.user_agent,
        created_at: activity.created_at,
        updated_at: activity.updated_at,
        admin_username: activity.admin_users.username,
        date_group: dateGroup
      };
    });

    const dateGroups = new Map<string, ActivityStatsData[]>();
    activities.forEach(activity => {
      const date = activity.date_group;
      if (!dateGroups.has(date)) dateGroups.set(date, []);
      dateGroups.get(date)!.push(activity);
    });

    const actionGroups = new Map<string, ActivityStatsData[]>();
    activities.forEach(activity => {
      const action = activity.action;
      if (!actionGroups.has(action)) actionGroups.set(action, []);
      actionGroups.get(action)!.push(activity);
    });

    const entityTypeGroups = new Map<string, ActivityStatsData[]>();
    activities.forEach(activity => {
      const entityType = activity.entity_type;
      if (!entityTypeGroups.has(entityType)) entityTypeGroups.set(entityType, []);
      entityTypeGroups.get(entityType)!.push(activity);
    });

    const adminGroups = new Map<string, ActivityStatsData[]>();
    activities.forEach(activity => {
      const adminKey = `${activity.admin_id}:${activity.admin_username}`;
      if (!adminGroups.has(adminKey)) adminGroups.set(adminKey, []);
      adminGroups.get(adminKey)!.push(activity);
    });

    return {
      totalActivities: activities.length,
      groupedByDate: Array.from(dateGroups.entries())
        .map(([date, activityList]) => ({
          date,
          count: activityList.length,
          activities: activityList
        }))
        .sort((a, b) => b.date.localeCompare(a.date)), // Sort by date descending
      groupedByAction: Array.from(actionGroups.entries())
        .map(([action, activityList]) => ({
          action,
          count: activityList.length,
          activities: activityList
        }))
        .sort((a, b) => b.count - a.count), // Sort by count descending
      groupedByEntityType: Array.from(entityTypeGroups.entries())
        .map(([entity_type, activityList]) => ({
          entity_type,
          count: activityList.length,
          activities: activityList
        }))
        .sort((a, b) => b.count - a.count), // Sort by count descending
      groupedByAdmin: Array.from(adminGroups.entries())
        .map(([adminKey, activityList]) => {
          const [admin_id, admin_username] = adminKey.split(':');
          return {
            admin_id,
            admin_username,
            count: activityList.length,
            activities: activityList
          };
        })
        .sort((a, b) => b.count - a.count), // Sort by count descending
      allActivities: activities
    };
}

