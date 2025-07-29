import { useState, useEffect } from 'react';
import { type Size } from 'types/product';

export const useSizes = () => {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/public/sizes');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch sizes');
        }

        setSizes(data.sizes || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch sizes');
      } finally {
        setLoading(false);
      }
    };

    fetchSizes();
  }, []);

  return { sizes, loading, error };
};
