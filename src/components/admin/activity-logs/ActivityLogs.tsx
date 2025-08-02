'use client';

import { Activity, RefreshCw } from "lucide-react";
import { Button } from "ui/button";
import { Badge } from "ui/badge";
import { useToast } from "ui/use-toast";
import { Alert, AlertDescription } from "ui/alert";
import { ActivityFilters } from "components/admin/activity-logs/ActivityFilters";
import { ActivityCharts } from "components/admin/activity-logs/ActivityCharts";
import { ActivityTable } from "components/admin/activity-logs/ActivityTable";
import { SummaryCards } from "components/admin/activity-logs/SummaryCards";
import { GroupedInsights } from "components/admin/activity-logs/GroupedInsights";
import { AdvancedQueryBuilder } from "components/admin/activity-logs/AdvancedQueryBuilder";
import { IpAnalytics } from "components/admin/activity-logs/IpAnalytics";
import { ActivityLogsProvider, useActivityLogsContext } from "contexts/ActivityLogsContext";

const ActivityLogsContent = () => {
  const { toast } = useToast();
  const {
    filteredActivities, clearFilters, getShareableUrl,
    isLoading, error, refetch
  } = useActivityLogsContext();

  return (
    <main className="min-h-screen bg-gradient-to-br from-admin-background to-admin-muted p-6 pt-24">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-admin-foreground">Activity Logs</h1>
            </div>
            <p className="text-admin-muted-foreground">
              Monitor and analyze admin activities across the platform
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-admin-muted-foreground">
              <div className={`h-2 w-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : error ? 'bg-red-500' : 'bg-success animate-pulse'}`} />
              <span>{isLoading ? 'Loading...' : error ? 'Error' : 'Live monitoring'}</span>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-admin-foreground border-admin-muted">
                {filteredActivities.length} activities
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={refetch}
                disabled={isLoading}
                className="bg-admin-background border-admin-muted text-admin-foreground hover:bg-admin-muted/30"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              {filteredActivities.length === 0 && !isLoading && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="bg-admin-background border-admin-muted text-admin-foreground hover:bg-admin-muted/30"
                >
                  Clear All Filters
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(getShareableUrl());
                  toast({
                    title: "Link copied",
                    description: "The shareable link has been copied to your clipboard.",
                  });
                }}
                className="text-admin-muted-foreground hover:text-admin-foreground"
              >
                Share View
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        <SummaryCards />
        <ActivityFilters />
        <AdvancedQueryBuilder />
        <ActivityCharts />
        <GroupedInsights />
        <IpAnalytics />
        <ActivityTable />
      </div>
    </main>
  );
};

const ActivityLogs = () => {
  return (
    <ActivityLogsProvider>
      <ActivityLogsContent />
    </ActivityLogsProvider>
  );
};

export default ActivityLogs;
