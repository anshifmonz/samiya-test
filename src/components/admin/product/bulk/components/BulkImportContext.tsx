import { createContext, useContext, ReactNode } from 'react';
import { type Category } from 'types/category';
import { type Size } from 'types/product';

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

// Comprehensive context for the BulkImportModal and all its nested components.
// Organized into logical sections for better maintainability.
interface BulkImportContextValue {
  // CORE CONFIGURATION
  // Static configuration data
  readonly config: {
    categories: Category[];
    sizes: Size[];
    expectedHeaders: string[];
    sampleData: string;
  };

  // PRIMARY STATE
  // Main application state
  state: {
    pastedData: string;
    parsedProducts: ParsedProduct[];
    rawTableData: string[][];
    isValidating: boolean;
    mounted: boolean;
  };

  // CURSOR & NAVIGATION
  // Textarea cursor and column tracking
  cursor: {
    position: number;
    activeColumnIndex: number | null;
  };

  // IMAGE DIALOG
  // Image editing dialog state
  imageDialog: {
    isOpen: boolean;
    productTitle: string;
    imageData: Record<string, ColorImageData>;
  };

  // COMPUTED VALUES
  // Derived state and statistics
  computed: {
    validProductsCount: number;
    totalProductsCount: number;
    hasErrors: boolean;
    hasWarnings: boolean;
  };

  // REFS
  // React refs for DOM elements
  refs: {
    textarea: React.RefObject<HTMLTextAreaElement>;
  };

  // CORE ACTIONS
  // Primary data manipulation actions
  actions: {
    updateCellValue: (rowIndex: number, colIndex: number, newValue: string) => void;
    handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    handleCursorChange: (e: React.FormEvent<HTMLTextAreaElement>) => void;
    handleLoadSample: () => void;
    handleSuggestionSelect: (suggestion: string, startPos: number, endPos: number) => void;
  };

  // IMAGE ACTIONS
  // Image dialog related actions
  imageActions: {
    openImageDialog: (rowIndex: number, productTitle: string, imageData: Record<string, ColorImageData>) => void;
    closeImageDialog: () => void;
    saveImageChanges: (imageData: Record<string, ColorImageData>) => void;
    updateImageDataRealTime: (imageData: Record<string, ColorImageData>) => void;
  };

  // MODAL ACTIONS
  // Modal-level actions
  modalActions: {
    handleImport: () => void;
    handleCancel: () => void;
  };

  // LEGACY COMPATIBILITY
  /**
   * @deprecated Use the organized structure above instead.
   * These are maintained for backward compatibility during migration.
   */
  categories: Category[];
  sizes: Size[];
  expectedHeaders: string[];
  sampleData: string;
  pastedData: string;
  parsedProducts: ParsedProduct[];
  rawTableData: string[][];
  cursorPosition: number;
  activeColumnIndex: number | null;
  isValidating: boolean;
  mounted: boolean;
  showImageDialog: boolean;
  currentImageProductTitle: string;
  currentImageData: Record<string, ColorImageData>;
  validProductsCount: number;
  totalProductsCount: number;
  hasErrors: boolean;
  hasWarnings: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  updateCellValue: (rowIndex: number, colIndex: number, newValue: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleCursorChange: (e: React.FormEvent<HTMLTextAreaElement>) => void;
  handleLoadSample: () => void;
  handleSuggestionSelect: (suggestion: string, startPos: number, endPos: number) => void;
  handleEditImages: (rowIndex: number, productTitle: string, imageData: Record<string, ColorImageData>) => void;
  handleCloseImageDialog: () => void;
  handleSaveImageChanges: (imageData: Record<string, ColorImageData>) => void;
  handleRealTimeImageUpdate: (imageData: Record<string, ColorImageData>) => void;
  handleImport: () => void;
  onCancel: () => void;
  handleClearData: () => void;
}
const BulkImportContext = createContext<BulkImportContextValue | undefined>(undefined);

export const BulkImportProvider: React.FC<{
  value: BulkImportContextValue;
  children: ReactNode;
}> = ({ value, children }) => (
  <BulkImportContext.Provider value={value}>
    {children}
  </BulkImportContext.Provider>
);

// Main hook to access the full bulk import context.
export function useBulkImportContext() {
  const ctx = useContext(BulkImportContext);
  if (!ctx) throw new Error('useBulkImportContext must be used within a BulkImportProvider');
  return ctx;
}

// Scoped hooks for specific sections of the context.
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
