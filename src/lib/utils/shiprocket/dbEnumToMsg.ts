type StatusInfo = {
  title: string;
  description: string;
  color: string;
};

export const returnHelper = (title: string, description: string, color: string): StatusInfo => {
  return { title, description, color };
};

/**
 * @param {string} status - The status to map.
 * @returns {StatusInfo} - Object with title, description, and color for user-facing display.
 */
export const DbEnumToMessage = (status?: string): StatusInfo => {
  const s = (status || '').toLowerCase();

  switch (s) {
    // Before delivered
    case 'pending':
      return returnHelper('Pending', 'Your order is pending and will be processed soon.', '#f59e0b'); // amber

    case 'new':
    case 'invoiced':
    case 'ready_to_ship':
    case 'pickup_scheduled':
      return returnHelper('Order Placed', 'Your order has been received and is being processed.', '#06b6d4'); // teal/cyan

    case 'shipped':
    case 'in_transit':
      return returnHelper('Shipped', 'Your order is on its way to the delivery hub.', '#0ea5a4'); // teal

    case 'out_for_delivery':
      return returnHelper('Out for Delivery', 'Your order is out for delivery and should arrive soon.', '#0891b2'); // darker teal/blue

    // Delivered
    case 'delivered':
      return returnHelper('Delivered', 'Your order has been delivered. Enjoy!', '#16a34a'); // green

    case 'cancelled':
    case 'failed':
      return returnHelper('Cancelled', 'This order has been cancelled. Contact support if this is unexpected.', '#ef4444'); // red

    // After delivered
    case 'return_initiated':
    case 'return_in_transit':
    case 'rto_initiated':
      return returnHelper('Return in Progress', 'Your return is being processed and is in progress.', '#7c3aed'); // purple

    case 'returned':
    case 'rto_delivered':
      return returnHelper('Returned', 'The return has been received by the seller. Refund or next steps will follow.', '#7c3aed'); // purple

    // Fallback for any unmapped or invalid status
    case 'exception':
    default:
      return returnHelper('Action Required', 'There is an issue with this order that needs attention.', '#6b7280'); // gray
  }
};
