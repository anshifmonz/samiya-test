import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "ui/card";
import { Badge } from "ui/badge";
import { Users, Activity } from "lucide-react";
import { useActivityLogsContext } from "contexts/ActivityLogsContext";

export const GroupedInsights = () => {
  const { filteredActivities: activities } = useActivityLogsContext();

  const insights = useMemo(() => {
    // Group by Admin
    const adminInsights = activities.reduce((acc, activity) => {
      const key = activity.admin_username;
      if (!acc[key]) {
        acc[key] = { total: 0, actions: {} };
      }
      acc[key].total++;
      acc[key].actions[activity.action] = (acc[key].actions[activity.action] || 0) + 1;
      return acc;
    }, {} as Record<string, { total: number; actions: Record<string, number> }>);

    // Group by Action + Entity Type
    const actionInsights = activities.reduce((acc, activity) => {
      const key = `${activity.entity_type}_${activity.action}`;
      if (!acc[key]) {
        acc[key] = {
          entity_type: activity.entity_type,
          action: activity.action,
          count: 0
        };
      }
      acc[key].count++;
      return acc;
    }, {} as Record<string, { entity_type: string; action: string; count: number }>);

    return {
      adminInsights: Object.entries(adminInsights)
        .map(([admin, data]) => ({
          admin,
          total: data.total,
          topAction: Object.entries(data.actions).reduce((max, [action, count]) =>
            count > max.count ? { action, count } : max,
            { action: '', count: 0 }
          )
        }))
        .sort((a, b) => b.total - a.total),

      actionInsights: Object.values(actionInsights)
        .sort((a, b) => b.count - a.count)
        .slice(0, 8) // Top 8 action insights
    };
  }, [activities]);

  const getActionColor = (action: string) => {
    const colors = {
      create: "bg-success/10 text-success border-success/20",
      update: "bg-warning/10 text-warning border-warning/20",
      delete: "bg-destructive/10 text-destructive border-destructive/20",
      login: "bg-blue-100 text-blue-600 border-blue-300",
      logout: "bg-blue-100 text-blue-600 border-blue-300"
    };
    return colors[action as keyof typeof colors] || "bg-muted/10 text-muted-foreground border-muted/20";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Admin Insights */}
      <Card className="border-admin-muted bg-admin-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-luxury-black">Admin Activity Summary</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Performance breakdown by administrator
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.adminInsights.map((insight, i) => (
            <div key={insight.admin} className="flex items-center justify-between p-3 rounded-lg bg-admin-muted/5 border border-admin-muted/10">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {i + 1}
                </div>
                <div>
                  <p className="font-medium text-luxury-black">
                    {insight.admin}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {insight.total} total actions
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className={getActionColor(insight.topAction.action)}>
                  {insight.topAction.count} {insight.topAction.action}s
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Insights */}
      <Card className="border-admin-muted bg-admin-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle className="text-luxury-black">Action Distribution</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Most frequent entity operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.actionInsights.map((insight, i) => (
            <div key={`${insight.entity_type}_${insight.action}`} className="flex items-center justify-between p-3 rounded-lg bg-admin-muted/5 border border-admin-muted/10">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {i + 1}
                </div>
                <div>
                  <p className="font-medium text-luxury-blackcapitalize">
                    {insight.entity_type} {insight.action}s
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {insight.count} operations
                  </p>
                </div>
              </div>
              <Badge variant="outline" className={getActionColor(insight.action)}>
                {insight.action}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
