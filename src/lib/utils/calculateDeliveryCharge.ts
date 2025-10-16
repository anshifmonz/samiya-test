export const calculateDeliveryCharge = (subtotal: number): number =>
  subtotal === 0 ? 0 : subtotal < 1000 ? 40 : 0;
