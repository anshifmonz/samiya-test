/**
 * Map Shiprocket status ID (1–90) to a granular action code based on CSV_BY_ID.
 *
 * Action Catalog:
 * 1: NORMAL — No action needed; just update status (acknowledgments, already initiated, or informational updates).
 * 2: CREATE_RETURN_REQUEST — Create/trigger a return pickup or request.
 * 3: CREATE_REFUND and RETURN_REQUEST — Create a refund (post-delivery or confirmed lost/damaged where policy dictates refund).
 * 4: MANUAL_CHECK_AND_REFUND — Requires ops review; if criteria met, refund.
 * 5: IMMEDIATE_REFUND — Refund immediately (clear, policy-approved cases).
 * 6: MANUAL_CHECK — Ops review required (insufficient data, conflicting signals, or unmapped statuses).
 *
 * Decision Rules:
 * - NORMAL (1): Applied to statuses that are informational, acknowledge an ongoing process, or require no immediate action (e.g., "In Transit", "RTO Initiated").
 * - CREATE_RETURN_REQUEST (2): Used when the merchant must initiate or schedule a return pickup (e.g., "Return Pickup Error").
 * - CREATE_REFUND and RETURN_REQUEST (3): For statuses indicating a final state like delivered returns or lost/damaged items where policy mandates a refund (e.g., "Return Delivered").
 * - MANUAL_CHECK_AND_REFUND (4): For statuses requiring verification before refund, such as "RTO Delivered" where inventory must be checked.
 * - IMMEDIATE_REFUND (5): For clear cancellation cases before dispatch (e.g., "Canceled").
 * - MANUAL_CHECK (6): Fallback for unmapped, ambiguous, or error-prone statuses requiring investigation (e.g., "Unmapped").
 */
export const mapStatusIdToAction = (statusId: number | string): 1 | 2 | 3 | 4 | 5 | 6 => {
  if (statusId === null || statusId === undefined || statusId === '') return 6;

  const id = typeof statusId === 'number' ? statusId : Number(String(statusId).trim());
  if (!Number.isFinite(id) || Number.isNaN(id)) return 6;

  switch (id) {
    // === 1: NORMAL (acknowledgments, informational, or no action needed) ===
    case 1: // New
    case 2: // Invoiced
    case 3: // Ready To Ship
    case 4: // Pickup Scheduled
    case 6: // Shipped
    case 7: // Delivered
    case 13: // Pickup Rescheduled
    case 15: // RTO Initiated
    case 19: // Out for Delivery
    case 20: // In Transit
    case 21: // Return Pending
    case 22: // Return Initiated
    case 23: // Return Pickup Queued
    case 25: // Return In Transit
    case 27: // Return Cancelled
    case 28: // Return Pickup Generated
    case 29: // Return Cancellation Requested
    case 30: // Return Pickup Cancelled
    case 31: // Return Pickup Rescheduled
    case 32: // Return Picked Up
    case 34: // Out For Pickup
    case 41: // Fulfilled
    case 42: // Archived
    case 43: // Reached Destination Hub
    case 45: // RTO_OFD
    case 47: // Return Out For Pickup
    case 48: // Return Out For Delivery
    case 51: // Picked Up
    case 52: // Self Fulfilled
    case 55: // RTO In-Transit
    case 58: // Reached Warehouse
    case 59: // Custom Cleared
    case 60: // In Flight
    case 61: // Handover to Courier
    case 62: // Booked
    case 64: // In Transit Overseas
    case 65: // Connection Aligned
    case 66: // Reached Overseas Warehouse
    case 67: // Custom Cleared Overseas
    case 68: // RETURN ACKNOWLEDGED
    case 69: // Box Packing
    case 70: // Pickup Booked
    case 71: // DARKSTORE SCHEDULED
    case 73: // FC Allocated
    case 74: // Picklist Generated
    case 75: // Ready to Pack
    case 76: // Packed
    case 80: // FC MANIFEST GENERATED
    case 81: // PROCESSED AT WAREHOUSE
    case 87: // RTO_LOCK
    case 90: // REACHED_BACK_AT_SELLER_CITY
      return 1;

    // === 2: CREATE_RETURN_REQUEST (merchant must initiate/schedule return pickup) ===
    // return 2;

    // === 3: CREATE_REFUND and RETURN_REQUEST (policy-driven refund for delivered/lost/damaged) ===
    case 33: // Lost
    case 39: // Destroyed
    case 40: // Damaged
    case 53: // Disposed Off
      return 3;

    // === 4: MANUAL_CHECK_AND_REFUND (verify before refund, e.g., inventory check) ===
    case 9: // Returned
    case 16: // RTO Delivered
    case 17: // RTO Acknowledged
    case 26: // Return Delivered
      return 4;

    // === 5: IMMEDIATE_REFUND (clear cancellation cases) ===
    case 5: // Canceled
    case 18: // Cancellation Requested
    case 54: // Canceled before Dispatched
      return 5;

    // === 6: MANUAL_CHECK (investigate ambiguous/error statuses) ===
    case 8: // ePayment Failed
    case 10: // Unmapped
    case 11: // Unfulfillable
    case 12: // Pickup Queue
    case 14: // Pickup Error
    case 24: // Return Pickup Error
    case 35: // Pickup Exception         Will reschedule pickup
    case 36: // Undelivered
    case 37: // Delivery Delayed
    case 38: // Partial Delivered
    case 44: // Misrouted
    case 46: // RTO_NDR
    case 49: // Return Pickup Exception  Will reschedule pickup
    case 50: // Return Undelivered
    case 57: // QC Failed
    case 82: // PACKED EXCEPTION
    case 83: // HANDOVER EXCEPTION
    case 88: // UNTRACEABLE
    case 89: // ISSUE_RELATED_TO_THE_RECIPIENT
      return 6;

    // Fallback for unmapped or ambiguous statuses
    default:
      return 6;
  }
};
