import { useRef, useState } from 'react';
import { type CreateProductData } from 'types/product';
import { type Category } from 'types/category';
import { type Size } from 'types/product';
import { useCursorTracking, useDataProcessing, useBulkImportImageDialog, useBulkImportTextareaHandlers, useBulkImportSubmit, useModalMountEffect } from './index';

export function useBulkImportModalLogic({
  categories,
  sizes,
  expectedHeaders,
  sampleData,
  onImport,
  onCancel,
  persistentData,
  onDataChange,
  onClearData
}: {
  categories: Category[];
  sizes: Size[];
  expectedHeaders: string[];
  sampleData: string;
  onImport: (products: CreateProductData[]) => void;
  onCancel: () => void;
  persistentData: string;
  onDataChange: (data: string) => void;
  onClearData: () => void;
}) {
  const [isValidating, setIsValidating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Data processing and cursor tracking
  const {
    pastedData,
    setPastedData,
    parsedProducts,
    rawTableData,
    categoryMap,
    sizeMap,
    processAndUpdateData,
    updateCellValue
  } = useDataProcessing(categories, sizes, expectedHeaders, persistentData, onDataChange);

  const {
    cursorPosition,
    setCursorPosition,
    activeColumnIndex,
    handleCursorChange
  } = useCursorTracking(pastedData, expectedHeaders);

  // Modal mount effect
  const mounted = useModalMountEffect();

  // Image dialog logic
  const imageDialog = useBulkImportImageDialog({
    expectedHeaders,
    rawTableData,
    updateCellValue
  });

  // Textarea handlers
  const textareaHandlers = useBulkImportTextareaHandlers({
    processAndUpdateData,
    setPastedData,
    setCursorPosition,
    pastedData,
    sampleData,
    textareaRef
  });

  // Import/submit logic
  const submitLogic = useBulkImportSubmit({
    parsedProducts,
    sizeMap,
    sizes,
    onImport,
    setIsValidating
  });

  const validProductsCount = parsedProducts.filter(p => p.errors.length === 0).length;
  const totalProductsCount = parsedProducts.length;
  const hasErrors = parsedProducts.some(p => p.errors.length > 0);
  const hasWarnings = parsedProducts.some(p => p.warnings.length > 0);

  const handleClearData = () => {
    setPastedData('');
    onClearData();
    setCursorPosition(0);
  };

  return {
    isValidating,
    mounted,
    textareaRef,
    ...imageDialog,
    pastedData,
    setPastedData,
    parsedProducts,
    rawTableData,
    categoryMap,
    sizeMap,
    processAndUpdateData,
    updateCellValue,
    cursorPosition,
    setCursorPosition,
    activeColumnIndex,
    handleCursorChange,
    ...textareaHandlers,
    ...submitLogic,
    validProductsCount,
    totalProductsCount,
    hasErrors,
    hasWarnings,
    onCancel,
    handleClearData
  };
}
