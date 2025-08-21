/**
 * Map Shiprocket status ID (1-90) into a coarse-grained action bucket.
 *
 * Action Codes:
 * 1 = Normal Flow (just progress order)
 * 2 = Refund / Claim (refund amount, claim courier insurance, notify ops)
 * 3 = Retry / Reschedule (pickup errors, undelivered, misroutes)
 * 4 = Return Flow (return initiated, return in transit, RTO, etc.)
 * 5 = Cancelled (cancelled before shipment or by user/system)
 */
export const mapStatusIdToAction = (statusId: number | string): 1 | 2 | 3 | 4 | 5 => {
  if (statusId === null || statusId === undefined || statusId === '') return 3;

  const id = typeof statusId === 'number' ? statusId : Number(String(statusId).trim());
  if (!Number.isFinite(id) || Number.isNaN(id)) return 3;

  switch (id) {
    // === 1: Normal flow (acknowledgement / no-ops) ===
    case 1: case 2: case 3: case 4: case 6: case 7:
    case 19: case 20: case 30: case 41: case 43:
    case 51: case 52: case 58: case 59: case 60:
    case 61: case 62: case 64: case 65: case 66:
    case 67: case 69: case 70: case 71: case 72:
    case 73: case 74: case 75: case 76: case 80:
    case 81:
      return 1; // progress normally

    // === 2: Refund / Claim (damaged, lost, destroyed, etc.) ===
    case 8: case 11: case 33: case 36: case 39:
    case 40: case 53: case 57: case 88: case 89:
      return 2;

    // === 3: Retry / Reschedule / Investigate === (pickup/delivery issues)
    case 10: case 12: case 13: case 14: case 24:
    case 34: case 35: case 37: case 38: case 42:
    case 44: case 46: case 49: case 82: case 83:
      return 3;
    // 34 Need change

    // === 4: Return flow (RTO / customer return) ===
    case 9: case 15: case 16: case 17:
    case 18: case 21: case 22: case 23: case 25:
    case 26: case 27: case 28: case 29: case 31:
    case 32: case 45: case 47: case 48: case 50:
    case 55: case 68: case 87: case 90:
      return 4;

    // === 5: Cancelled before dispatch (Immediate refund/cancellation) ===
    case 5: case 54:
      return 5;

    // Fallback
    default:
      return 3; // treat unknown as retryable/exception
  }
};
