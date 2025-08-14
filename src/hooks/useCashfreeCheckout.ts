import { useCallback, useState } from 'react';
import { load, Cashfree } from '@cashfreepayments/cashfree-js';

type CashfreeMode = 'sandbox' | 'production';

interface UseCashfreeCheckoutOptions {
  mode?: CashfreeMode;
}

interface CheckoutResult {
  success: boolean;
  error?: string;
}

export function useCashfreeCheckout({ mode = "sandbox" }: UseCashfreeCheckoutOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [cashfreeInstance, setCashfreeInstance] = useState<Cashfree | null>(null);

  // Ensure SDK is loaded before starting checkout
  const initCashfree = useCallback(async () => {
    if (!cashfreeInstance) {
      const cf = await load({ mode });
      setCashfreeInstance(cf);
      return cf;
    }
    return cashfreeInstance;
  }, [cashfreeInstance, mode]);

  const startCheckout = useCallback(
    async (paymentSessionId: string, redirectTarget: "_self" | "_blank" | "modal" = "_self"): Promise<CheckoutResult> => {
      setIsLoading(true);
      try {
        const cf = await initCashfree();
        const result = await cf.checkout({
          paymentSessionId,
          redirectTarget,
        });

        setIsLoading(false);

        if (result.error)
          return { success: false, error: result.error.message || "Payment failed" };

        return { success: true, error: null };
      } catch (err: any) {
        setIsLoading(false);
        return { success: false, error: err?.message || "Payment error" };
      }
    },
    [initCashfree]
  );

  return { startCheckout, isLoading };
}
