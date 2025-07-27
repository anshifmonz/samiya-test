import React from 'react';
import { useCategoriesTab } from 'contexts/admin/CategoriesTabContext';

interface CategoryPathPreviewProps {
  parentId: string;
  categoryName: string;
}

const CategoryPathPreview: React.FC<CategoryPathPreviewProps> = ({
  parentId,
  categoryName
}) => {
  const { categoryList: categories } = useCategoriesTab();
  if (!parentId || parentId === 'none') {
    return null;
  }

  const parent = categories.find(c => c.id === parentId);
  const path = parent ? [...parent.path, categoryName].join(' → ') : categoryName;

  return (
    <div className="bg-luxury-gray/5 p-4 rounded-xl border border-luxury-gray/10">
      <h4 className="luxury-subheading text-sm text-luxury-black mb-2">
        Category Path Preview
      </h4>
      <p className="luxury-body text-sm text-luxury-gray">
        {path}
      </p>
    </div>
  );
};

export default CategoryPathPreview;
