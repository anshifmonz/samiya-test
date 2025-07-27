import { createContext, useContext } from 'react';
import { useAdminAdminsTab } from 'hooks/admin/user/useAdminAdminsTab';
import { type AdminUser } from 'types/admin';
import { ConfirmationDialog } from 'ui/confirmation-dialog';

interface AdminsTabProviderProps {
  children: React.ReactNode;
}

interface AdminsTabContextType {
  // State
  admins: AdminUser[];
  loading: boolean;
  error: string;
  mounted: boolean;

  // Add dialog state
  showAddDialog: boolean;
  addUsername: string;
  addPassword: string;
  addError: string;
  addLoading: boolean;

  // Edit dialog state
  editDialog: AdminUser | null;
  editUsername: string;
  editPassword: string;
  editSuper: boolean;
  editError: string;
  editLoading: boolean;

  // Delete state
  deleteLoading: string | null;

  // Computed values
  filteredAdmins: AdminUser[];
  adminsCountText: string;

  // Event handlers
  handleAddAdmin: (e: React.FormEvent) => Promise<void>;
  handleDelete: (admin: AdminUser) => Promise<void>;
  handleEditAdmin: (e: React.FormEvent) => Promise<void>;
  openEditDialog: (admin: AdminUser) => void;
  handleShowAddForm: () => void;
  handleCancelAddForm: () => void;
  handleCancelEditForm: () => void;

  // Form setters
  setAddUsername: React.Dispatch<React.SetStateAction<string>>;
  setAddPassword: React.Dispatch<React.SetStateAction<string>>;
  setEditUsername: React.Dispatch<React.SetStateAction<string>>;
  setEditPassword: React.Dispatch<React.SetStateAction<string>>;
  setEditSuper: React.Dispatch<React.SetStateAction<boolean>>;

  // Confirmation dialog
  confirmation: any;
}

const AdminsTabContext = createContext<AdminsTabContextType | undefined>(undefined);

export const AdminsTabProvider = ({ children }: AdminsTabProviderProps) => {
  const adminAdminsTab = useAdminAdminsTab();

  return (
    <AdminsTabContext.Provider value={adminAdminsTab}>
      {children}
      {adminAdminsTab.confirmation && (
        <ConfirmationDialog
          isOpen={adminAdminsTab.confirmation.isOpen}
          onClose={adminAdminsTab.confirmation.hideConfirmation}
          onConfirm={adminAdminsTab.confirmation.onConfirm || (() => {})}
          title={adminAdminsTab.confirmation.title}
          message={adminAdminsTab.confirmation.message}
          confirmText={adminAdminsTab.confirmation.confirmText}
          cancelText={adminAdminsTab.confirmation.cancelText}
          variant={adminAdminsTab.confirmation.variant}
          isLoading={adminAdminsTab.confirmation.isLoading}
        />
      )}
    </AdminsTabContext.Provider>
  );
};

export const useAdminsTab = () => {
  const context = useContext(AdminsTabContext);
  if (!context) throw new Error('useAdminsTab must be used within an AdminsTabProvider');
  return context;
};
