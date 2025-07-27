import { createPortal } from 'react-dom';
import { useAdminsTab } from 'contexts/admin/AdminsTabContext';
import {
  AdminsHeader,
  AdminsStats,
  AdminsTable,
  AddAdminModal,
  EditAdminModal,
} from './index';

const AdminAdminsTab: React.FC = () => {
  const { mounted } = useAdminsTab();

  return (
    <>
      <div>
        <AdminsHeader />
        <AdminsStats />
        <AdminsTable />
      </div>
      {mounted && createPortal(
        <AddAdminModal />,
        document.body
      )}
      {mounted && createPortal(
        <EditAdminModal />,
        document.body
      )}
    </>
  );
};

export default AdminAdminsTab;
