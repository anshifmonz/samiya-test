/**
 * Generate order number in format ORD-YYYY-XXX
 * @param createdAt - Order creation date
 * @param orderIndex - Sequential number for the year (1-based)
 * @returns Formatted order number
 */
export function generateOrderNumber(createdAt: string, orderIndex: number): string {
  const year = new Date(createdAt).getFullYear();
  const paddedIndex = orderIndex.toString().padStart(3, '0');
  return `ORD-${year}-${paddedIndex}`;
}

/**
 * Format shipping address for display
 * @param address - Address object from database
 * @returns Formatted address string
 */
export function formatShippingAddress(address: any): string {
  if (!address) return 'No shipping address';

  const parts = [
    address.street,
    address.landmark,
    address.city,
    address.district,
    address.state,
    address.postal_code,
    address.country
  ].filter(Boolean);

  return parts.join(', ');
}

/**
 * Get order index for the year (used for order number generation)
 * This is a simplified version - in production, you might want to use a database sequence
 * @param createdAt - Order creation date
 * @param allOrders - All orders to calculate index from
 * @returns Order index for the year
 */
export function getOrderIndexForYear(createdAt: string, allOrders: any[]): number {
  const orderYear = new Date(createdAt).getFullYear();
  const ordersInYear = allOrders.filter(order =>
    new Date(order.created_at).getFullYear() === orderYear
  );

  // Sort by creation date to get proper sequence
  ordersInYear.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  // Find the index of current order by creation date
  const currentOrderIndex = ordersInYear.findIndex(order => order.created_at === createdAt);

  return currentOrderIndex >= 0 ? currentOrderIndex + 1 : ordersInYear.length + 1; // 1-based index
}
