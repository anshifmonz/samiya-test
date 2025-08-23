import { Input } from 'ui/input';
import { format } from 'date-fns';
import { Button } from 'ui/button';
import { RotateCcw, CheckCircle2, Search, ArrowUpDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'ui/table';
import DetailsDialog from './DetailsDialog';
import { useEventsTableContext } from 'contexts/admin/activity-logs/order/OrdersActivityLogsContext';
import { EventRow } from 'types/admin/order';

export function EventsTable() {
  const {
    searchTerm,
    setSearchTerm,
    filteredAndSortedEvents,
    handleSort,
    handleRefund,
    approveReturn,
    cancelOrder,
    handleDeny,
    handleRetry,
    handleMarkResolved
  } = useEventsTableContext();

  function getActionButtons(event: EventRow) {
    switch (event.local_status_id) {
      case 1:
      case 5:
        return (
          <Button size="sm" disabled variant="outline" className="h-8">
            No Action Needed
          </Button>
        );
      case 2:
        return (
          <>
            <Button
              size="sm"
              variant="outline"
              className="h-8"
              onClick={() => approveReturn(event.id)}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="h-8"
              onClick={() => handleDeny(event.id)}
            >
              Deny
            </Button>
          </>
        );
      case 3:
        return (
          <Button
            size="sm"
            variant="outline"
            className="h-8"
            onClick={() => handleRefund(event.id)}
          >
            Refund
          </Button>
        );
      case 4:
        return (
          <>
            <Button
              size="sm"
              variant="outline"
              className="h-8"
              onClick={() => handleRefund(event.id)}
            >
              Refund
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="h-8"
              onClick={() => handleDeny(event.id)}
            >
              Deny
            </Button>
          </>
        );
      case 6:
        return (
          <>
            <Button
              size="sm"
              variant="outline"
              className="h-8"
              onClick={() => handleRefund(event.id)}
            >
              Refund
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="h-8"
              onClick={() => cancelOrder(event.id)}
            >
              Cancel Order
            </Button>
          </>
        );
      default:
        return (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRetry(event.id)}
              className="h-8"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Retry
            </Button>
            <Button
              size="sm"
              onClick={() => handleMarkResolved(event.id)}
              className="h-8 bg-success hover:bg-success/90 text-success-foreground"
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Resolve
            </Button>
          </>
        );
    }
  }

  const formatEventTime = (timeString: string | null) => {
    if (!timeString) return 'N/A';
    try {
      return format(new Date(timeString), 'MMM dd, yyyy HH:mm');
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <section>
      <h2 className="text-lg font-semibold mb-4 text-luxury-black">Event Details</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('id')}
                >
                  {' '}
                  <div className="flex items-center space-x-1">
                    <span>ID</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('order_id')}
                >
                  {' '}
                  <div className="flex items-center space-x-1">
                    <span>Order ID</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Status ID</TableHead>
                <TableHead>Status Text</TableHead>
                <TableHead>Description</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('manual_attempts')}
                >
                  {' '}
                  <div className="flex items-center space-x-1">
                    <span>Attempts</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('event_time')}
                >
                  {' '}
                  <div className="flex items-center space-x-1">
                    <span>Event Time</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedEvents.map(event => (
                <TableRow key={event.id}>
                  <TableCell className="font-mono text-sm">{event.id}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {event.order_id ? event.order_id.slice(-4) : 'N/A'}
                  </TableCell>
                  <TableCell>{event.status_id || 'N/A'}</TableCell>
                  <TableCell>
                    {event.status_text ? event.status_text.toLocaleUpperCase() : 'N/A'}
                  </TableCell>
                  <TableCell>{event.description || 'N/A'}</TableCell>
                  <TableCell>
                    <span
                      className={`font-bold ${
                        event.manual_attempts > 0 ? 'text-warning' : 'text-muted-foreground'
                      }`}
                    >
                      {event.manual_attempts}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{formatEventTime(event.event_time)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">{getActionButtons(event)}</div>
                  </TableCell>
                  {/* Details column */}
                  <TableCell>
                    <DetailsDialog event={event} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
