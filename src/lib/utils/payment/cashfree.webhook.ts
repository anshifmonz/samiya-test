import { getCashfreeInstance } from './cashfree.config';

export const verifyCashfreeWebhook = (
  signature: string,
  rawBody: string,
  timestamp: string
): boolean => {
  try {
    const cashfree = getCashfreeInstance();
    cashfree.PGVerifyWebhookSignature(signature, rawBody, timestamp);
    return true;
  } catch (error) {
    console.error('Webhook verification failed:', error);
    return false;
  }
};
