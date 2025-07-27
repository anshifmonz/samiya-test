import { Plus } from 'lucide-react';
import AdminCollectionGrid from './AdminCollectionGrid';
import AdminCollectionForm from './AdminCollectionForm';
import AdminTabHeader from '../shared/AdminTabHeader';
import { useCollectionsTab } from 'contexts/admin/CollectionsTabContext';

const AdminCollectionsTab: React.FC = () => {
  const {
    searchQuery,
    handleSearchChange,
    handleShowAddForm,
    isFormVisible,
    collectionsCountText,
  } = useCollectionsTab();

  return (
    <div>
      <AdminTabHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onAddClick={handleShowAddForm}
        addLabel="Add Collection"
      >
        <Plus size={20} />
      </AdminTabHeader>

      <div className="mb-6">
        <p className="luxury-subheading text-luxury-gold text-sm tracking-wider">
          {collectionsCountText}
        </p>
      </div>

      <AdminCollectionGrid />

      {isFormVisible && (
        <AdminCollectionForm />
      )}
    </div>
  );
};

export default AdminCollectionsTab;
