import { UserPlus } from 'lucide-react';
import AdminTabHeaderButton from '../shared/AdminTabHeaderButton';
import { useAdminsTab } from 'contexts/admin/admins/AdminsContext';
import { useCurrentAdmin } from 'contexts/admin/AdminDashboardContext';

const AdminsHeader: React.FC = () => {
  const { handleShowAddForm } = useAdminsTab();
  const { admin } = useCurrentAdmin();

  return (
    <div className="flex justify-between items-center">
      <h3 className="luxury-heading text-xl text-luxury-black">Admin users</h3>
      {admin?.is_superuser && (
        <AdminTabHeaderButton onClick={handleShowAddForm} label="Add Admin">
          <UserPlus size={16} />
        </AdminTabHeaderButton>
      )}
    </div>
  );
};

export default AdminsHeader;
