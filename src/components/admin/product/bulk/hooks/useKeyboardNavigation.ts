import { useCallback } from 'react';
import { type CategorySuggestion } from './useCategorySuggestions';

interface UseKeyboardNavigationProps {
  isOpen: boolean;
  suggestions: CategorySuggestion[];
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  setIsOpen: (open: boolean) => void;
  onSuggestionSelect: (suggestion: CategorySuggestion) => void;
}

/**
 * Hook to handle keyboard navigation in the category autocomplete
 */
export const useKeyboardNavigation = ({
  isOpen,
  suggestions,
  highlightedIndex,
  setHighlightedIndex,
  setIsOpen,
  onSuggestionSelect
}: UseKeyboardNavigationProps) => {
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(
          highlightedIndex < suggestions.length - 1 ? highlightedIndex + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(
          highlightedIndex > 0 ? highlightedIndex - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          onSuggestionSelect(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(0);
        break;
      case 'Tab':
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          e.preventDefault();
          onSuggestionSelect(suggestions[highlightedIndex]);
        }
        break;
    }
  }, [isOpen, suggestions, highlightedIndex, setHighlightedIndex, setIsOpen, onSuggestionSelect]);

  return { handleKeyDown };
};
