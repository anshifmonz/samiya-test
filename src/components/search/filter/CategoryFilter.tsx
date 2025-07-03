import React, { useState } from 'react';
import { type Category } from '@/types/category';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { buildCategoryTree } from '@/lib/utils/buildCategoryTree';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  availableCategories?: string[];
  categories: Category[];
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onCategoryChange, availableCategories, categories }) => {
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

  // recursive function to render category tree
  const renderCategoryTree = (categoryList: Category[], level: number = 0) => {
    return categoryList.map((category) => {
      const hasChildren = category.children && category.children.length > 0;
      const isExpanded = expandedCategories.has(category.id);
      const indent = level * 16;

      return (
        <div key={category.id}>
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            style={{ paddingLeft: `${indent}px` }}
            onClick={() => handleCategoryClick(category.name)}
          >
            {/* expand/collapse button for categories with children */}
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent category selection when clicking expand button
                  toggleExpanded(category.id);
                }}
                className="p-1 hover:bg-luxury-gray/10 rounded transition-colors w-6 h-6 flex items-center justify-center"
              >
                {isExpanded ? (
                  <ChevronDown size={14} className="text-luxury-gold" />
                ) : (
                  <ChevronRight size={14} className="text-luxury-gold" />
                )}
              </button>
            ) : (
              // placeholder div to maintain consistent spacing
              <div className="w-6 h-6" />
            )}

            <input
              type="radio"
              name="category"
              value={category.name}
              checked={selectedCategory === category.name}
              onChange={() => handleCategoryClick(category.name)}
              onClick={(e) => e.stopPropagation()} // prevent double triggering
              className="w-4 h-4 text-luxury-gold border-2 border-luxury-gray/30 focus:ring-luxury-gold/50 focus:ring-2 transition-all duration-200"
            />

            <span className="luxury-body text-luxury-gray font-medium capitalize group-hover:text-luxury-gold transition-colors duration-200">
              {category.name}
            </span>
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
    <div>
      <h3 className="luxury-subheading text-luxury-black mb-4 tracking-wider">Category</h3>
      <div className="space-y-3">
        <label
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => handleCategoryClick('all')}
        >
          <input
            type="radio"
            name="category"
            value="all"
            checked={selectedCategory === 'all'}
            onChange={() => handleCategoryClick('all')}
            onClick={(e) => e.stopPropagation()} // prevent double triggering
            className="w-4 h-4 text-luxury-gold border-2 border-luxury-gray/30 focus:ring-luxury-gold/50 focus:ring-2 transition-all duration-200"
          />
          <span className="luxury-body text-luxury-gray font-medium capitalize group-hover:text-luxury-gold transition-colors duration-200">
            All Categories
          </span>
        </label>

        {/* dynamic categories with expandable hierarchy */}
        {renderCategoryTree(categoryTree)}
      </div>
    </div>
  );
};

export default CategoryFilter;
