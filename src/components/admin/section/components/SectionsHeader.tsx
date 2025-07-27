import { Plus } from 'lucide-react';
import AdminTabHeaderButton from '../../shared/AdminTabHeaderButton';
import { useSectionsTab } from 'contexts/admin/SectionsTabContext';

const SectionsHeader: React.FC = () => {
  const { openAddSection } = useSectionsTab();
  return (
    <div className="flex justify-between items-center">
      <h3 className="luxury-heading text-xl text-luxury-black">Manage Sections</h3>
      <AdminTabHeaderButton
        onClick={openAddSection}
        label="Add Section"
      >
        <Plus size={16} />
      </AdminTabHeaderButton>
    </div>
  );
};

export default SectionsHeader;
