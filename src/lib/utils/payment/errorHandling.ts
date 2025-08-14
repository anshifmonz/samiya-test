// Payment error handling utilities

export interface PaymentError {
  code: string;
  message: string;
  type: 'network' | 'validation' | 'payment_gateway' | 'server' | 'user';
  retryable: boolean;
  userMessage: string;
}

// Common payment error codes and their handling
export const PAYMENT_ERROR_CODES = {
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  
  // Validation errors
  INVALID_ORDER: 'INVALID_ORDER',
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  INVALID_CUSTOMER: 'INVALID_CUSTOMER',
  
  // Payment gateway errors
  PAYMENT_DECLINED: 'PAYMENT_DECLINED',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  CARD_EXPIRED: 'CARD_EXPIRED',
  INVALID_CARD: 'INVALID_CARD',
  GATEWAY_ERROR: 'GATEWAY_ERROR',
  
  // Server errors
  ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
  PAYMENT_SESSION_EXPIRED: 'PAYMENT_SESSION_EXPIRED',
  DUPLICATE_PAYMENT: 'DUPLICATE_PAYMENT',
  
  // User errors
  ORDER_ALREADY_PAID: 'ORDER_ALREADY_PAID',
  ORDER_CANCELLED: 'ORDER_CANCELLED',
  PAYMENT_CANCELLED: 'PAYMENT_CANCELLED'
} as const;

export const mapErrorToPaymentError = (error: any): PaymentError => {
  // Network errors
  if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    return {
      code: PAYMENT_ERROR_CODES.NETWORK_ERROR,
      message: error.message,
      type: 'network',
      retryable: true,
      userMessage: 'Network connection failed. Please check your internet connection and try again.'
    };
  }

  if (error.code === 'ETIMEDOUT') {
    return {
      code: PAYMENT_ERROR_CODES.TIMEOUT,
      message: error.message,
      type: 'network',
      retryable: true,
      userMessage: 'Request timed out. Please try again.'
    };
  }

  // Cashfree specific errors
  if (error.response?.data) {
    const errorData = error.response.data;
    
    if (errorData.type === 'invalid_request_error') {
      return {
        code: PAYMENT_ERROR_CODES.INVALID_ORDER,
        message: errorData.message,
        type: 'validation',
        retryable: false,
        userMessage: 'Invalid payment request. Please contact support.'
      };
    }

    if (errorData.type === 'authentication_error') {
      return {
        code: PAYMENT_ERROR_CODES.GATEWAY_ERROR,
        message: errorData.message,
        type: 'payment_gateway',
        retryable: false,
        userMessage: 'Payment service authentication failed. Please contact support.'
      };
    }

    if (errorData.type === 'rate_limit_error') {
      return {
        code: PAYMENT_ERROR_CODES.GATEWAY_ERROR,
        message: errorData.message,
        type: 'payment_gateway',
        retryable: true,
        userMessage: 'Too many requests. Please wait a moment and try again.'
      };
    }
  }

  // HTTP status code based errors
  if (error.response?.status) {
    switch (error.response.status) {
      case 400:
        return {
          code: PAYMENT_ERROR_CODES.INVALID_ORDER,
          message: error.response.data?.message || 'Bad request',
          type: 'validation',
          retryable: false,
          userMessage: 'Invalid payment information. Please check your details and try again.'
        };
      
      case 401:
        return {
          code: PAYMENT_ERROR_CODES.GATEWAY_ERROR,
          message: 'Unauthorized',
          type: 'payment_gateway',
          retryable: false,
          userMessage: 'Payment authorization failed. Please contact support.'
        };
      
      case 404:
        return {
          code: PAYMENT_ERROR_CODES.ORDER_NOT_FOUND,
          message: 'Order not found',
          type: 'validation',
          retryable: false,
          userMessage: 'Order not found. Please refresh the page and try again.'
        };
      
      case 409:
        return {
          code: PAYMENT_ERROR_CODES.DUPLICATE_PAYMENT,
          message: 'Payment already processed',
          type: 'user',
          retryable: false,
          userMessage: 'This order has already been paid. Please check your order history.'
        };
      
      case 429:
        return {
          code: PAYMENT_ERROR_CODES.GATEWAY_ERROR,
          message: 'Rate limit exceeded',
          type: 'payment_gateway',
          retryable: true,
          userMessage: 'Too many requests. Please wait a moment and try again.'
        };
      
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          code: PAYMENT_ERROR_CODES.GATEWAY_ERROR,
          message: 'Server error',
          type: 'server',
          retryable: true,
          userMessage: 'Payment service is temporarily unavailable. Please try again in a few minutes.'
        };
    }
  }

  // Default error
  return {
    code: 'UNKNOWN_ERROR',
    message: error.message || 'Unknown error occurred',
    type: 'server',
    retryable: true,
    userMessage: 'An unexpected error occurred. Please try again or contact support if the problem persists.'
  };
};

export const shouldRetryPayment = (error: PaymentError): boolean => {
  return error.retryable && (error.type === 'network' || error.type === 'server');
};

export const getRetryDelay = (attemptNumber: number): number => {
  // Exponential backoff: 1s, 2s, 4s, 8s, 16s
  return Math.min(1000 * Math.pow(2, attemptNumber - 1), 16000);
};

export const formatPaymentError = (error: PaymentError): string => {
  return error.userMessage;
};

// Recovery strategies for different error types
export const getRecoveryStrategy = (error: PaymentError): {
  action: 'retry' | 'redirect' | 'contact_support' | 'refresh';
  message: string;
} => {
  switch (error.type) {
    case 'network':
      return {
        action: 'retry',
        message: 'Check your internet connection and try again.'
      };
    
    case 'validation':
      if (error.code === PAYMENT_ERROR_CODES.ORDER_NOT_FOUND) {
        return {
          action: 'refresh',
          message: 'Please refresh the page and try again.'
        };
      }
      return {
        action: 'contact_support',
        message: 'Please contact support for assistance.'
      };
    
    case 'payment_gateway':
      if (error.retryable) {
        return {
          action: 'retry',
          message: 'Wait a moment and try again.'
        };
      }
      return {
        action: 'contact_support',
        message: 'Please contact support for assistance.'
      };
    
    case 'server':
      return {
        action: 'retry',
        message: 'Try again in a few minutes.'
      };
    
    case 'user':
      if (error.code === PAYMENT_ERROR_CODES.ORDER_ALREADY_PAID) {
        return {
          action: 'redirect',
          message: 'Check your order history.'
        };
      }
      return {
        action: 'refresh',
        message: 'Please refresh the page and try again.'
      };
    
    default:
      return {
        action: 'contact_support',
        message: 'Please contact support if the problem persists.'
      };
  }
};
