import React from 'react';
import { UserPlus } from 'lucide-react';
import AdminTabHeaderButton from '../shared/AdminTabHeaderButton';
import { AdminUser } from 'types/admin';

interface AdminsHeaderProps {
  onAddClick: () => void;
  currentAdmin?: AdminUser | null;
}

const AdminsHeader: React.FC<AdminsHeaderProps> = ({
  onAddClick,
  currentAdmin,
}) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="luxury-heading text-xl text-luxury-black">Manage Admins</h3>
      {currentAdmin?.is_superuser && (
        <AdminTabHeaderButton
          onClick={onAddClick}
          label="Add Admin"
        >
          <UserPlus size={16} />
        </AdminTabHeaderButton>
      )}
    </div>
  );
};

export default AdminsHeader;
