import { type Category } from 'types/category';

export interface ParsedInput {
  segments: string[];
  currentSegment: string;
  isComplete: boolean;
}

/**
 * Parse the current input to understand the context
 */
export const parseInput = (input: string): ParsedInput => {
  const trimmed = input.trim();
  if (!trimmed) return { segments: [], currentSegment: '', isComplete: false };

  // Check if the input ends with '>' character (with or without spaces)
  // This handles cases like "Men>", "Men >", or "Men > "
  const endsWithSeparator = /\s*>\s*$/.test(input);
  
  if (endsWithSeparator) {
    // Remove the '>' and any trailing/leading spaces, then split
    const cleanInput = input.replace(/\s*>\s*$/, '').trim();
    const segments = cleanInput ? cleanInput.split(' > ').map(s => s.trim()).filter(s => s.length > 0) : [];
    
    return {
      segments,
      currentSegment: '',
      isComplete: true
    };
  }

  // Regular parsing for non-'>' endings
  const segments = trimmed.split(' > ').map(s => s.trim());
  const lastSegment = segments[segments.length - 1];

  return {
    segments: segments.slice(0, -1).filter(s => s.length > 0),
    currentSegment: lastSegment,
    isComplete: false
  };
};

/**
 * Check if a category has subcategories
 */
export const hasSubcategories = (category: Category, categories: Category[]): boolean => {
  return categories.some(cat => cat.parentId === category.id);
};

/**
 * Get the root category from the current path
 */
export const getRootCategoryFromPath = (segments: string[], categories: Category[]): Category | null => {
  if (segments.length === 0) return null;
  const rootName = segments[0];
  return categories.find(cat => 
    cat.level === 0 && 
    cat.name.toLowerCase() === rootName.toLowerCase()
  ) || null;
};

/**
 * Find a category by exact path match
 */
export const findCategoryByPath = (pathSegments: string[], categories: Category[]): Category | null => {
  return categories.find(cat => 
    cat.path.length === pathSegments.length &&
    cat.path.every((segment, index) => 
      segment.toLowerCase() === pathSegments[index]?.toLowerCase()
    )
  ) || null;
};
