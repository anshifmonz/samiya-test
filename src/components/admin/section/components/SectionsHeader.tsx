import React from 'react';
import { Plus } from 'lucide-react';
import AdminTabHeaderButton from '../../shared/AdminTabHeaderButton';

interface SectionsHeaderProps {
  onAddSection: () => void;
}

const SectionsHeader: React.FC<SectionsHeaderProps> = ({ onAddSection }) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="luxury-heading text-xl text-luxury-black">Manage Sections</h3>
      <AdminTabHeaderButton
        onClick={onAddSection}
        label="Add Section"
      >
        <Plus size={16} />
      </AdminTabHeaderButton>
    </div>
  );
};

export default SectionsHeader;
