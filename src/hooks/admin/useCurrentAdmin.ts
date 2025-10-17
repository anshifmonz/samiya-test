import { useState, useEffect } from 'react';
import { AdminUser } from 'types/admin';
import { apiRequest } from 'utils/apiRequest';

interface UseCurrentAdminReturn {
  admin: AdminUser | null;
  isLoading: boolean;
  error: string | null;
  isSuperAdmin: boolean;
}

export function useCurrentAdmin(): UseCurrentAdminReturn {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdmin = async (): Promise<void> => {
      try {
        const res = await apiRequest('/api/admin/me', { showLoadingBar: true });
        if (!res.error && res.data?.admin) {
          setAdmin(res.data.admin);
        } else {
          setError(res.error || 'Failed to fetch admin data');
        }
      } catch (err) {
        setError('Network error while fetching admin data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  return {
    admin,
    isLoading,
    error,
    isSuperAdmin: admin?.is_superuser || false
  };
}
