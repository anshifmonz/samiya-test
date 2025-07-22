import { useState, useEffect } from 'react';
import { type Size } from 'types/product';
import { apiRequest } from 'lib/utils/apiRequest';

export const useSizes = () => {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: apiError } = await apiRequest('/api/admin/sizes');

        if (apiError) {
          throw new Error(apiError);
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
