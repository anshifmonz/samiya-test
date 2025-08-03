import { DateRangeFilter } from "components/admin/activity-logs/filters/DateRangeFilter";
import { Button } from "ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "ui/select";
import { Filter } from "lucide-react";
import { IpFilters, defaultIpFilters } from "../types";

interface IpAnalysisFiltersProps {
  filters: IpFilters;
  onFiltersChange: (filters: IpFilters) => void;
}

export const IpAnalysisFilters = ({ filters, onFiltersChange }: IpAnalysisFiltersProps) => {
  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    onFiltersChange({
      ...filters,
      dateRange: range,
    });
  };

  const updateFilters = (updates: Partial<IpFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-luxury-black flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          {/* Date Range */}
          <div className="xl:col-span-2 flex flex-col pt-1 gap-1">
            <DateRangeFilter
              value={{
                from: filters.dateRange.from,
                to: filters.dateRange.to
              }}
              onChange={handleDateRangeChange}
              className="x1:col-span-2 flex flex-col gap-1"
            />
          </div>

          {/* Severity */}
          <div className="xl:col-span-2">
            <label className="text-sm font-medium text-luxury-black mb-2 block">Severity</label>
            <Select
              value={filters.severity}
              onValueChange={(value) => updateFilters({ severity: value })}
            >
              <SelectTrigger className="bg-background border-border text-luxury-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Min Actions */}
          <div className="xl:col-span-2">
            <label className="text-sm font-medium text-luxury-black mb-2 block">Min Actions</label>
            <Select
              value={filters.minActions}
              onValueChange={(value) => updateFilters({ minActions: value })}
            >
              <SelectTrigger className="bg-background border-border text-luxury-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any</SelectItem>
                <SelectItem value="5">5+</SelectItem>
                <SelectItem value="10">10+</SelectItem>
                <SelectItem value="25">25+</SelectItem>
                <SelectItem value="50">50+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end xl:col-span-2">
            <Button
              variant="outline"
              onClick={() => onFiltersChange(defaultIpFilters)}
              className="w-full bg-background border-border text-luxury-black"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
