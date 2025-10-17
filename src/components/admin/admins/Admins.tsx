'use client';

import { createPortal } from 'react-dom';
import { AdminsHeader, AdminsStats, AdminsTable, AddAdminModal, EditAdminModal } from './index';
import { AdminUser } from 'types/admin';
import { AdminDashboardProvider } from 'contexts/admin/AdminDashboardContext';
import { AdminsTabProvider, useAdminsTab } from 'contexts/admin/admins/AdminsContext';

const AdminsContent: React.FC = () => {
  const { mounted } = useAdminsTab();

  return (
    <div className="container max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 pt-24">
      <h1 className="text-3xl font-bold text-foreground mb-8">Manage Admins</h1>
      <div>
        <AdminsHeader />
        <AdminsStats />
        <AdminsTable />
      </div>
      {mounted && createPortal(<AddAdminModal />, document.body)}
      {mounted && createPortal(<EditAdminModal />, document.body)}
    </div>
  );
};

const AdminAdminsTab: React.FC<{ initialAdmins: AdminUser[] }> = ({ initialAdmins }) => {
  return (
    <AdminDashboardProvider>
      <AdminsTabProvider initialAdmins={initialAdmins}>
        <AdminsContent />
      </AdminsTabProvider>
    </AdminDashboardProvider>
  );
};
export default AdminAdminsTab;
