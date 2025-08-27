type RetryResult<T> = { data?: T; error?: any } | T | null | undefined | false;

export default async function retry<T>(
  fn: () => Promise<RetryResult<T>>,
  retries: number = 3,
  delay: number = 500,
  maxDelay: number = 7000
): Promise<{ data: T | null; error: any | null }> {
  let lastError: any = null;

  for (let i = 0; i < retries; i++) {
    try {
      const result = await fn();
      // If result is an object with data/error keys
      if (result && typeof result === 'object' && ('data' in result || 'error' in result)) {
        const { data, error } = result as { data?: T; error?: any };
        if (error) {
          lastError = error;
          throw error; // triggers retry
        }
        return { data, error: null };
      } else {
        // Otherwise, treat as a single value (could be null/undefined/falsy)
        return { data: result as T, error: null };
      }
    } catch (err) {
      lastError = err;
      if (i < retries - 1) {
        const wait = Math.min(delay * 2 ** i, maxDelay);
        await new Promise(res => setTimeout(res, wait));
      }
    }
  }

  return { data: null, error: lastError }; // all retries failed
}
