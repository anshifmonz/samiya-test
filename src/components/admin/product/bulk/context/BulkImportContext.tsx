import { createContext, useContext, ReactNode, useRef, useState, useEffect } from 'react';
import { type Category } from 'types/category';
import { type Size, type CreateProductData } from 'types/product';
import { useCursorTracking, useDataProcessing, useBulkImportImageDialog as useImageDialogHook, useBulkImportTextareaHandlers, useBulkImportSubmit, useModalMountEffect } from '../hooks';

// Common types used across the bulk import context
export interface ParsedProduct {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  tags: string[];
  sizes: string[];
  images: Record<string, { hex: string; images: string[] }>;
  active: boolean;
  errors: string[];
  warnings: string[];
}

export interface ColorImageData {
  hex: string;
  images: string[];
}

// Props interface for the provider
export interface BulkImportProviderProps {
  categories: Category[];
  sizes: Size[];
  expectedHeaders: string[];
  sampleData: string;
  onImport: (products: CreateProductData[]) => void;
  onCancel: () => void;
  persistentData: string;
  onDataChange: (data: string) => void;
  onClearData: () => void;
  children: ReactNode;
}

interface BulkImportContextValue {
  config: {
    categories: Category[];
    sizes: Size[];
    expectedHeaders: string[];
    sampleData: string;
  };
  state: {
    pastedData: string;
    parsedProducts: ParsedProduct[];
    rawTableData: string[][];
    isValidating: boolean;
    mounted: boolean;
  };
  cursor: {
    position: number;
    activeColumnIndex: number | null;
  };
  imageDialog: {
    isOpen: boolean;
    productTitle: string;
    imageData: Record<string, ColorImageData>;
  };
  computed: {
    validProductsCount: number;
    totalProductsCount: number;
    hasErrors: boolean;
    hasWarnings: boolean;
  };
  refs: {
    textarea: React.RefObject<HTMLTextAreaElement>;
  };
  actions: {
    updateCellValue: (rowIndex: number, colIndex: number, newValue: string) => void;
    handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    handleCursorChange: (e: React.FormEvent<HTMLTextAreaElement>) => void;
    handleLoadSample: () => void;
    handleSuggestionSelect: (suggestion: string, startPos: number, endPos: number) => void;
    handleClearData: () => void;
  };
  imageActions: {
    openImageDialog: (rowIndex: number, productTitle: string, imageData: Record<string, ColorImageData>) => void;
    closeImageDialog: () => void;
    saveImageChanges: (imageData: Record<string, ColorImageData>) => void;
    updateImageDataRealTime: (imageData: Record<string, ColorImageData>) => void;
  };
  modalActions: {
    handleImport: () => void;
    handleCancel: () => void;
  };
}

const BulkImportContext = createContext<BulkImportContextValue | undefined>(undefined);

// Self-contained provider that manages all internal state
export const BulkImportProvider: React.FC<BulkImportProviderProps> = ({ 
  categories,
  sizes,
  expectedHeaders,
  sampleData,
  onImport,
  onCancel,
  persistentData,
  onDataChange,
  onClearData,
  children 
}) => {
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
  const imageDialogHook = useImageDialogHook({
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

  // Computed values
  const validProductsCount = parsedProducts.filter(p => p.errors.length === 0).length;
  const totalProductsCount = parsedProducts.length;
  const hasErrors = parsedProducts.some(p => p.errors.length > 0);
  const hasWarnings = parsedProducts.some(p => p.warnings.length > 0);

  const handleClearData = () => {
    setPastedData('');
    onClearData();
    setCursorPosition(0);
  };

  // Prevent accidental modal closing
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const contextValue: BulkImportContextValue = {
    config: {
      categories,
      sizes,
      expectedHeaders,
      sampleData,
    },
    state: {
      pastedData,
      parsedProducts,
      rawTableData,
      isValidating,
      mounted,
    },
    cursor: {
      position: cursorPosition,
      activeColumnIndex,
    },
    imageDialog: {
      isOpen: imageDialogHook.showImageDialog,
      productTitle: imageDialogHook.currentImageProductTitle,
      imageData: imageDialogHook.currentImageData,
    },
    computed: {
      validProductsCount,
      totalProductsCount,
      hasErrors,
      hasWarnings,
    },
    refs: {
      textarea: textareaRef,
    },
    actions: {
      updateCellValue,
      handleInputChange: textareaHandlers.handleInputChange,
      handleKeyDown: textareaHandlers.handleKeyDown,
      handleCursorChange,
      handleLoadSample: textareaHandlers.handleLoadSample,
      handleSuggestionSelect: textareaHandlers.handleSuggestionSelect,
      handleClearData,
    },
    imageActions: {
      openImageDialog: imageDialogHook.handleEditImages,
      closeImageDialog: imageDialogHook.handleCloseImageDialog,
      saveImageChanges: imageDialogHook.handleSaveImageChanges,
      updateImageDataRealTime: imageDialogHook.handleRealTimeImageUpdate,
    },
    modalActions: {
      handleImport: submitLogic.handleImport,
      handleCancel: onCancel,
    },
  };

  return (
    <BulkImportContext.Provider value={contextValue}>
      {children}
    </BulkImportContext.Provider>
  );
};

export function useBulkImportContext() {
  const ctx = useContext(BulkImportContext);
  if (!ctx) throw new Error('useBulkImportContext must be used within a BulkImportProvider');
  return ctx;
}

// Specialized hooks for accessing specific sections of context
export function useBulkImportConfig() {
  const ctx = useBulkImportContext();
  return ctx.config;
}

export function useBulkImportState() {
  const ctx = useBulkImportContext();
  return ctx.state;
}

export function useBulkImportCursor() {
  const ctx = useBulkImportContext();
  return ctx.cursor;
}

export function useBulkImportImageDialog() {
  const ctx = useBulkImportContext();
  return ctx.imageDialog;
}

export function useBulkImportComputed() {
  const ctx = useBulkImportContext();
  return ctx.computed;
}

export function useBulkImportRefs() {
  const ctx = useBulkImportContext();
  return ctx.refs;
}

export function useBulkImportActions() {
  const ctx = useBulkImportContext();
  return ctx.actions;
}

export function useBulkImportImageActions() {
  const ctx = useBulkImportContext();
  return ctx.imageActions;
}

export function useBulkImportModalActions() {
  const ctx = useBulkImportContext();
  return ctx.modalActions;
}

// Convenience hooks that combine commonly used context sections
export function useBulkImportTableData() {
  const ctx = useBulkImportContext();
  return {
    pastedData: ctx.state.pastedData,
    parsedProducts: ctx.state.parsedProducts,
    rawTableData: ctx.state.rawTableData,
    expectedHeaders: ctx.config.expectedHeaders,
    categories: ctx.config.categories,
    updateCellValue: ctx.actions.updateCellValue,
    handleEditImages: ctx.imageActions.openImageDialog,
    textareaRef: ctx.refs.textarea,
  };
}

export function useBulkImportValidation() {
  const ctx = useBulkImportContext();
  return {
    parsedProducts: ctx.state.parsedProducts,
    validProductsCount: ctx.computed.validProductsCount,
    totalProductsCount: ctx.computed.totalProductsCount,
    hasErrors: ctx.computed.hasErrors,
    hasWarnings: ctx.computed.hasWarnings,
    categories: ctx.config.categories,
  };
}

