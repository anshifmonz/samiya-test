import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from "recharts";
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "ui/card";
import { useActivityLogsContext } from "contexts/ActivityLogsContext";

const COLORS = {
  create: "hsl(var(--create))",
  update: "hsl(var(--update))",
  delete: "hsl(var(--delete))",
  login: "hsl(var(--login))",
  logout: "hsl(var(--logout))",
};

// Generate unique colors for admins based on their username hash
const generateAdminColor = (adminName: string): string => {
  const colors = [
    "hsl(220, 70%, 50%)",   // Blue
    "hsl(142, 71%, 45%)",   // Green
    "hsl(271, 76%, 53%)",   // Purple
    "hsl(25, 85%, 60%)",    // Orange
    "hsl(348, 75%, 59%)",   // Red
    "hsl(191, 85%, 56%)",   // Cyan
    "hsl(48, 94%, 55%)",    // Yellow
    "hsl(283, 69%, 44%)",   // Violet
    "hsl(162, 73%, 46%)",   // Teal
    "hsl(14, 90%, 61%)",    // Red-Orange
    "hsl(197, 71%, 52%)",   // Light Blue
    "hsl(120, 61%, 50%)",   // Lime Green
    "hsl(300, 76%, 72%)",   // Pink
    "hsl(39, 87%, 55%)",    // Amber
    "hsl(262, 83%, 58%)",   // Indigo
  ];

  // Use a simple hash of the admin name to ensure consistent color assignment
  let hash = 0;
  for (let i = 0; i < adminName.length; i++) {
    const char = adminName.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Use absolute value and modulo to get a consistent index
  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex];
};

export const ActivityCharts = () => {
  const { filteredActivities: activities } = useActivityLogsContext();
  const chartData = useMemo(() => {
    // Action distribution for pie chart
    const actionCounts = activities.reduce((acc, activity) => {
      acc[activity.action] = (acc[activity.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const actionData = Object.entries(actionCounts).map(([action, count]) => ({
      name: action.charAt(0).toUpperCase() + action.slice(1),
      value: count,
      color: COLORS[action as keyof typeof COLORS] || "hsl(var(--muted))"
    }));

    // Activity over time for bar chart
    const dateGroups = activities.reduce((acc, activity) => {
      const date = activity.date_group;
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const timeData = Object.entries(dateGroups)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, count]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        activities: count
      }));

    // Admin-wise activity trend for line chart
    const adminActivity = activities.reduce((acc, activity) => {
      const date = activity.date_group;
      const admin = activity.admin_username;

      if (!acc[date]) acc[date] = {};
      acc[date][admin] = (acc[date][admin] || 0) + 1;

      return acc;
    }, {} as Record<string, Record<string, number>>);

    const uniqueAdmins = Array.from(new Set(activities.map(a => a.admin_username)));
    const adminTrendData = Object.entries(adminActivity)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, adminCounts]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        ...uniqueAdmins.reduce((acc, admin) => ({
          ...acc,
          [admin]: adminCounts[admin] || 0
        }), {})
      }));

    // Hourly heatmap data
    const heatmapData = activities.reduce((acc, activity) => {
      const date = new Date(activity.created_at);
      const dayOfWeek = date.getDay();
      const hour = date.getHours();

      const key = `${dayOfWeek}-${hour}`;
      acc[key] = (acc[key] || 0) + 1;

      return acc;
    }, {} as Record<string, number>);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const heatmapMatrix = Array.from({ length: 7 }, (_, day) =>
      Array.from({ length: 24 }, (_, hour) => ({
        day: dayNames[day],
        hour,
        value: heatmapData[`${day}-${hour}`] || 0
      }))
    ).flat();

    return { actionData, timeData, adminTrendData, heatmapMatrix, uniqueAdmins };
  }, [activities]);

  const totalActivities = activities.length;
  const successRate = activities.filter(a => a.status === 'success').length / totalActivities * 100;

  return (
    <div className="space-y-6">
      {/* Top Row - Key Metrics and Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Key Metrics */}
        <Card className="bg-admin-card border-admin-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-admin-foreground">
              Total Activities
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-admin-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-admin-foreground">{totalActivities}</div>
            <p className="text-xs text-admin-muted-foreground">
              {successRate.toFixed(1)}% success rate
            </p>
            <div className="mt-2 h-2 w-full bg-admin-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-success transition-all duration-300"
                style={{ width: `${successRate}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Distribution - Pie Chart */}
        <Card className="bg-admin-card border-admin-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-admin-foreground">
              Action Distribution
            </CardTitle>
            <PieChartIcon className="h-4 w-4 text-admin-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={chartData.actionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.actionData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--admin-card))",
                    border: "1px solid hsl(var(--admin-muted))",
                    borderRadius: "6px",
                    color: "hsl(var(--admin-foreground))"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              {chartData.actionData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-admin-muted-foreground">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Over Time - Bar Chart */}
        <Card className="bg-admin-card border-admin-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-admin-foreground">
              Activity Timeline
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-admin-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData.timeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--admin-muted))" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--admin-muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--admin-muted-foreground))", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--admin-card))",
                    border: "1px solid hsl(var(--admin-muted))",
                    borderRadius: "6px",
                    color: "hsl(var(--admin-foreground))"
                  }}
                />
                <Bar
                  dataKey="activities"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - New Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin Activity Trends - Line Chart */}
        <Card className="bg-admin-card border-admin-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-admin-foreground">
              Admin Activity Trends
            </CardTitle>
            <Users className="h-4 w-4 text-admin-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.adminTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--admin-muted))" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--admin-muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--admin-muted-foreground))", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--admin-card))",
                    border: "1px solid hsl(var(--admin-muted))",
                    borderRadius: "6px",
                    color: "hsl(var(--admin-foreground))"
                  }}
                />
                {chartData.uniqueAdmins.map(admin => (
                  <Line
                    key={admin}
                    type="monotone"
                    dataKey={admin}
                    stroke={generateAdminColor(admin)}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 flex flex-wrap gap-3 text-xs">
              {chartData.uniqueAdmins.map(admin => (
                <div key={admin} className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: generateAdminColor(admin) }}
                  />
                  <span className="text-admin-muted-foreground">{admin}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Heatmap */}
        <Card className="bg-admin-card border-admin-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-admin-foreground">
              Activity Heatmap
            </CardTitle>
            <Clock className="h-4 w-4 text-admin-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[600px] space-y-1">
                {/* Hours header */}
                <div className="flex gap-1 text-xs text-admin-muted-foreground mb-2 pl-10">
                  {Array.from({ length: 24 }, (_, i) => (
                    <div key={i} className="w-4 h-4 text-center text-[10px] flex items-center justify-center">
                      {i % 6 === 0 ? i : ''}
                    </div>
                  ))}
                </div>

                {/* Heatmap grid */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, dayIndex) => (
                  <div key={day} className="flex gap-1 items-center">
                    <div className="text-xs text-admin-muted-foreground w-8 text-right pr-2">
                      {day}
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 24 }, (_, hour) => {
                        const cell = chartData.heatmapMatrix.find(
                          item => item.day === day && item.hour === hour
                        );
                        const maxValue = Math.max(...chartData.heatmapMatrix.map(c => c.value));
                        const intensity = cell && maxValue > 0 ? cell.value / maxValue : 0;

                        return (
                          <div
                            key={hour}
                            className="w-4 h-4 rounded-sm border border-admin-muted/50 hover:border-admin-foreground transition-colors cursor-pointer"
                            style={{
                              backgroundColor: intensity > 0
                                ? `hsl(var(--primary) / ${0.2 + intensity * 0.8})`
                                : 'hsl(var(--admin-muted) / 0.3)'
                            }}
                            title={`${day} ${hour}:00 - ${cell?.value || 0} activities`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Legend */}
                <div className="flex items-center justify-between text-xs text-admin-muted-foreground mt-4 pl-10">
                  <span>Less</span>
                  <div className="flex gap-1">
                    {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-sm border border-admin-muted/50"
                        style={{
                          backgroundColor: intensity > 0
                            ? `hsl(var(--primary) / ${0.2 + intensity * 0.8})`
                            : 'hsl(var(--admin-muted) / 0.3)'
                        }}
                      />
                    ))}
                  </div>
                  <span>More</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
