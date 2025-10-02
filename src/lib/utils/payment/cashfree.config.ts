import { Cashfree, CFEnvironment } from 'cashfree-pg';

type CashfreeConfig = {
  clientId: string;
  clientSecret: string;
  environment: CFEnvironment;
  apiVersion?: string;
};

export const cashfreeConfig: CashfreeConfig = {
  clientId: process.env.CASHFREE_CLIENT_ID ?? '',
  clientSecret: process.env.CASHFREE_CLIENT_SECRET ?? '',
  environment:
    process.env.NODE_ENV === 'production' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
  apiVersion: '2025-01-01'
};

let cashfreeInstance: Cashfree | null = null;

export const getCashfreeInstance = (): Cashfree => {
  if (cashfreeInstance) return cashfreeInstance;

  if (!cashfreeConfig.clientId || !cashfreeConfig.clientSecret) {
    throw new Error(
      'Cashfree credentials not configured. Please set CASHFREE_CLIENT_ID and CASHFREE_CLIENT_SECRET environment variables.'
    );
  }

  cashfreeInstance = new Cashfree(
    cashfreeConfig.environment,
    cashfreeConfig.clientId,
    cashfreeConfig.clientSecret
  );

  return cashfreeInstance;
};
