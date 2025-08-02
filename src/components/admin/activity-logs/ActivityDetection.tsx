import { useMemo } from "react";
import { AlertTriangle, Clock, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ActivityStatsData } from "@/lib/admin/activity-stats/getActivityStats";
import { parseISO, differenceInMinutes } from "date-fns";

interface ActivityDetectionProps {
  activity: ActivityStatsData;
  allActivities: ActivityStatsData[];
}

export const ActivityDetection = ({ activity, allActivities }: ActivityDetectionProps) => {
  const alerts = useMemo(() => {
    const warnings = [];

    // Check for multiple failed attempts by same admin within 30 minutes
    const adminFailures = allActivities.filter(a =>
      a.admin_id === activity.admin_id &&
      a.status === 'failed' &&
      Math.abs(differenceInMinutes(parseISO(a.created_at), parseISO(activity.created_at))) <= 30
    );

    if (adminFailures.length >= 3) {
      warnings.push({
        type: 'multiple-failures',
        icon: AlertTriangle,
        color: 'destructive',
        message: `${adminFailures.length} failures in 30min`
      });
    }

    // Check for high-frequency updates on same entity within 1 hour
    if (activity.entity_id) {
      const entityUpdates = allActivities.filter(a =>
        a.entity_id === activity.entity_id &&
        a.action === 'update' &&
        Math.abs(differenceInMinutes(parseISO(a.created_at), parseISO(activity.created_at))) <= 60
      );

      if (entityUpdates.length >= 5) {
        warnings.push({
          type: 'frequent-updates',
          icon: RefreshCw,
          color: 'warning',
          message: `${entityUpdates.length} updates in 1hr`
        });
      }
    }

    // Check for rapid sequential actions (within 2 minutes)
    const rapidActions = allActivities.filter(a =>
      a.admin_id === activity.admin_id &&
      Math.abs(differenceInMinutes(parseISO(a.created_at), parseISO(activity.created_at))) <= 2
    );

    if (rapidActions.length >= 4) {
      warnings.push({
        type: 'rapid-actions',
        icon: Clock,
        color: 'info',
        message: `${rapidActions.length} actions in 2min`
      });
    }

    return warnings;
  }, [activity, allActivities]);

  if (alerts.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {alerts.map((alert, i) => {
        const IconComponent = alert.icon;
        return (
          <Badge
            key={`${alert.type}-${i}`}
            variant="outline"
            className={`text-xs px-2 py-1 ${
              alert.color === 'destructive'
                ? 'border-destructive/20 bg-destructive/10 text-destructive'
                : alert.color === 'warning'
                ? 'border-warning/20 bg-warning/10 text-warning'
                : 'border-info/20 bg-info/10 text-info'
            }`}
          >
            <IconComponent className="w-3 h-3 mr-1" />
            {alert.message}
          </Badge>
        );
      })}
    </div>
  );
};
