import { Filter, X } from 'lucide-react';
import { Button } from 'ui/button';
import { Label } from 'ui/label';
import { Card } from 'ui/card';
import {
  SearchFilter,
  AdminFilter,
  ActionFilter,
  EntityTypeFilter,
  StatusFilter,
  IpAddressFilter,
  DateRangeFilter
} from './filters';
import { useActivityLogsContext } from 'contexts/admin/activity-logs/ActivityLogsContext';

export const ActivityFilters = () => {
  const { filters, clearFilters } = useActivityLogsContext();

  return (
    <Card className="p-6 bg-admin-card border-admin-muted">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Label className="text-luxury-black font-semibold">Filters</Label>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-luxury-black hover:text-luxury-black"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          <SearchFilter value={filters.search} />
          <AdminFilter value={filters.admin} />
          <ActionFilter value={filters.action} />
          <EntityTypeFilter value={filters.entityType} />
          <StatusFilter value={filters.status} />
          <IpAddressFilter value={filters.ipAddress} />
          <DateRangeFilter value={filters.dateRange} />
        </div>
      </div>
    </Card>
  );
};
