export const mapCashfreeStatus = (cfStatus: string): string => {
  switch (cfStatus?.toUpperCase()) {
    case 'SUCCESS':
    case 'PAID':
      return 'completed';
    case 'FAILED':
    case 'CANCELLED':
      return 'failed';
    case 'PENDING':
    case 'ACTIVE':
      return 'pending';
    default:
      return 'pending';
  }
};
