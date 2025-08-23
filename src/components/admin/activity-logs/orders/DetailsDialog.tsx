import { Button } from 'ui/button';
import { Eye } from 'lucide-react';
import { ScrollArea } from 'ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from 'ui/dialog';
import { type EventRow } from 'types/admin/order';
import { useDetailsDialogContext } from 'contexts/admin/activity-logs/order/OrdersActivityLogsContext';

function DetailsDialog({ event }: { event: EventRow }) {
  const { previousStatusText } = useDetailsDialogContext();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-luxury-black">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-card border-admin-muted flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-luxury-black">Event Details</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Full details for event {event.id}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-2">
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-luxury-black">Basic Info</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID:</span>
                    <span className="text-luxury-black font-mono">{event.order_id || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status ID:</span>
                    <span className="text-luxury-black font-mono">{event.status_id || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Local Status ID:</span>
                    <span className="text-luxury-black font-mono">
                      {event.local_status_id || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status Text:</span>
                    <span className="text-luxury-black">{event.status_text || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Event Time:</span>
                    <span className="text-luxury-black font-mono">{event.event_time || 'N/A'}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-luxury-black">Technical Info</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Manual Attempts:</span>
                    <span className="text-luxury-black font-mono">{event.manual_attempts}</span>
                  </div>
                  {event.actions && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Actions:</span>
                      <span className="text-luxury-black">{event.actions}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {event.description && (
            <div className="space-y-2 mb-4">
              <h4 className="text-sm font-semibold text-luxury-black">Message</h4>
              <p className="bg-[#e8e8e8] text-sm text-muted-foreground bg-admin-muted/30 p-3 rounded-md">
                {event.description}
              </p>
            </div>
          )}
          {event.when_arises && (
            <div className="space-y-2 mb-4">
              <h4 className="text-sm font-semibold text-luxury-black">When The Event Arises</h4>
              <p className="bg-[#e8e8e8] text-sm text-muted-foreground bg-admin-muted/30 p-3 rounded-md">
                {event.when_arises}
              </p>
            </div>
          )}
          {event.follow_up_action && (
            <div className="space-y-2 mb-4">
              <h4 className="text-sm font-semibold text-luxury-black">Follow Up Action</h4>
              <p className="bg-[#e8e8e8] text-sm text-muted-foreground bg-admin-muted/30 p-3 rounded-md">
                {event.follow_up_action}
              </p>
            </div>
          )}
          {event.previous_statuses && event.previous_statuses.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-luxury-black">Previous Statuses</h4>
              <p className="bg-[#e8e8e8] text-sm text-muted-foreground bg-admin-muted/30 p-3 rounded-md">
                {previousStatusText(event.previous_statuses.map(String))}
              </p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
export default DetailsDialog;
