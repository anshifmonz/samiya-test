export type OrderStatusEnum =
  | 'new'
  | 'invoiced'
  | 'ready_to_ship'
  | 'pickup_scheduled'
  | 'shipped'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'canceled'
  | 'return_initiated'
  | 'return_in_transit'
  | 'returned'
  | 'rto_initiated'
  | 'rto_delivered'
  | 'failed'
  | 'exception';

/**
* @param {number | string} statusId - The status ID to map.
* @returns {OrderStatusEnum} - The mapped status string.
* @description Maps Shiprocket status IDs to human-readable status strings.
* Handles both numeric and string inputs, converting strings to numbers if necessary.
* Shiprocket status IDs -> order_status_enum db type.
*/

export const mapShiprocketStatusId = (statusId: number | string): OrderStatusEnum => {
  if (statusId === null || statusId === undefined || statusId === '') return 'exception';

  const id = typeof statusId === 'number' ? statusId : Number(String(statusId).trim());
  if (!Number.isFinite(id) || Number.isNaN(id)) return 'exception';

  switch (id) {
    // Core order flow
    case 1: return 'new';
    case 2: return 'invoiced';
    case 3: return 'ready_to_ship';
    case 4: return 'pickup_scheduled';
    case 5: return 'canceled';
    case 6: return 'shipped';
    case 7: return 'delivered';
    case 8: return 'failed'; // ePayment Failed
    case 9: return 'returned';
    case 10: return 'exception'; // Unmapped
    case 11: return 'failed'; // Unfulfillable
    case 12: return 'pickup_scheduled'; // Pickup Queue
    case 13: return 'pickup_scheduled'; // Pickup Rescheduled
    case 14: return 'exception'; // Pickup Error

    // RTO
    case 15: return 'rto_initiated';
    case 16: return 'rto_delivered';
    case 17: return 'rto_initiated'; // RTO Acknowledged -> treat as started
    case 18: return 'canceled'; // Cancellation Requested

    // Delivery / transit
    case 19: return 'out_for_delivery';
    case 20: return 'in_transit';

    // Returns (various)
    case 21: return 'return_initiated';
    case 22: return 'return_initiated';
    case 23: return 'return_initiated';
    case 24: return 'exception'; // Return Pickup Error
    case 25: return 'return_in_transit';
    case 26: return 'returned';
    case 27: return 'canceled'; // Return Cancelled
    case 28: return 'return_initiated';
    case 29: return 'return_initiated';
    case 30: return 'canceled'; // Return Pickup Cancelled
    case 31: return 'return_initiated';
    case 32: return 'return_in_transit';

    case 33: return 'failed'; // Lost
    case 34: return 'pickup_scheduled'; // Out For Pickup
    case 35: return 'exception'; // Pickup Exception
    case 36: return 'failed'; // Undelivered
    case 37: return 'exception'; // Delivery Delayed -> treat as failure for user-facing
    case 38: return 'exception'; // Partial Delivered -> treat as failure / exception
    case 39: return 'failed'; // Destroyed
    case 40: return 'failed'; // Damaged

    case 41: return 'shipped'; // Fulfilled
    case 42: return 'exception'; // Archived
    case 43: return 'in_transit'; // Reached Destination Hub
    case 44: return 'exception'; // Misrouted
    case 45: return 'rto_initiated'; // RTO_OFD
    case 46: return 'rto_initiated'; // RTO_NDR
    case 47: return 'return_in_transit';
    case 48: return 'return_in_transit';
    case 49: return 'exception'; // Return Pickup Exception
    case 50: return 'return_in_transit';
    case 51: return 'in_transit'; // Picked Up
    case 52: return 'shipped'; // Self Fulfilled (treat as shipped)
    case 53: return 'failed'; // Disposed Off
    case 54: return 'canceled'; // Canceled before Dispatched
    case 55: return 'rto_initiated'; // RTO In-Transit

    case 57: return 'failed'; // QC Failed
    case 58: return 'ready_to_ship'; // Reached Warehouse (warehouse stage)
    case 59: return 'in_transit'; // Custom Cleared
    case 60: return 'in_transit'; // In Flight
    case 61: return 'shipped'; // Handover to Courier
    case 62: return 'new'; // Booked

    case 64: return 'in_transit'; // In Transit Overseas
    case 65: return 'in_transit'; // Connection Aligned
    case 66: return 'in_transit'; // Reached Overseas Warehouse
    case 67: return 'in_transit'; // Custom Cleared Overseas
    case 68: return 'return_initiated'; // RETURN ACKNOWLEDGED
    case 69: return 'ready_to_ship'; // Box Packing
    case 70: return 'pickup_scheduled'; // Pickup Booked
    case 71: return 'ready_to_ship'; // DARKSTORE SCHEDULED
    case 72: return 'ready_to_ship'; // Allocation in Progress

    // Warehouse / fulfillment sub-states
    case 73: return 'ready_to_ship'; // FC Allocated
    case 74: return 'ready_to_ship'; // Picklist Generated
    case 75: return 'ready_to_ship'; // Ready to Pack
    case 76: return 'ready_to_ship'; // Packed
    case 80: return 'ready_to_ship'; // FC MANIFEST GENERATED
    case 81: return 'ready_to_ship'; // PROCESSED AT WAREHOUSE
    case 82: return 'exception'; // PACKED EXCEPTION
    case 83: return 'exception'; // HANDOVER EXCEPTION

    case 87: return 'rto_initiated'; // RTO_LOCK
    case 88: return 'failed'; // UNTRACEABLE
    case 89: return 'failed'; // ISSUE_RELATED_TO_THE_RECIPIENT
    case 90: return 'rto_delivered'; // REACHED_BACK_AT_SELLER_CITY

    // Default - any unknown/unlisted status -> exception
    default:
      return 'exception';
  }
};
