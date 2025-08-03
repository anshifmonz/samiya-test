import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "ui/card";
import { CheckCircle2, XCircle, Users, Crown, Clock, Target } from "lucide-react";
import { useActivityLogsContext } from "contexts/ActivityLogsContext";
import { differenceInMinutes, parseISO } from "date-fns";

export const SummaryCards = () => {
  const { filteredActivities: activities } = useActivityLogsContext();

  const summaryData = useMemo(() => {
    const successfulActions = activities.filter(a => a.status === 'success').length;
    const failedActions = activities.filter(a => a.status === 'failed').length;

    const uniqueAdmins = new Set(activities.map(a => a.admin_id)).size;

    // Most active admin
    const adminCounts = activities.reduce((acc, activity) => {
      acc[activity.admin_username] = (acc[activity.admin_username] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostActiveAdmin = Object.entries(adminCounts).reduce((max, [admin, count]) =>
      count > max.count ? { admin, count } : max,
      { admin: '', count: 0 }
    );

    // Average time between updates
    const sortedActivities = [...activities]
      .sort((a, b) => parseISO(a.created_at).getTime() - parseISO(b.created_at).getTime());

    let totalTimeDiff = 0;
    let intervals = 0;

    for (let i = 1; i < sortedActivities.length; i++) {
      const timeDiff = differenceInMinutes(
        parseISO(sortedActivities[i].created_at),
        parseISO(sortedActivities[i - 1].created_at)
      );
      if (timeDiff < 1440) { // Only count if less than 24 hours apart
        totalTimeDiff += timeDiff;
        intervals++;
      }
    }

    const avgTimeBetweenUpdates = intervals > 0 ? Math.round(totalTimeDiff / intervals) : 0;

    // Most edited entity type
    const entityTypeCounts = activities.reduce((acc, activity) => {
      acc[activity.entity_type] = (acc[activity.entity_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostEditedEntity = Object.entries(entityTypeCounts).reduce((max, [entity, count]) =>
      count > max.count ? { entity, count } : max,
      { entity: '', count: 0 }
    );

    return {
      successfulActions,
      failedActions,
      uniqueAdmins,
      mostActiveAdmin,
      avgTimeBetweenUpdates,
      mostEditedEntity
    };
  }, [activities]);

  const summaryCards = [
    {
      title: "Successful Actions",
      value: summaryData.successfulActions,
      icon: CheckCircle2,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Failed Actions",
      value: summaryData.failedActions,
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10"
    },
    {
      title: "Active Admins",
      value: summaryData.uniqueAdmins,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Most Active Admin",
      value: summaryData.mostActiveAdmin.admin,
      subtitle: `${summaryData.mostActiveAdmin.count} actions`,
      icon: Crown,
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      title: "Avg. Time Between Updates",
      value: summaryData.avgTimeBetweenUpdates > 0 ? `${summaryData.avgTimeBetweenUpdates}m` : "N/A",
      icon: Clock,
      color: "text-info",
      bgColor: "bg-info/10"
    },
    {
      title: "Most Edited Entity",
      value: summaryData.mostEditedEntity.entity,
      subtitle: `${summaryData.mostEditedEntity.count} edits`,
      icon: Target,
      color: "text-accent",
      bgColor: "bg-accent/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {summaryCards.map((card, i) => {
        const IconComponent = card.icon;
        return (
          <Card key={i} className="border-muted">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${card.bgColor}`}>
                <IconComponent className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-luxury-black">
                {card.value}
              </div>
              {card.subtitle && (
                <p className="text-xs text-muted-foreground mt-1">
                  {card.subtitle}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
