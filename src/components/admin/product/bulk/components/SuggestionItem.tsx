import React from 'react';
import { ChevronRight } from 'lucide-react';
import { type CategorySuggestion } from '../hooks/useCategorySuggestions';

interface SuggestionItemProps {
  suggestion: CategorySuggestion;
  isHighlighted: boolean;
  hasChildren: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onClick: () => void;
}

/**
 * Individual suggestion item component
 */
export const SuggestionItem: React.FC<SuggestionItemProps> = ({
  suggestion,
  isHighlighted,
  hasChildren,
  onMouseDown,
  onClick
}) => {
  const { category, displayText, pathText, isPartialMatch } = suggestion;

  return (
    <li
      className={`px-3 py-2 cursor-pointer flex items-center justify-between hover:bg-luxury-gray/10 ${
        isHighlighted ? 'bg-luxury-gold/10 text-luxury-gold' : 'text-luxury-black'
      }`}
      onMouseDown={onMouseDown}
      onClick={onClick}
    >
      <div className="flex-1">
        <div className="font-medium">{displayText}</div>
        {isPartialMatch && (
          <div className="text-xs text-luxury-gray mt-1">
            {pathText}
          </div>
        )}
      </div>
      {hasChildren && (
        <ChevronRight className="h-3 w-3 text-luxury-gray ml-2" />
      )}
    </li>
  );
};
