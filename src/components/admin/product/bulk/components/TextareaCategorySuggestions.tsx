import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useCategorySuggestions } from '../hooks/useCategorySuggestions';
import { SuggestionsDropdown } from './SuggestionsDropdown';
import { useBulkImportState, useBulkImportConfig, useBulkImportCursor, useBulkImportRefs, useBulkImportActions } from '../context';

interface SuggestionPosition {
  top: number;
  left: number;
  categoryText: string;
  startPos: number;
  endPos: number;
}

// Component that provides inline category suggestions in the textarea
export const TextareaCategorySuggestions: React.FC = () => {
  const { pastedData: value } = useBulkImportState();
  const { categories, expectedHeaders } = useBulkImportConfig();
  const { position: cursorPosition } = useBulkImportCursor();
  const { textarea: textareaRef } = useBulkImportRefs();
  const { handleSuggestionSelect: onSuggestionSelect } = useBulkImportActions();
  const [suggestionPosition, setSuggestionPosition] = useState<SuggestionPosition | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  // Find category column index
  const categoryColumnIndex = useMemo(() => {
    return expectedHeaders.findIndex(header => header.toLowerCase() === 'category');
  }, [expectedHeaders]);

  // Extract current category text and position
  const currentCategoryInfo = useMemo(() => {
    if (!textareaRef.current || categoryColumnIndex === -1) return null;

    const lines = value.split('\n');
    let currentLineIndex = 0;
    let currentPosition = 0;

    // Find which line the cursor is on
    for (let i = 0; i < lines.length; i++) {
      const lineLength = lines[i].length + 1; // +1 for newline
      if (currentPosition + lineLength > cursorPosition) {
        currentLineIndex = i;
        break;
      }
      currentPosition += lineLength;
    }

    const currentLine = lines[currentLineIndex];
    if (!currentLine) return null;

    const cursorPositionInLine = cursorPosition - currentPosition;
    const columns = currentLine.split('\t');

    // Check if we're in the category column
    if (categoryColumnIndex >= columns.length) return null;

    // Calculate positions of each column
    let columnStartPos = 0;
    for (let i = 0; i < categoryColumnIndex; i++) {
      columnStartPos += columns[i].length + 1; // +1 for tab
    }

    const categoryText = columns[categoryColumnIndex] || '';
    const columnEndPos = columnStartPos + categoryText.length;

    // Check if cursor is within the category column
    if (cursorPositionInLine >= columnStartPos && cursorPositionInLine <= columnEndPos) {
      return {
        categoryText: categoryText,
        startPos: currentPosition + columnStartPos,
        endPos: currentPosition + columnEndPos,
        lineIndex: currentLineIndex,
        columnStartInLine: columnStartPos
      };
    }

    return null;
  }, [value, cursorPosition, categoryColumnIndex, textareaRef]);

  // Get suggestions for current category text
  const suggestions = useCategorySuggestions(
    currentCategoryInfo?.categoryText || '',
    categories
  );

  // Calculate suggestion dropdown position
  useEffect(() => {
    if (!currentCategoryInfo || !textareaRef.current || !measureRef.current || suggestions.length === 0) {
      setIsVisible(false);
      setSuggestionPosition(null);
      return;
    }

    const textarea = textareaRef.current;
    const measure = measureRef.current;

    // Copy textarea styles to measure element for accurate measurement
    const computedStyle = window.getComputedStyle(textarea);
    measure.style.font = computedStyle.font;
    measure.style.letterSpacing = computedStyle.letterSpacing;
    measure.style.wordSpacing = computedStyle.wordSpacing;
    measure.style.textTransform = computedStyle.textTransform;
    measure.style.textIndent = computedStyle.textIndent;
    measure.style.lineHeight = computedStyle.lineHeight;
    measure.style.padding = computedStyle.padding;
    measure.style.border = computedStyle.border;
    measure.style.whiteSpace = 'pre';

    // Get text up to the category column start
    const lines = value.split('\n');
    const textBeforeCategoryLine = lines.slice(0, currentCategoryInfo.lineIndex).join('\n');
    const currentLine = lines[currentCategoryInfo.lineIndex];
    const textBeforeCategory = currentLine.substring(0, currentCategoryInfo.columnStartInLine);

    // Measure position
    measure.textContent = textBeforeCategoryLine + (textBeforeCategoryLine ? '\n' : '') + textBeforeCategory;

    // Calculate the position relative to the textarea
    const lineHeight = parseInt(computedStyle.lineHeight) || 20;
    const paddingTop = parseInt(computedStyle.paddingTop) || 0;
    const paddingLeft = parseInt(computedStyle.paddingLeft) || 0;

    // Position calculation
    const lines_before = textBeforeCategoryLine ? textBeforeCategoryLine.split('\n').length : 0;
    const top = paddingTop + (lines_before * lineHeight) + lineHeight;

    // Measure width of text before category in current line
    const tempMeasure = document.createElement('span');
    tempMeasure.style.font = computedStyle.font;
    tempMeasure.style.visibility = 'hidden';
    tempMeasure.style.position = 'absolute';
    tempMeasure.style.whiteSpace = 'pre';
    tempMeasure.textContent = textBeforeCategory.replace(/\t/g, '    '); // Convert tabs to spaces for measurement
    document.body.appendChild(tempMeasure);
    const textWidth = tempMeasure.getBoundingClientRect().width;
    document.body.removeChild(tempMeasure);

    const left = paddingLeft + textWidth;

    setSuggestionPosition({
      top,
      left,
      categoryText: currentCategoryInfo.categoryText,
      startPos: currentCategoryInfo.startPos,
      endPos: currentCategoryInfo.endPos
    });
    setIsVisible(true);
    setHighlightedIndex(0);
  }, [currentCategoryInfo, suggestions.length, value, textareaRef]);

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion: any) => {
    if (!suggestionPosition) return;

    onSuggestionSelect(
      suggestion.pathText,
      suggestionPosition.startPos,
      suggestionPosition.endPos
    );
    setIsVisible(false);
  }, [onSuggestionSelect, suggestionPosition]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev =>
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev =>
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
          if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
            e.preventDefault();
            handleSuggestionSelect(suggestions[highlightedIndex]);
          }
          break;
        case 'Tab':
          if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
            e.preventDefault();
            handleSuggestionSelect(suggestions[highlightedIndex]);
          }
          break;
        case 'Escape':
          setIsVisible(false);
          break;
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible, suggestions, highlightedIndex, handleSuggestionSelect]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (dropdownRef.current && isVisible) {
      const highlightedElement = dropdownRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [highlightedIndex, isVisible]);

  if (!isVisible || !suggestionPosition || suggestions.length === 0) {
    return (
      <>
        <div
          ref={measureRef}
          style={{
            position: 'absolute',
            left: '-9999px',
            top: '-9999px',
            visibility: 'hidden',
            whiteSpace: 'pre',
            wordWrap: 'break-word'
          }}
        />
      </>
    );
  }

  return (
    <>
      <div
        ref={measureRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          visibility: 'hidden',
          whiteSpace: 'pre',
          wordWrap: 'break-word'
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: suggestionPosition.top,
          left: suggestionPosition.left,
          zIndex: 1000,
          minWidth: '200px',
          maxWidth: '400px'
        }}
      >
        <SuggestionsDropdown
          ref={dropdownRef}
          suggestions={suggestions}
          highlightedIndex={highlightedIndex}
          categories={categories}
          value={suggestionPosition.categoryText}
          onSuggestionSelect={handleSuggestionSelect}
          onMouseDown={(e) => e.preventDefault()}
        />
      </div>
    </>
  );
};
