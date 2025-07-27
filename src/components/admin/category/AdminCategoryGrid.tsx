import React from 'react';
import { CategoryTree, EmptyState } from './grid';
import { useCategoriesTab } from 'contexts/admin/CategoriesTabContext';

const AdminCategoryGrid: React.FC = () => {
  const {
    filteredCategories: categories
  } = useCategoriesTab();
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
        categoryList={sortedCategories}
        level={0}
        expandedCategories={expandedCategories}
        onToggleExpanded={toggleExpanded}
      />
    </div>
  );
};

export default AdminCategoryGrid;
