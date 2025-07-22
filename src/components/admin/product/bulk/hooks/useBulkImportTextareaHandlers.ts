import { useCallback } from 'react';

export function useBulkImportTextareaHandlers({
  processAndUpdateData,
  setPastedData,
  setCursorPosition,
  pastedData,
  sampleData,
  textareaRef
}: {
  processAndUpdateData: (value: string) => string;
  setPastedData: (value: string) => void;
  setCursorPosition: (pos: number) => void;
  pastedData: string;
  sampleData: string;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}) {
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const processedValue = processAndUpdateData(e.target.value);
    setPastedData(processedValue);
    setCursorPosition(e.target.selectionStart);
  }, [processAndUpdateData, setPastedData, setCursorPosition]);

  const handleLoadSample = useCallback(() => {
    const processedValue = processAndUpdateData(sampleData);
    setPastedData(processedValue);
  }, [processAndUpdateData, sampleData, setPastedData]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = pastedData.substring(0, start) + '    ' + pastedData.substring(end);
      const processedValue = processAndUpdateData(newValue);
      setPastedData(processedValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
        setCursorPosition(start + 4);
      }, 0);
    }
  }, [pastedData, processAndUpdateData, setPastedData, setCursorPosition]);

  const handleSuggestionSelect = useCallback((suggestion: string, startPos: number, endPos: number) => {
    const newValue = pastedData.substring(0, startPos) + suggestion + pastedData.substring(endPos);
    const processedValue = processAndUpdateData(newValue);
    setPastedData(processedValue);
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = startPos + suggestion.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        setCursorPosition(newCursorPos);
      }
    }, 0);
  }, [pastedData, processAndUpdateData, setPastedData, setCursorPosition, textareaRef]);

  return {
    handleInputChange,
    handleLoadSample,
    handleKeyDown,
    handleSuggestionSelect
  };
}
