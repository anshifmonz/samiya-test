import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'ui/card';
import { Activity, Users, AlertTriangle } from 'lucide-react';
import { useActivityLogsContext } from 'contexts/ActivityLogsContext';

/**
 * Example component showing how to use the ActivityLogsContext
 * This component displays quick stats without needing props to be passed down
 */
export const ActivityStats = () => {
  const { 
    filteredActivities, 
    isLoading, 
    error,
    getUniqueAdmins 
  } = useActivityLogsContext();

  if (isLoading) {
    return (
      <Card className="bg-admin-card border-admin-muted">
        <CardContent className="p-6">
          <div className="animate-pulse text-admin-muted-foreground">
            Loading stats...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-admin-card border-admin-muted">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <span>Error loading stats</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalActivities = filteredActivities.length;
  const uniqueAdmins = getUniqueAdmins();
  const failedActivities = filteredActivities.filter(activity => activity.status === 'failed').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-admin-card border-admin-muted">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-admin-muted-foreground">
            Total Activities
          </CardTitle>
          <Activity className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-admin-foreground">
            {totalActivities}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-admin-card border-admin-muted">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-admin-muted-foreground">
            Active Admins
          </CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-admin-foreground">
            {uniqueAdmins.length}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-admin-card border-admin-muted">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-admin-muted-foreground">
            Failed Activities
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">
            {failedActivities}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
