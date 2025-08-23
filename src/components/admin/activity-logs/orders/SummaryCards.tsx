import { Badge } from 'ui/badge';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from 'ui/card';
import { useSummaryCardsContext } from 'contexts/admin/activity-logs/order/OrdersActivityLogsContext';

export function SummaryCards() {
  const { getActionColor, getActionIcon, summary } = useSummaryCardsContext();

  return (
    <section>
      <h2 className="text-lg font-semibold mb-4 text-luxury-black">Summary</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total_events}</div>
            <p className="text-xs text-muted-foreground">All status events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actions Needed</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{summary.total_actions_needed}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Actions Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(summary.by_action).map(([action, count]) => (
                <Badge
                  key={action}
                  className={`${getActionColor(action)} flex items-center gap-1 hover:bg-`}
                >
                  {getActionIcon(action)}
                  {action}: {String(count)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
