import React, { useState, useRef, useEffect } from 'react';
import { type Category } from '@/types/category';
import { ChevronDown, Check, ChevronRight } from 'lucide-react';
import { buildCategoryTree } from '@/lib/utils/buildCategoryTree';
import { useAdminProductFormCategory } from './AdminProductFormContext';

const CategorySelect: React.FC = () => {
  const { categories, categoryId, handleCategoryChange } = useAdminProductFormCategory();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getSelectedDisplayName = () => {
    if (!categoryId) return "Select a category";
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Select a category";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categoryTree = buildCategoryTree(categories);

  const renderCategoryTree = (categoryList: Category[], level: number = 0) => {
    return categoryList.map((category, index) => {
      const indent = level * 20;
      const hasChildren = category.children && category.children.length > 0;

      return (
        <div key={category.id} className="relative">
          {level > 0 && (
            <div
              className="absolute left-0 top-0 w-px bg-luxury-gray/30"
              style={{
                height: '100%',
                left: `${indent - 8}px`
              }}
            />
          )}

          <div
            className={`px-4 py-2 cursor-pointer hover:bg-luxury-gold/10 transition-colors duration-200 relative ${
              categoryId === category.id ? 'bg-luxury-gold/20 text-luxury-gold' : 'text-luxury-black'
            }`}
            style={{ paddingLeft: `${indent + 16}px` }}
            onClick={() => {
              handleCategoryChange(category.id);
              setIsOpen(false);
            }}
          >
            {level > 0 && (
              <div
                className="absolute top-1/2 w-2 h-px bg-luxury-gray/30"
                style={{
                  left: `${indent - 4}px`,
                  transform: 'translateY(-50%)'
                }}
              />
            )}

            {level > 0 && (
              <div
                className="absolute top-1/2 w-2 h-2 border-l border-b border-luxury-gray/30"
                style={{
                  left: `${indent - 8}px`,
                  transform: 'translateY(-50%)'
                }}
              />
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {level === 0 && (
                  <div className="w-2 h-2 rounded-full bg-luxury-gold/60" />
                )}
                {level > 0 && hasChildren && (
                  <ChevronRight className="w-3 h-3 text-luxury-gray/60" />
                )}
                {level > 0 && !hasChildren && (
                  <div className="w-1.5 h-1.5 rounded-full bg-luxury-gray/40" />
                )}

                <span className="luxury-body text-sm">{category.name}</span>
              </div>

              {categoryId === category.id && (
                <Check className="w-4 h-4 text-luxury-gold" />
              )}
            </div>
          </div>

          {/* render children recursively */}
          {hasChildren && (
            <div className="relative">
              {renderCategoryTree(category.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block luxury-subheading text-sm text-luxury-black mb-2">
        Category
      </label>

      {/* custom select button */}
      <div
        className="w-full px-4 py-3 luxury-body text-sm rounded-xl bg-luxury-cream/50 text-luxury-black border border-luxury-gray/20 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:border-luxury-gold/30 transition-all duration-300 cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={categoryId ? 'text-luxury-black' : 'text-luxury-gray'}>
          {getSelectedDisplayName()}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* custom dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-luxury-gray/20 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {renderCategoryTree(categoryTree)}
        </div>
      )}
    </div>
  );
};

export default CategorySelect;
