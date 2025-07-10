import React, { useState } from 'react';
import AdminSearchBar from '../AdminSearchBar';
import AdminCategoryGrid from './AdminCategoryGrid';
import AdminCategoryForm from './AdminCategoryForm';
import AdminTabHeader from '../shared/AdminTabHeader';
import { Plus } from 'lucide-react';
import { type Category } from '@/types/category';

interface AdminCategoriesTabProps {
  categories: Category[];
  onAddCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
}

const AdminCategoriesTab: React.FC<AdminCategoriesTabProps> = ({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    category.path.some(pathSegment => pathSegment.toLowerCase().includes(searchQuery.toLowerCase())) ||
    category.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCategory = (newCategory: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    onAddCategory(newCategory);
    setShowAddForm(false);
  };

  const handleEditCategory = (updatedCategoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingCategory) {
      const updatedCategory: Category = {
        ...updatedCategoryData,
        id: editingCategory.id,
        createdAt: editingCategory.createdAt,
        updatedAt: new Date().toISOString()
      };
      onEditCategory(updatedCategory);
      setEditingCategory(null);
    }
  };

  return (
    <div>
      <AdminTabHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={() => setShowAddForm(true)}
        addLabel="Add Category"
      >
        <Plus size={20} />
      </AdminTabHeader>

      <div className="mb-6">
        <p className="luxury-subheading text-luxury-gold text-sm tracking-wider">
          {filteredCategories.length} categor{filteredCategories.length !== 1 ? 'ies' : 'y'} found
        </p>
      </div>

      <AdminCategoryGrid
        categories={filteredCategories}
        onEdit={setEditingCategory}
        onDelete={onDeleteCategory}
      />

      {(showAddForm || editingCategory) && (
        <AdminCategoryForm
          category={editingCategory}
          categories={categories}
          onSave={editingCategory ? handleEditCategory : handleAddCategory}
          onCancel={() => {
            setShowAddForm(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminCategoriesTab;
