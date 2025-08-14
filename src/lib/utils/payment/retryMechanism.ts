import { mapErrorToPaymentError, shouldRetryPayment, getRetryDelay } from './errorHandling';

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 16000, // 16 seconds
  backoffMultiplier: 2
};

export class PaymentRetryManager {
  private config: RetryConfig;
  private attemptCounts: Map<string, number> = new Map();

  constructor(config: RetryConfig = DEFAULT_RETRY_CONFIG) {
    this.config = config;
  }

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationId: string,
    onRetry?: (attempt: number, error: any) => void
  ): Promise<T> {
    let lastError: any;
    const maxAttempts = this.config.maxAttempts;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await operation();
        // Success - reset attempt count
        this.attemptCounts.delete(operationId);
        return result;
      } catch (error) {
        lastError = error;
        const paymentError = mapErrorToPaymentError(error);

        // If this is the last attempt or error is not retryable, throw
        if (attempt === maxAttempts || !shouldRetryPayment(paymentError)) {
          this.attemptCounts.delete(operationId);
          throw error;
        }

        // Calculate delay for next attempt
        const delay = Math.min(
          this.config.baseDelay * Math.pow(this.config.backoffMultiplier, attempt - 1),
          this.config.maxDelay
        );

        // Update attempt count
        this.attemptCounts.set(operationId, attempt);

        // Call retry callback if provided
        if (onRetry) {
          onRetry(attempt, error);
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  getAttemptCount(operationId: string): number {
    return this.attemptCounts.get(operationId) || 0;
  }

  canRetry(operationId: string): boolean {
    return this.getAttemptCount(operationId) < this.config.maxAttempts;
  }

  resetAttempts(operationId: string): void {
    this.attemptCounts.delete(operationId);
  }
}

// Global retry manager instance
export const paymentRetryManager = new PaymentRetryManager();

// Utility function for retrying payment operations
export async function retryPaymentOperation<T>(
  operation: () => Promise<T>,
  operationId: string,
  config?: Partial<RetryConfig>,
  onRetry?: (attempt: number, error: any) => void
): Promise<T> {
  const retryManager = config 
    ? new PaymentRetryManager({ ...DEFAULT_RETRY_CONFIG, ...config })
    : paymentRetryManager;

  return retryManager.executeWithRetry(operation, operationId, onRetry);
}

// Specific retry functions for common payment operations
export async function retryPaymentInitiation(
  orderId: string,
  initiatePayment: () => Promise<any>,
  onRetry?: (attempt: number, error: any) => void
): Promise<any> {
  return retryPaymentOperation(
    initiatePayment,
    `payment_initiation_${orderId}`,
    { maxAttempts: 2 }, // Fewer retries for initiation
    onRetry
  );
}

export async function retryPaymentVerification(
  orderId: string,
  verifyPayment: () => Promise<any>,
  onRetry?: (attempt: number, error: any) => void
): Promise<any> {
  return retryPaymentOperation(
    verifyPayment,
    `payment_verification_${orderId}`,
    { maxAttempts: 5, baseDelay: 2000 }, // More retries with longer delay for verification
    onRetry
  );
}

// Circuit breaker pattern for payment operations
export class PaymentCircuitBreaker {
  private failureCount: number = 0;
  private lastFailureTime: number = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private failureThreshold: number = 5,
    private recoveryTimeout: number = 60000 // 1 minute
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.recoveryTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Payment service is temporarily unavailable. Please try again later.');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  getState(): string {
    return this.state;
  }

  reset(): void {
    this.failureCount = 0;
    this.lastFailureTime = 0;
    this.state = 'CLOSED';
  }
}

// Global circuit breaker for payment operations
export const paymentCircuitBreaker = new PaymentCircuitBreaker();
