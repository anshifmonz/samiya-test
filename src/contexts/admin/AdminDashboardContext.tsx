'use client';

import React, { createContext, useContext } from 'react';
import { useCurrentAdmin as Admin } from 'hooks/admin/useCurrentAdmin';

interface AdminDashboardContextType {
  admin: any;
  isLoading: boolean;
  error: string | null;
  isSuperAdmin: boolean;
}

const AdminDashboardContext = createContext<AdminDashboardContextType | undefined>(undefined);

export const AdminDashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const { admin, isLoading, error, isSuperAdmin } = Admin();
  return (
    <AdminDashboardContext.Provider value={{ admin, isLoading, error, isSuperAdmin }}>
      {children}
    </AdminDashboardContext.Provider>
  );
};

export const useCurrentAdmin = () => {
  const context = useContext(AdminDashboardContext);
  if (!context)
    throw new Error('useAdminDashboardContext must be used within an AdminDashboardProvider');
  return context;
};
