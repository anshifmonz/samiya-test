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
 * @returns {string} - The human-readable message for the given status.
 * @description Map DB enum -> friendly title + description + color.
 */
export const DbEnumToMessage = (status?: string): StatusInfo => {
  const s = (status || '').toLowerCase();

  switch (s) {
    case 'new':               return returnHelper('Order Placed', 'Your order has been received and is being processed.', '#06b6d4'); // teal/cyan
    case 'invoiced':          return returnHelper('Invoice Generated', 'We have generated your invoice and will prepare your order.', '#0284c7'); // blue
    case 'ready_to_ship':     return returnHelper('Preparing for Shipment', 'Your order is being packed and prepared for pickup.', '#f97316'); // amber / orange
    case 'pickup_scheduled':  return returnHelper('Pickup Scheduled', 'Courier pickup is scheduled — we’ll hand over your package soon.', '#f97316'); // amber / orange
    case 'shipped':           return returnHelper('Shipped', 'Your package has been shipped from the warehouse.', '#0ea5a4'); // teal
    case 'in_transit':        return returnHelper('In Transit', 'Your order is on its way to the delivery hub.', '#0ea5a4'); // teal
    case 'out_for_delivery':  return returnHelper('Out for Delivery', 'Courier is out to deliver your package — expect delivery today.', '#0891b2'); // darker teal/blue
    case 'delivered':         return returnHelper('Delivered', 'Your order has been delivered. Enjoy!', '#16a34a'); // green
    case 'canceled':          return returnHelper('Cancelled', 'This order has been cancelled. Contact support if this is unexpected.', '#ef4444'); // red
    case 'return_initiated':  return returnHelper('Return Initiated', 'Return request has been created — we will update you as it progresses.', '#7c3aed'); // purple
    case 'return_in_transit': return returnHelper('Return in Transit', 'The return shipment is on its way back to us.', '#7c3aed'); // purple
    case 'returned':          return returnHelper('Return Completed', 'We have received the returned item. Refund/next steps will follow.', '#7c3aed'); // purple
    case 'rto_initiated':     return returnHelper('Return to Seller — In Progress', 'The package is being returned to the seller (RTO in progress).', '#7c3aed'); // purple
    case 'rto_delivered':     return returnHelper('Returned to Seller', 'The package has been returned to the seller/warehouse.', '#7c3aed'); // purple
    case 'failed':            return returnHelper('Delivery Failed', 'There was an issue with delivery. Contact support for details.', '#ef4444'); // red
    case 'exception':
    default: return returnHelper('Action Required', 'There is an issue with this order that needs attention.', '#6b7280'); // gray
  }
};
