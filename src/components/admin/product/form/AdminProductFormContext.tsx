import React, { createContext, useContext, ReactNode } from 'react';
import { type Product, type CreateProductData, type ProductColorData, type Size } from 'types/product';
import { type Category } from 'types/category';

// Common types used across the admin product form context
export interface FormData {
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  categoryId: string;
  images: Record<string, ProductColorData>;
  tags: string[];
  sizes: Size[];
  active: boolean;
  short_code: string;
}

/**
 * Comprehensive context for the AdminProductForm and all its nested components.
 * Organized into logical sections for better maintainability.
 */
interface AdminProductFormContextValue {
  // ===== CORE CONFIGURATION =====
  /** Static configuration data */
  readonly config: {
    product?: Product | null;
    categories: Category[];
  };

  // ===== FORM STATE =====
  /** Main form state */
  state: {
    formData: FormData;
    activeColorTab: string;
    mounted: boolean;
  };

  // ===== COMPUTED VALUES =====
  /** Derived state and metadata */
  computed: {
    isEditing: boolean;
    modalTitle: string;
  };

  // ===== FORM ACTIONS =====
  /** Form field update actions */
  actions: {
    handleTitleChange: (value: string) => void;
    handleDescriptionChange: (value: string) => void;
    handlePriceChange: (value: number) => void;
    handleOriginalPriceChange: (value: number) => void;
    handleCategoryChange: (value: string) => void;
    handleImagesChange: (images: Record<string, ProductColorData>) => void;
    handleTagsChange: (tags: string[]) => void;
    handleSizesChange: (sizes: Size[]) => void;
    handleActiveChange: (active: boolean) => void;
    setActiveColorTab: (color: string) => void;
  };

  // ===== FORM CONTROL =====
  /** Form submission and control actions */
  formControl: {
    handleSubmit: (e: React.FormEvent) => void;
    handleCancel: () => void;
  };

  // ===== LEGACY COMPATIBILITY =====
  /** 
   * @deprecated Use the organized structure above instead.
   * These are maintained for backward compatibility during migration.
   */
  formData: FormData;
  activeColorTab: string;
  mounted: boolean;
  handleTitleChange: (value: string) => void;
  handleDescriptionChange: (value: string) => void;
  handlePriceChange: (value: number) => void;
  handleOriginalPriceChange: (value: number) => void;
  handleCategoryChange: (value: string) => void;
  handleImagesChange: (images: Record<string, ProductColorData>) => void;
  handleTagsChange: (tags: string[]) => void;
  handleSizesChange: (sizes: Size[]) => void;
  handleActiveChange: (active: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCancel: () => void;
  setActiveColorTab: (color: string) => void;
  isEditing: boolean;
  modalTitle: string;
  categories: Category[];
  product?: Product | null;
}

const AdminProductFormContext = createContext<AdminProductFormContextValue | undefined>(undefined);

export const AdminProductFormProvider: React.FC<{
  value: AdminProductFormContextValue;
  children: ReactNode;
}> = ({ value, children }) => (
  <AdminProductFormContext.Provider value={value}>
    {children}
  </AdminProductFormContext.Provider>
);

/**
 * Main hook to access the full admin product form context.
 * Use this when you need access to multiple sections of the context.
 */
export function useAdminProductFormContext() {
  const ctx = useContext(AdminProductFormContext);
  if (!ctx) throw new Error('useAdminProductFormContext must be used within an AdminProductFormProvider');
  return ctx;
}

/**
 * Scoped hooks for specific sections of the context.
 * Use these for better performance and clearer component dependencies.
 */

/** Hook for accessing configuration data */
export function useAdminProductFormConfig() {
  const ctx = useAdminProductFormContext();
  return ctx.config;
}

/** Hook for accessing form state */
export function useAdminProductFormState() {
  const ctx = useAdminProductFormContext();
  return ctx.state;
}

/** Hook for computed values */
export function useAdminProductFormComputed() {
  const ctx = useAdminProductFormContext();
  return ctx.computed;
}

/** Hook for form actions */
export function useAdminProductFormActions() {
  const ctx = useAdminProductFormContext();
  return ctx.actions;
}

/** Hook for form control */
export function useAdminProductFormControl() {
  const ctx = useAdminProductFormContext();
  return ctx.formControl;
}

/** 
 * Convenience hooks that combine commonly used context sections
 */

/** Hook for basic form fields */
export function useAdminProductFormFields() {
  const ctx = useAdminProductFormContext();
  return {
    formData: ctx.state.formData,
    handleTitleChange: ctx.actions.handleTitleChange,
    handleDescriptionChange: ctx.actions.handleDescriptionChange,
    handlePriceChange: ctx.actions.handlePriceChange,
    handleOriginalPriceChange: ctx.actions.handleOriginalPriceChange,
    handleCategoryChange: ctx.actions.handleCategoryChange,
    handleTagsChange: ctx.actions.handleTagsChange,
    handleSizesChange: ctx.actions.handleSizesChange,
    handleActiveChange: ctx.actions.handleActiveChange,
  };
}

/** Hook for image management */
export function useAdminProductFormImages() {
  const ctx = useAdminProductFormContext();
  return {
    images: ctx.state.formData.images,
    activeColorTab: ctx.state.activeColorTab,
    handleImagesChange: ctx.actions.handleImagesChange,
    setActiveColorTab: ctx.actions.setActiveColorTab,
  };
}

/** Hook for category data */
export function useAdminProductFormCategory() {
  const ctx = useAdminProductFormContext();
  return {
    categories: ctx.config.categories,
    categoryId: ctx.state.formData.categoryId,
    handleCategoryChange: ctx.actions.handleCategoryChange,
  };
}

/** Hook for action buttons */
export function useAdminProductFormActions_Buttons() {
  const ctx = useAdminProductFormContext();
  return {
    isEditing: ctx.computed.isEditing,
    handleCancel: ctx.formControl.handleCancel,
  };
}
