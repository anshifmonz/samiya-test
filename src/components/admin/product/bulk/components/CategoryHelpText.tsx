import React from 'react';
import { type Category } from 'types/category';
import { type CategorySuggestion } from '../hooks/useCategorySuggestions';
import { parseInput, getRootCategoryFromPath, hasSubcategories } from '../utils/categoryParser';

interface CategoryHelpTextProps {
  value: string;
  suggestions: CategorySuggestion[];
  categories: Category[];
}

/**
 * Dynamic help text component that provides contextual guidance
 */
export const CategoryHelpText: React.FC<CategoryHelpTextProps> = ({
  value,
  suggestions,
  categories
}) => {
  const getHelpText = (): string => {
    const endsWithSeparator = /\s*>\s*$/.test(value);
    if (endsWithSeparator) {
      const { segments } = parseInput(value);
      if (segments.length === 1) {
        return `Showing all subcategories for "${segments[0]}" • Select one or type to filter`;
      } else if (segments.length > 1) {
        return `Showing subcategories for "${segments.join(' > ')}" • Select one or type to filter`;
      }
      return 'Showing all root categories • Select one to continue';
    }
    
    const { segments } = parseInput(value);
    const rootCategory = getRootCategoryFromPath(segments, categories);
    
    if (rootCategory && segments.length > 0) {
      const hasSelectedWithChildren = suggestions.some(s => 
        s.category.name.toLowerCase() === value.split(' > ').pop()?.toLowerCase() && 
        hasSubcategories(s.category, categories)
      );
      if (hasSelectedWithChildren) {
        return `In ${rootCategory.name} • Type ">" to see ALL subcategories, or Tab/Enter to select`;
      }
      return `Showing ${rootCategory.name} categories • Type ">" for subcategories • Tab/Enter to save`;
    }
    
    return 'Select a root category • Type ">" after selection to see all subcategories • Tab/Enter to save';
  };

  return (
    <div className="border-t border-luxury-gray/10 px-3 py-2 text-xs text-luxury-gray bg-luxury-gray/5">
      {getHelpText()}
    </div>
  );
};
