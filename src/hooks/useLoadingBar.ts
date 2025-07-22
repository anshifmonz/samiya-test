'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useNextLoadingBar } from 'components/shared/NextLoadingBar';

export const useLoadingBar = () => {
  const { startLoading, stopLoading } = useNextLoadingBar();
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Start loading with optional auto-stop after delay
  const start = useCallback((autoStopAfter?: number) => {
    startLoading();

    if (autoStopAfter && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (autoStopAfter) {
      timeoutRef.current = setTimeout(() => {
        stopLoading();
      }, autoStopAfter);
    }
  }, [startLoading, stopLoading]);

  // Stop loading
  const stop = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    stopLoading();
  }, [stopLoading]);

  // Wrapper for async functions
  const withLoading = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    options?: {
      minDuration?: number; // Minimum loading time in ms
      onStart?: () => void;
      onComplete?: () => void;
      onError?: (error: any) => void;
    }
  ): Promise<T> => {
    const { minDuration = 0, onStart, onComplete, onError } = options || {};

    start();
    onStart?.();

    const startTime = Date.now();

    try {
      const result = await asyncFn();

      if (minDuration) {
        const elapsed = Date.now() - startTime;
        const remaining = minDuration - elapsed;

        if (remaining > 0) {
          await new Promise(resolve => setTimeout(resolve, remaining));
        }
      }

      stop();
      onComplete?.();
      return result;
    } catch (error) {
      stop();
      onError?.(error);
      throw error;
    }
  }, [start, stop]);

  // Wrapper for form submissions
  const withFormLoading = useCallback(
    (onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void> | void) =>
      async (event: React.FormEvent<HTMLFormElement>) => {
        start();
        try {
          await onSubmit(event);
        } finally {
          stop();
        }
      },
    [start, stop]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    start,
    stop,
    withLoading,
    withFormLoading,
  };
};

// Enhanced fetch wrapper with loading bar
export const fetchWithLoading = async <T = any>(
  url: string,
  options?: RequestInit,
  showLoading = true
): Promise<T> => {
  if (showLoading) {
    window.dispatchEvent(new CustomEvent('start-loading'));
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (showLoading) {
      // Small delay to show completion
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('stop-loading'));
      }, 100);
    }

    return data;
  } catch (error) {
    if (showLoading) {
      window.dispatchEvent(new CustomEvent('stop-loading'));
    }
    throw error;
  }
};
