import React from 'react';
import { type Category } from '@/types/category';
import { CategoryTree, EmptyState } from './grid';

interface AdminCategoryGridProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  isSuperAdmin: boolean;
}

const AdminCategoryGrid: React.FC<AdminCategoryGridProps> = ({
  categories,
  onEdit,
  onDelete,
  isSuperAdmin
}) => {
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set());

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Build the tree structure for display
  const rootCategories = categories.filter(c => !c.parentId);
  const sortedCategories = [...rootCategories].sort((a, b) => a.name.localeCompare(b.name));

  if (categories.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <CategoryTree
        categories={categories}
        categoryList={sortedCategories}
        level={0}
        expandedCategories={expandedCategories}
        onToggleExpanded={toggleExpanded}
        onEdit={onEdit}
        onDelete={onDelete}
        isSuperAdmin={isSuperAdmin}
      />
    </div>
  );
};

export default AdminCategoryGrid;
