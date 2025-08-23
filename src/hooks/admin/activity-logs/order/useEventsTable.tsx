import { useState } from 'react';
import { EventRow } from 'types/admin/order';
import { useToast } from 'ui/use-toast';

export function useEventsTable(events: EventRow[], setData: React.Dispatch<React.SetStateAction<{ events: EventRow[] }>>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof EventRow>('event_time');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  const handleRefund = (eventId: string) => {
    toast({
      title: 'Refund initiated',
      description: `Processing refund for event ${eventId}`
    });
    // make an API call to process the refund
    console.log(`Refunding event: ${eventId}`);
  };

  const approveReturn = (eventId: string) => {
    toast({
      title: 'Return approved',
      description: `Return for event ${eventId} has been approved.`
    });
    // make an API call to approve the return
    console.log(`Approving return for event: ${eventId}`);
  };

  const cancelOrder = (eventId: string) => {
    toast({
      title: 'Order cancelled',
      description: `Order for event ${eventId} has been cancelled.`
    });
    // make an API call to cancel the order
    console.log(`Cancelling order for event: ${eventId}`);
  };

  const handleDeny = (eventId: string) => {
    toast({
      title: 'Return denied',
      description: `Return for event ${eventId} has been denied.`
    });
    // make an API call to deny the return
    console.log(`Denying return for event: ${eventId}`);
  };

  const handleRetry = (eventId: string) => {
    toast({
      title: 'Retry initiated',
      description: `Processing retry for event ${eventId}`
    });
    // make an API call to retry the operation
    console.log(`Retrying event: ${eventId}`);
  };

  const handleMarkResolved = (eventId: string) => {
    setData(prevData => ({
      ...prevData,
      events: prevData.events.filter(event => event.id !== eventId)
    }));
    toast({
      title: 'Event resolved',
      description: `Event ${eventId} has been marked as resolved.`
    });
  };

  const handleSort = (field: keyof EventRow) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedEvents = events
    .filter(event =>
      Object.values(event).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  return {
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    handleSort,
    handleRefund,
    approveReturn,
    cancelOrder,
    handleDeny,
    handleRetry,
    handleMarkResolved,
    filteredAndSortedEvents
  };
}
