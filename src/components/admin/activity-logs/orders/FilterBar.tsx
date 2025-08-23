import { Button } from 'ui/button';
import { Calendar } from 'ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { useFilterBarContext } from 'contexts/admin/activity-logs/order/OrdersActivityLogsContext';
import { Popover, PopoverContent, PopoverTrigger } from 'ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'ui/select';
import { format } from 'date-fns';
import { cn } from 'lib/utils';

export interface FilterState {
  statusText: string;
  actionRequired: string;
  localStatusId: string;
  attempts: string;
}

export function FilterBar() {
  const {
    filters,
    startDate,
    endDate,
    isStartDateOpen,
    setIsStartDateOpen,
    isEndDateOpen,
    setIsEndDateOpen,
    handleFilterChange,
    handleDateChange,
    uniqueStatusTexts,
    uniqueLocalStatusIds,
    uniqueAttempts
  } = useFilterBarContext();

  return (
    <section>
      <div className="bg-card rounded-lg border p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Status Text Filter */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Status Text</label>
            <Select
              value={filters.statusText}
              onValueChange={value => handleFilterChange('statusText', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All status texts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status Texts</SelectItem>
                {uniqueStatusTexts.map(status => (
                  <SelectItem key={status} value={status!}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Action Required Filter */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Action Required</label>
            <Select
              value={filters.actionRequired}
              onValueChange={value => handleFilterChange('actionRequired', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Required</SelectItem>
                <SelectItem value="false">Not Required</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Local Status ID Filter */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Local Status ID</label>
            <Select
              value={filters.localStatusId}
              onValueChange={value => handleFilterChange('localStatusId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All local status IDs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Local Status IDs</SelectItem>
                {uniqueLocalStatusIds.map(statusId => (
                  <SelectItem key={statusId} value={statusId!}>
                    {statusId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Attempts Filter */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Attempts</label>
            <Select
              value={filters.attempts}
              onValueChange={value => handleFilterChange('attempts', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All attempts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Attempts</SelectItem>
                {uniqueAttempts.map(attempts => (
                  <SelectItem key={attempts} value={attempts}>
                    {attempts} attempts
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Start Date Picker */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Start Date</label>
            <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !startDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'MMM dd, yyyy') : <span>Pick start date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={date => handleDateChange('start', date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          {/* End Date Picker */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">End Date</label>
            <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !endDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'MMM dd, yyyy') : <span>Pick end date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={date => handleDateChange('end', date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </section>
  );
}
