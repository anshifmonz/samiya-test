import { useMemo } from 'react';
import { Shield, AlertTriangle, Globe, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from 'ui/card';
import { Badge } from 'ui/badge';
import { Button } from 'ui/button';
import { Progress } from 'ui/progress';
import Link from 'next/link';
import { ActivityStatsData } from 'lib/api/admin/activity-stats/getActivityStats';
import { useActivityLogsContext } from 'contexts/admin/activity-logs/ActivityLogsContext';

export const IpAnalytics = () => {
  const { filteredActivities: activities } = useActivityLogsContext();
  const ipData = useMemo(() => {
    const ipCounts = new Map<
      string,
      { total: number; failed: number; activities: ActivityStatsData[] }
    >();

    activities.forEach(activity => {
      if (activity.ip_address) {
        const existing = ipCounts.get(activity.ip_address) || {
          total: 0,
          failed: 0,
          activities: []
        };
        existing.total += 1;
        if (activity.status === 'failed') {
          existing.failed += 1;
        }
        existing.activities.push(activity);
        ipCounts.set(activity.ip_address, existing);
      }
    });

    const ipStats = Array.from(ipCounts.entries()).map(([ip, data]) => ({
      ip,
      ...data,
      failureRate: data.total > 0 ? (data.failed / data.total) * 100 : 0
    }));

    // Sort by total activities (most active first)
    const sortedByActivity = [...ipStats].sort((a, b) => b.total - a.total);

    // Sort by failure rate (most suspicious first)
    const sortedByFailureRate = [...ipStats].sort((a, b) => b.failureRate - a.failureRate);

    // Find IPs with high failure rates (>30%) or high activity (>10 actions)
    const suspiciousIps = ipStats.filter(ip => ip.failureRate > 30 || ip.total > 10);

    return {
      totalUniqueIps: ipStats.length,
      mostActiveIps: sortedByActivity.slice(0, 5),
      mostSuspiciousIps: sortedByFailureRate.slice(0, 5),
      suspiciousIps
    };
  }, [activities]);

  const getSuspiciousLevel = (failureRate: number, total: number) => {
    if (failureRate > 50 || total > 20)
      return { level: 'high', color: 'bg-destructive', text: 'High Risk' };
    if (failureRate > 30 || total > 10)
      return { level: 'medium', color: 'bg-warning', text: 'Medium Risk' };
    if (failureRate > 10 || total > 5)
      return { level: 'low', color: 'bg-success', text: 'Low Risk' };
    return { level: 'normal', color: 'bg-blue-100', text: 'Normal' };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* IP Overview */}
      <Card className="bg-admin-card border-admin-muted">
        <CardHeader>
          <CardTitle className="text-luxury-black flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              IP Address Overview
            </div>
            <Link href="/admin/activity-logs/ip">
              <Button
                variant="outline"
                size="sm"
                className="bg-admin-background border-admin-muted text-admin-foreground hover:bg-admin-muted/30"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Detailed Analysis
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-luxury-black">{ipData.totalUniqueIps}</div>
              <div className="text-sm text-muted-foreground">Unique IPs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-luxury-black">
                {ipData.suspiciousIps.length}
              </div>
              <div className="text-sm text-muted-foreground">Flagged IPs</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-luxury-black">Most Active IPs</h4>
            {ipData.mostActiveIps.map(ip => {
              const suspiciousLevel = getSuspiciousLevel(ip.failureRate, ip.total);
              return (
                <div
                  key={ip.ip}
                  className="flex items-center justify-between p-3 rounded-lg bg-admin-muted/5 border border-admin-muted/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-mono text-luxury-black">{ip.ip}</div>
                    <Badge
                      className={`text-xs ${suspiciousLevel.color} hover:bg- ${
                        suspiciousLevel.level === 'high'
                          ? 'text-destructive-foreground'
                          : suspiciousLevel.level === 'medium'
                          ? 'text-warning-foreground'
                          : suspiciousLevel.level === 'low'
                          ? 'text-success-foreground'
                          : 'text-blue-600'
                      }`}
                    >
                      {suspiciousLevel.text}
                    </Badge>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-luxury-black font-medium">{ip.total} activities</div>
                    <div className="text-muted-foreground">{ip.failureRate.toFixed(1)}% failed</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Suspicious Activity Detection */}
      <Card className="bg-admin-card border-admin-muted">
        <CardHeader>
          <CardTitle className="text-luxury-black flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {ipData.suspiciousIps.length > 0 ? (
            <>
              <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="text-sm text-luxury-black">
                  {ipData.suspiciousIps.length} IP{ipData.suspiciousIps.length > 1 ? 's' : ''}{' '}
                  flagged for suspicious activity
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-luxury-black">Flagged IP Addresses</h4>
                {ipData.mostSuspiciousIps.map(ip => {
                  const suspiciousLevel = getSuspiciousLevel(ip.failureRate, ip.total);
                  return (
                    <div
                      key={ip.ip}
                      className="p-3 bg-admin-muted/20 rounded-lg border border-admin-muted"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-luxury-black">{ip.ip}</span>
                          <Badge
                            className={`text-xs ${suspiciousLevel.color} hover:bg- ${
                              suspiciousLevel.level === 'high'
                                ? 'text-destructive-foreground'
                                : suspiciousLevel.level === 'medium'
                                ? 'text-warning-foreground'
                                : 'text-success-foreground'
                            }`}
                          >
                            {suspiciousLevel.text}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{ip.total} activities</div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Failure Rate</span>
                          <span className="text-luxury-black">{ip.failureRate.toFixed(1)}%</span>
                        </div>
                        <Progress
                          value={ip.failureRate}
                          className="h-2"
                          style={{
                            ['--progress-background' as any]:
                              ip.failureRate > 50
                                ? 'hsl(var(--error))'
                                : ip.failureRate > 30
                                ? 'hsl(var(--warning))'
                                : 'hsl(var(--success))'
                          }}
                        />
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Success: </span>
                            <span className="text-success">{ip.total - ip.failed}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Failed: </span>
                            <span className="text-error">{ip.failed}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-lg">
              <Shield className="h-4 w-4 text-success" />
              <span className="text-sm text-luxury-black">No suspicious IP activity detected</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
