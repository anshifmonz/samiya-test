import React from 'react';
import { UserPlus } from 'lucide-react';
import AdminTabHeaderButton from '../shared/AdminTabHeaderButton';
import { useAdminsTab } from 'contexts/admin/AdminsTabContext';

const AdminsHeader: React.FC = () => {
  const { handleShowAddForm, currentAdmin } = useAdminsTab();
  return (
    <div className="flex justify-between items-center">
      <h3 className="luxury-heading text-xl text-luxury-black">Manage Admins</h3>
      {currentAdmin?.is_superuser && (
        <AdminTabHeaderButton
          onClick={handleShowAddForm}
          label="Add Admin"
        >
          <UserPlus size={16} />
        </AdminTabHeaderButton>
      )}
    </div>
  );
};

export default AdminsHeader;
