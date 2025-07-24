'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Custom hook for syncing a state value with URL search parameters
 * @param paramName - The URL parameter name
 * @param defaultValue - The default value when parameter is not present
 * @returns [value, setValue] - The current value and a function to update it
 */
export function useUrlParam(paramName: string, defaultValue: string): [string, (value: string) => void] {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [value, setValue] = useState<string>(() => {
    const urlValue = searchParams?.get(paramName);
    return urlValue || defaultValue;
  });

  useEffect(() => {
    const urlValue = searchParams?.get(paramName);
    setValue(urlValue || defaultValue);
  }, [searchParams, paramName, defaultValue]);

  const updateValue = useCallback((newValue: string) => {
    setValue(newValue);

    const current = new URLSearchParams(Array.from(searchParams?.entries() || []));

    if (newValue === defaultValue) {
      current.delete(paramName);
    } else {
      current.set(paramName, newValue);
    }

    const search = current.toString();
    const query = search ? `?${search}` : '';

    router.replace(`${window.location.pathname}${query}`, { scroll: false });
  }, [router, searchParams, paramName, defaultValue]);

  return [value, updateValue];
}
