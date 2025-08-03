import { Card, CardContent, CardHeader, CardTitle } from "ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { SeverityDistributionData } from "../types";

interface SeverityDistributionChartProps {
  data: SeverityDistributionData[];
}

const getSeverityColor = (name: string) => {
  switch (name) {
    case 'critical':
      return 'hsl(var(--destructive))';
    case 'high':
      return 'hsl(var(--warning))';
    case 'medium':
      return 'hsl(var(--primary))';
    case 'low':
      return 'hsl(var(--info))';
    default:
      return 'hsl(var(--success))';
  }
};

export const SeverityDistributionChart = ({ data }: SeverityDistributionChartProps) => {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-luxury-black">Severity Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getSeverityColor(entry.name)}
                  />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
