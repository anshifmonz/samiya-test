import { useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for debouncing function calls
 * @param callback - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns A debounced version of the callback with cleanup
 */
export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T & { cleanup: () => void } {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Use ref to store the latest callback to avoid recreating the debounced function
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
        timeoutRef.current = null;
      }, delay);
    },
    [delay] // Only depend on delay, not callback
  ) as T;

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Return debounced callback with cleanup
  return Object.assign(debouncedCallback, { cleanup });
}
