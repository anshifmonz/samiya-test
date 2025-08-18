export const generateReturnUrl = (orderId: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/user/payment/status?order_id=${orderId}`;
};

export const generateWebhookUrl = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/api/payment/webhook`;
};
