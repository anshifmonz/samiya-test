/**
 * Maps Shiprocket status IDs (1–90) to human-readable database enum status strings.
 * Combines status IDs with the same OrderStatusEnum value for conciseness.
 * Handles numeric or string inputs, converting strings to numbers.
 * Returns 'exception' for null, undefined, empty, or invalid inputs.
 * Based on CSV_BY_ID for accurate mapping of Shiprocket statuses.
 *
 * @param {number | string} statusId - The status ID to map.
 * @returns {OrderStatusEnum} - The mapped status string.
 */
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

export const mapStatusIdDbEnum = (statusId: number | string): OrderStatusEnum => {
  if (statusId === null || statusId === undefined || statusId === '') return 'exception';

  const id = typeof statusId === 'number' ? statusId : Number(String(statusId).trim());
  if (!Number.isFinite(id) || Number.isNaN(id)) return 'exception';

  switch (id) {
    // Core order flow: Initial order creation
    case 1: // New
    case 62: // Booked
      return 'new';

    // Core order flow: Invoiced stage
    case 2: // Invoiced
      return 'invoiced';

    // Core order flow: Pre-shipment warehouse processing
    case 3: // Ready To Ship
    case 58: // Reached Warehouse
    case 69: // Box Packing
    case 71: // DARKSTORE SCHEDULED
    case 72: // Allocation in Progress
    case 73: // FC Allocated
    case 74: // Picklist Generated
    case 75: // Ready to Pack
    case 76: // Packed
    case 80: // FC MANIFEST GENERATED
    case 81: // PROCESSED AT WAREHOUSE
      return 'ready_to_ship';

    // Core order flow: Pickup scheduling
    case 4: // Pickup Scheduled
    case 12: // Pickup Queue
    case 13: // Pickup Rescheduled
    case 34: // Out For Pickup
    case 70: // Pickup Booked
      return 'pickup_scheduled';

    // Core order flow: Shipped (post-pickup, pre-delivery)
    case 6: // Shipped
    case 52: // Self Fulfilled
    case 61: // Handover to Courier
      return 'shipped';

    // Core order flow: In transit to customer
    case 20: // In Transit
    case 43: // Reached Destination Hub
    case 51: // Picked Up
    case 59: // Custom Cleared
    case 60: // In Flight
    case 64: // In Transit Overseas
    case 65: // Connection Aligned
    case 66: // Reached Overseas Warehouse
    case 67: // Custom Cleared Overseas
      return 'in_transit';

    // Core order flow: Out for final delivery
    case 19: // Out for Delivery
      return 'out_for_delivery';

    // Core order flow: Successfully delivered
    case 7: // Delivered
    case 41: // Fulfilled
      return 'delivered';

    // Cancellation flow: Order or return canceled
    case 5: // Canceled
    case 18: // Cancellation Requested
    case 27: // Return Cancelled
    case 30: // Return Pickup Cancelled
    case 54: // Canceled before Dispatched
      return 'canceled';

    // Return flow: Initiated return process
    case 21: // Return Pending
    case 22: // Return Initiated
    case 23: // Return Pickup Queued
    case 28: // Return Pickup Generated
    case 29: // Return Cancellation Requested
    case 31: // Return Pickup Rescheduled
    case 47: // Return Out For Pickup
    case 68: // RETURN ACKNOWLEDGED
      return 'return_initiated';

    // Return flow: Return in transit to seller
    case 25: // Return In Transit
    case 32: // Return Picked Up
    case 48: // Return Out For Delivery
      return 'return_in_transit';

    // Return flow: Return completed
    case 9: // Returned
    case 26: // Return Delivered
      return 'returned';

    // RTO flow: Return to origin initiated or in progress
    case 15: // RTO Initiated
    case 17: // RTO Acknowledged
    case 45: // RTO_OFD
    case 46: // RTO_NDR
    case 55: // RTO In-Transit
    case 87: // RTO_LOCK
      return 'rto_initiated';

    // RTO flow: Return to origin completed
    case 16: // RTO Delivered
    case 90: // REACHED_BACK_AT_SELLER_CITY
      return 'rto_delivered';

    // Failure flow: Clear failure cases (e.g., payment, delivery, or quality issues)
    case 8: // ePayment Failed
    case 11: // Unfulfillable
    case 33: // Lost
    case 36: // Undelivered
    case 39: // Destroyed
    case 40: // Damaged
    case 53: // Disposed Off
    case 57: // QC Failed
    case 88: // UNTRACEABLE
    case 89: // ISSUE_RELATED_TO_THE_RECIPIENT
      return 'failed';

    // Exception flow: Errors or ambiguous states requiring investigation
    case 10: // Unmapped
    case 14: // Pickup Error
    case 24: // Return Pickup Error
    case 35: // Pickup Exception
    case 37: // Delivery Delayed
    case 38: // Partial Delivered
    case 42: // Archived
    case 44: // Misrouted
    case 50: // Return Undelivered
    case 49: // Return Pickup Exception
    case 82: // PACKED EXCEPTION
    case 83: // HANDOVER EXCEPTION
      return 'exception';

    // Fallback for any unmapped or invalid status IDs
    default:
      return 'exception';
  }
};
