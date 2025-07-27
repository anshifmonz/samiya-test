import AdminCategoryGrid from './AdminCategoryGrid';
import AdminCategoryForm from './AdminCategoryForm';
import AdminTabHeader from '../shared/AdminTabHeader';
import { Plus } from 'lucide-react';
import { useCategoriesTab } from 'contexts/admin/CategoriesTabContext';

const AdminCategoriesTab: React.FC = () => {
  const {
    searchQuery,
    handleSearchChange,
    handleShowAddForm,
    isFormVisible,
    categoriesCountText
  } = useCategoriesTab();

  return (
    <div>
      <AdminTabHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onAddClick={handleShowAddForm}
        addLabel="Add Category"
      >
        <Plus size={20} />
      </AdminTabHeader>

      <div className="mb-6">
        <p className="luxury-subheading text-luxury-gold text-sm tracking-wider">
          {categoriesCountText}
        </p>
      </div>

      <AdminCategoryGrid />
      {isFormVisible && <AdminCategoryForm />}
    </div>
  );
};

export default AdminCategoriesTab;
