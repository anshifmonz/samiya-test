export default async function retry<T>(
  fn: () => Promise<{ data?: T; error?: any }>,
  retries: number = 3,
  delay: number = 500
): Promise<{ data: T | null; error: any | null }> {
  let lastError: any = null;

  for (let i = 0; i < retries; i++) {
    try {
      const { data, error } = await fn();

      if (error) {
        lastError = error;
        throw error; // triggers retry
      }

      return { data: data, error: null };
    } catch (err) {
      lastError = err;
      if (i < retries - 1) await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return { data: null, error: lastError }; // all retries failed
}
