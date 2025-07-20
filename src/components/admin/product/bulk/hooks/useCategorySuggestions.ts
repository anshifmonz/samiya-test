import { useMemo } from 'react';
import { type Category } from 'types/category';
import { 
  parseInput, 
  getRootCategoryFromPath, 
  findCategoryByPath 
} from '../utils/categoryParser';

export interface CategorySuggestion {
  category: Category;
  displayText: string;
  pathText: string;
  isPartialMatch?: boolean;
}

/**
 * Hook to generate category suggestions based on current input
 */
export const useCategorySuggestions = (value: string, categories: Category[]): CategorySuggestion[] => {
  return useMemo((): CategorySuggestion[] => {
    if (!value) {
      // Show root categories when input is empty
      return categories
        .filter(cat => cat.level === 0)
        .map(cat => ({
          category: cat,
          displayText: cat.name,
          pathText: cat.path.join(' > ')
        }));
    }

    const { segments, currentSegment, isComplete } = parseInput(value);
    
    // Determine the root category context
    const rootCategory = getRootCategoryFromPath(segments, categories);
    
    if (isComplete) {
      // User has typed a complete path and wants subcategories (e.g., "Men >", "Women >", "Men > Pants >")
      // Show ALL subcategories under the selected parent without any filtering
      const parentPath = segments;
      
      if (parentPath.length === 0) {
        // Edge case: just ">" was typed - show root categories
        return categories
          .filter(cat => cat.level === 0)
          .map(cat => ({
            category: cat,
            displayText: cat.name,
            pathText: cat.path.join(' > ')
          }));
      }
      
      // Find the parent category using exact path match
      const parentCategory = findCategoryByPath(parentPath, categories);
      
      if (parentCategory) {
        // Show ALL direct children (subcategories) of this parent category
        const children = categories
          .filter(cat => cat.parentId === parentCategory.id)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(cat => ({
            category: cat,
            displayText: cat.name,
            pathText: cat.path.join(' > ')
          }));
        
        return children;
      }
      
      // If no matching parent found, return empty array
      return [];
    } else if (segments.length === 0) {
      // Root level search - show all root categories that match
      return categories
        .filter(cat => 
          cat.level === 0 && 
          cat.name.toLowerCase().includes(currentSegment.toLowerCase())
        )
        .map(cat => ({
          category: cat,
          displayText: cat.name,
          pathText: cat.path.join(' > ')
        }));
    } else if (segments.length === 1 && !isComplete) {
      // First level after root - show only subcategories of the selected root
      // This handles cases like "Men P" (typing after root category without >)
      if (rootCategory) {
        // If we have a valid root category, show its children that match
        return categories
          .filter(cat => 
            cat.parentId === rootCategory.id &&
            cat.name.toLowerCase().includes(currentSegment.toLowerCase())
          )
          .sort((a, b) => a.name.localeCompare(b.name)) // Sort for consistency
          .map(cat => ({
            category: cat,
            displayText: cat.name,
            pathText: cat.path.join(' > ')
          }));
      } else {
        // If the root category doesn't exist, show matching root categories
        const firstSegment = segments[0];
        return categories
          .filter(cat => 
            cat.level === 0 && 
            cat.name.toLowerCase().includes(firstSegment.toLowerCase())
          )
          .map(cat => ({
            category: cat,
            displayText: cat.name,
            pathText: cat.path.join(' > ')
          }));
      }
    } else {
      // Deep level search - find categories within the root category context
      // This handles cases like "Men > P" or "Men > Pants > T"
      if (rootCategory) {
        const parentPath = segments;
        const matchingParent = categories.find(cat => 
          cat.path.length === parentPath.length &&
          cat.path.every((segment, index) => 
            segment.toLowerCase() === parentPath[index]?.toLowerCase()
          )
        );

        if (matchingParent) {
          // Find children that match the current typed segment within the same root
          return categories
            .filter(cat => 
              cat.parentId === matchingParent.id &&
              cat.path[0] === rootCategory.name && // Ensure same root category
              cat.name.toLowerCase().includes(currentSegment.toLowerCase())
            )
            .sort((a, b) => a.name.localeCompare(b.name)) // Sort for consistency
            .map(cat => ({
              category: cat,
              displayText: cat.name,
              pathText: cat.path.join(' > ')
            }));
        }
        
        // If no matching parent found in deep search, return empty array
        return [];
      }
      
      // If no root category context, return empty array
      return [];
    }
  }, [value, categories]);
};
