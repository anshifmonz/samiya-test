export default async function retry<T>(
  fn: () => Promise<{ data?: T; error?: any }> | Promise<T> | Promise<null | undefined | false>,
  retries: number = 3,
  delay: number = 500
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
        if (!data) throw new Error('No data returned');
        return { data, error: null };
      } else {
        // Otherwise, treat as a single value (could be null/undefined/falsy)
        if (!result) throw new Error('No value returned');
        return { data: result as T, error: null };
      }
    } catch (err) {
      lastError = err;
      if (i < retries - 1) await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return { data: null, error: lastError }; // all retries failed
}
