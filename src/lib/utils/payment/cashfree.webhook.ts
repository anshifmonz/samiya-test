import { getCashfreeInstance } from './cashfree.config';
import { ApiResponse, err, ok } from 'utils/api/response';

export const verifyCashfreeWebhook = (
  signature: string,
  rawBody: string,
  timestamp: string
): ApiResponse<null> => {
  try {
    const cashfree = getCashfreeInstance();
    cashfree.PGVerifyWebhookSignature(signature, rawBody, timestamp);
    return ok(null);
  } catch (_) {
    return err('Webhook verification failed');
  }
};
