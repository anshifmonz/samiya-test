'use client';

import { useCallback, useRef } from 'react';
import { apiRequest, type ApiRequestOptions } from 'utils/apiRequest';

// Enhanced hook for search API calls that automatically triggers the loading progress bar
export const useSearchWithLoadingBar = () => {
  const searchRequest = useCallback(async <T = any>(
    url: string,
    options?: Omit<ApiRequestOptions, 'showLoadingBar' | 'loadingBarDelay'> & {
      loadingBarDelay?: number;
      skipLoadingBar?: boolean;
    }
  ): Promise<{ data: T | null; error: string | null; response: Response | null }> => {
    const {
      loadingBarDelay = 300,
      skipLoadingBar = false,
      ...restOptions
    } = options || {};

    return apiRequest<T>(url, {
      ...restOptions,
      showLoadingBar: !skipLoadingBar,
      loadingBarDelay,
      showErrorToast: restOptions.showErrorToast !== false,
    });
  }, []);

  return { searchRequest };
};

// Utility function for quick search API calls with loading bar
export const searchWithLoadingBar = async <T = any>(
  url: string,
  options?: {
    method?: 'GET' | 'POST';
    body?: any;
    headers?: Record<string, string>;
    loadingBarDelay?: number;
    showErrorToast?: boolean;
  }
): Promise<{ data: T | null; error: string | null }> => {
  const {
    method = 'GET',
    body,
    headers,
    loadingBarDelay = 300,
    showErrorToast = true,
  } = options || {};

  const result = await apiRequest<T>(url, {
    method,
    body,
    headers,
    showLoadingBar: true,
    loadingBarDelay,
    showErrorToast,
  });

  return { data: result.data, error: result.error };
};

// Debounced search function with loading bar for real-time search
export const useDebouncedSearchWithLoadingBar = () => {
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSearch = useCallback((
    searchFn: () => Promise<void>,
    delay: number = 500
  ) => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = setTimeout(async () => {
      await searchFn();
    }, delay);
  }, []);

  return { debouncedSearch };
};
