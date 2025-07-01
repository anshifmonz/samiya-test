import React from 'react';
import { type Category } from '@/types/category';
import CategoryCard from './CategoryCard';

interface CategoryTreeProps {
  categories: Category[];
  categoryList: Category[];
  level: number;
  expandedCategories: Set<string>;
  onToggleExpanded: (categoryId: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

const CategoryTree: React.FC<CategoryTreeProps> = ({
  categories,
  categoryList,
  level,
  expandedCategories,
  onToggleExpanded,
  onEdit,
  onDelete
}) => {
  return (
    <>
      {categoryList.map(category => {
        const hasChildren = categories.some(c => c.parentId === category.id);
        const isExpanded = expandedCategories.has(category.id);
        const children = categories.filter(c => c.parentId === category.id);
        const indentationClass = getIndentationClass(category.level);

        return (
          <div key={category.id} className="space-y-2">
            <CategoryCard
              category={category}
              hasChildren={hasChildren}
              isExpanded={isExpanded}
              indentationClass={indentationClass}
              onToggleExpanded={() => onToggleExpanded(category.id)}
              onEdit={onEdit}
              onDelete={onDelete}
            />

            {hasChildren && isExpanded && (
              <div className="mt-2">
                <CategoryTree
                  categories={categories}
                  categoryList={children}
                  level={level + 1}
                  expandedCategories={expandedCategories}
                  onToggleExpanded={onToggleExpanded}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

// helper function for indentation classes
const getIndentationClass = (level: number) => {
  const indentationMap: { [key: number]: string } = {
    0: '', // root lvl - no indentation
    1: 'ml-6', // lvl 1 - 24px
    2: 'ml-12', // lvl 2 - 48px
    3: 'ml-16', // lvl 3 - 64px
    4: 'ml-20', // lvl 4 - 80px
    5: 'ml-24', // lvl 5 - 96px
  };

  // for levels beyond 5, use a calculated value
  if (level > 5) {
    return `ml-[${(level * 24)}px]`;
  }

  // check if the level exists in the map, otherwise use the max level
  return level in indentationMap ? indentationMap[level] : indentationMap[5];
};

export default CategoryTree;
