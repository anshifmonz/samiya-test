export const mapStatusIdToCategory = (statusId: number): string => {
  switch (statusId) {
    // Processing
    case 0:
    case 13: // Pickup Error
    case 15: // Pickup Rescheduled
    case 19: // Out For Pickup
    case 20: // Pickup Exception
    case 27: // Pickup Booked
    case 47: // QC FAILED
    case 48: // Reached Warehouse
    case 52: // Shipment Booked
    case 59: // Box Packing
    case 60: // FC Allocated
    case 61: // Picklist Generated
    case 62: // Ready To Pack
    case 68: // PROCESSED AT WAREHOUSE
    case 71: // HANDOVER EXCEPTION
    case 72: // PACKED EXCEPTION
      return 'processing';

    // Packed
    case 63: // Packed
    case 67: // FC MANIFEST GENERATED
      return 'packed';

    // Shipped
    case 6: // Shipped
    case 18: // In Transit
    case 22: // Delayed
    case 38: // REACHED AT DESTINATION HUB
    case 39: // MISROUTED
    case 42: // PICKED UP
    case 43: // SELF FULFILLED
    case 49: // Custom Cleared
    case 50: // In Flight
    case 51: // Handover to Courier
    case 54: // In Transit Overseas
    case 55: // Connection Aligned
    case 56: // Reached Overseas Warehouse
    case 57: // Custom Cleared Overseas
      return 'shipped';

    // Out for Delivery
    case 17: // Out For Delivery
      return 'out_for_delivery';

    // Delivered
    case 7: // Delivered
    case 26: // FULFILLED
      return 'delivered';

    // Cancelled
    case 8: // Canceled
    case 9: // RTO Initiated
    case 10: // RTO Delivered
    case 12: // Lost
    case 14: // RTO Acknowledged
    case 16: // Cancellation Requested
    case 21: // Undelivered
    case 23: // Partial_Delivered
    case 24: // DESTROYED
    case 25: // DAMAGED
    case 40: // RTO_NDR
    case 41: // RTO_OFD
    case 44: // DISPOSED OFF
    case 45: // CANCELLED_BEFORE_DISPATCHED
    case 46: // RTO IN INTRANSIT
    case 75: // RTO_LOCK
    case 76: // UNTRACEABLE
    case 77: // ISSUE_RELATED_TO_THE_RECIPIENT
    case 78: // REACHED_BACK_AT_SELLER_CITY
      return 'cancelled';

    default:
      return 'cancelled'; // Treat unknown as Cancelled
  }
};
