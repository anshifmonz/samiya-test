import React, { useState } from 'react';
import { type Category } from 'types/category';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Checkbox } from 'ui/checkbox';
import { buildCategoryTree } from 'lib/utils/buildCategoryTree';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  availableCategories?: string[];
  categories: Category[];
  categoryCountMap?: Map<string, number>;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onCategoryChange, availableCategories, categories, categoryCountMap }) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // filter categories to only include those that are available in search results
  const filteredCategories = availableCategories && availableCategories.length > 0
    ? categories.filter(category => availableCategories.includes(category.name))
    : categories;

  // build hierarchical tree
  const categoryTree = buildCategoryTree(filteredCategories);

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCategoryClick = (categoryName: string) => {
    onCategoryChange(categoryName);
  };

    // Helper function to count available products in a category and its subcategories
  const countAvailableProductsInCategory = (category: Category): number => {
    let count = 0;

    // Count products in this category
    if (categoryCountMap && categoryCountMap.has(category.name)) {
      count += categoryCountMap.get(category.name) || 0;
    }

    // Recursively count children
    if (category.children) {
      category.children.forEach(child => {
        count += countAvailableProductsInCategory(child);
      });
    }

    return count;
  };

  // recursive function to render category tree
  const renderCategoryTree = (categoryList: Category[], level: number = 0) => {
    return categoryList.map((category) => {
      const hasChildren = category.children && category.children.length > 0;
      const isExpanded = expandedCategories.has(category.id);
      const indent = level > 0 ? level * 16 : 0;
      const productCount = countAvailableProductsInCategory(category);

      return (
        <div key={category.id}>
          <div
            className="flex items-center space-x-2"
            style={{ paddingLeft: `${indent}px` }}
          >
            {/* expand/collapse button for categories with children */}
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded(category.id);
                }}
                className="p-1 hover:bg-muted rounded transition-colors w-6 h-6 flex items-center justify-center"
              >
                {isExpanded ? (
                  <ChevronDown size={14} className="text-primary" />
                ) : (
                  <ChevronRight size={14} className="text-primary" />
                )}
              </button>
            ) : (
              level > 0 && <div className="w-6 h-6" />
            )}

            <Checkbox
              id={category.id}
              checked={selectedCategory === category.name}
              onCheckedChange={() => handleCategoryClick(category.name)}
            />

            <label
              htmlFor={category.id}
              className="text-sm font-normal cursor-pointer flex-1 flex justify-between"
            >
              <span>{category.name}</span>
              <span className="text-muted-foreground">({productCount})</span>
            </label>
          </div>

          {/* render children recursively when expanded */}
          {hasChildren && isExpanded && (
            <div className="mt-2">
              {renderCategoryTree(category.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-foreground">Categories</h3>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="all-categories"
            checked={selectedCategory === 'all'}
            onCheckedChange={() => handleCategoryClick('all')}
          />
          <label
            htmlFor="all-categories"
            className="text-sm font-normal cursor-pointer flex-1 flex justify-between"
          >
            <span>All Categories</span>
            <span className="text-muted-foreground">({categories.length})</span>
          </label>
        </div>

        {/* dynamic categories with expandable hierarchy */}
        {renderCategoryTree(categoryTree)}
      </div>
    </div>
  );
};

export default CategoryFilter;
