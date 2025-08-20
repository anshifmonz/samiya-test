/**
 * Map Cashfree gateway status -> local DB payment_status_enum
 * Returned values: 'unpaid' | 'paid' | 'failed' | 'dropped' | 'refunded'
 */
export const mapCashfreeStatus = (cfStatus?: string): string => {
  if (!cfStatus) return 'unpaid';

  switch (cfStatus.toUpperCase()) {
    // success / paid
    case 'SUCCESS':
    case 'PAID':
      return 'paid';

    // final failure / cancelled
    case 'FAILED':
    case 'CANCELLED':
    case 'AUTH_FAILED':
      return 'failed';

    // user abandoned / dropped flows
    case 'USER_DROPPED':
    case 'ABANDONED':
    case 'EXPIRED':
      return 'dropped';

    // refunds
    case 'REFUND':
    case 'REFUNDED':
    case 'PARTIAL_REFUND':
    case 'PARTIALLY_REFUNDED':
      return 'refunded';

    // still in-flight / not paid yet
    case 'PENDING':
    case 'ACTIVE':
    case 'INITIATED':
    case 'PROCESSING':
      return 'unpaid';

    default:
      return 'unpaid';
  }
};
