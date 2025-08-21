export type SubAction =
  | 'acknowledge'
  | 'handover_to_courier'
  | 'track_delivery'
  | 'complete_order'
  | 'refund_customer'
  | 'file_insurance_claim'
  | 'manual_investigation'
  | 'reschedule_pickup'
  | 'reschedule_delivery'
  | 'investigate'
  | 'create_return'
  | 'return_in_transit'
  | 'close_return'
  | 'auto_refund'
  | 'close_order';

export const mapStatusIdToOpsAction = (statusId: number | string): SubAction => {
  if (statusId === null || statusId === undefined || statusId === '') return 'investigate';

  const id = typeof statusId === 'number' ? statusId : Number(String(statusId).trim());
  if (!Number.isFinite(id) || Number.isNaN(id)) return 'investigate';

  switch (id) {
    // === 1. Normal flow ===
    case 1: case 2: case 3: return 'acknowledge';
    case 61: return 'handover_to_courier';
    case 6: case 19: case 20: case 41: case 43: case 51:
    case 58: case 59: case 60: case 62: case 64: case 65:
    case 66: case 67: case 69: case 70: case 71: case 72:
    case 73: case 74: case 75: case 76: case 80: case 81:
    case 52: return 'track_delivery';
    case 7: return 'complete_order';

    // === 2. Refund / Claim ===
    case 8: case 36: return 'refund_customer'; // ePayment failed / undelivered prepaid
    case 33: case 39: case 40: case 53: case 57: return 'file_insurance_claim'; // lost, destroyed
    case 11: case 88: case 89: return 'manual_investigation';

    // === 3. Retry / Reschedule ===
    case 12: case 13: case 14: case 34: return 'reschedule_pickup';
    case 37: case 38: case 44: case 46: return 'reschedule_delivery';
    case 10: case 24: case 35: case 42: case 49: case 82: case 83: return 'investigate';

    // === 4. Return Flow ===
    case 18: case 21: case 22: case 23: case 28: case 29: case 31: case 68: return 'create_return';
    case 15: case 17: case 25: case 32: case 45: case 47: case 48: case 50: case 55: case 87: return 'return_in_transit';
    case 9: case 16: case 26: case 90: return 'refund_customer';
    case 27: case 30: return 'close_return';
    // NOTE: 18 = cancellation requested — should inspect order/shipment state:
    //  - if not picked up -> auto_refund
    //  - if picked up/in-transit -> create_return and wait for warehouse receipt before refund

    // === 5. Cancelled ===
    case 5: case 54: return 'auto_refund';

    // === Default ===
    default:
      return 'investigate';
  }
};
