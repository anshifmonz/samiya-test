import { useState, useEffect } from 'react';

interface AdminUser {
  id: string;
  username: string;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}

interface UseCurrentAdminReturn {
  admin: AdminUser | null;
  isLoading: boolean;
  error: string | null;
  isSuperAdmin: boolean;
}

export function useCurrentAdmin(): UseCurrentAdminReturn {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await fetch('/api/admin/me');
        const data = await response.json();

        if (response.ok && data.admin) {
          setAdmin(data.admin);
        } else {
          setError(data.error || 'Failed to fetch admin data');
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
