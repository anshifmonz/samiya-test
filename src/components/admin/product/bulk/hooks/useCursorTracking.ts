import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for tracking cursor position and calculating active column
 */
export const useCursorTracking = (pastedData: string, expectedHeaders: string[]) => {
  const [cursorPosition, setCursorPosition] = useState(0);
  const [activeColumnIndex, setActiveColumnIndex] = useState<number | null>(null);

  // Calculate which column the cursor is currently in
  const calculateActiveColumn = useCallback((text: string, cursorPos: number): number | null => {
    if (!text || cursorPos < 0) return null;
    
    // Get text up to cursor position
    const textToCursor = text.substring(0, cursorPos);
    
    // Find the current line
    const lines = textToCursor.split('\n');
    const currentLine = lines[lines.length - 1];
    
    // Convert 4 consecutive spaces to tabs for counting (same logic as processAndUpdateData)
    const normalizedLine = currentLine.replace(/    /g, '\t');
    
    // Count tabs in current line to determine column
    const tabCount = (normalizedLine.match(/\t/g) || []).length;
    
    // Column index is the number of tabs (0-indexed)
    return tabCount < expectedHeaders.length ? tabCount : null;
  }, [expectedHeaders.length]);

  // Update active column when cursor position changes
  useEffect(() => {
    const columnIndex = calculateActiveColumn(pastedData, cursorPosition);
    setActiveColumnIndex(columnIndex);
  }, [cursorPosition, pastedData, calculateActiveColumn]);

  // Handle cursor position changes
  const handleCursorChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement;
    setCursorPosition(textarea.selectionStart);
  };

  return {
    cursorPosition,
    setCursorPosition,
    activeColumnIndex,
    handleCursorChange
  };
};
