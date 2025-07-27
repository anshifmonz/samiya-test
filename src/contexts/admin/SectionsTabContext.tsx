import { useAdminSectionsTab } from 'hooks/admin/section/useAdminSectionsTab';
import { Section, SectionProductItem, SectionWithProducts } from 'types/section';
import { DragEndEvent } from '@dnd-kit/core';
import { createContext, useContext } from 'react';
import { ConfirmationDialog } from 'ui/confirmation-dialog';

interface SectionsTabProviderProps {
  children: React.ReactNode;
  initialSections: SectionWithProducts[];
}

interface SectionsTabContextType {
  // Data
  sectionList: SectionWithProducts[];

  // State
  editingTitle: string;
  showAddSection: boolean;
  newSectionTitle: string;
  searchModalOpen: string | null;
  localProductOrders: Record<string, SectionProductItem[]>;
  setLocalProductOrders: (orders: Record<string, SectionProductItem[]>) => void;

  // API functions
  fetchSections: () => Promise<void>;
  handleAddSectionApi: (section: Omit<Section, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  handleEditSectionApi: (section: Section) => Promise<void>;
  handleDeleteSectionApi: (sectionId: string, sectionTitle?: string) => Promise<void>;
  handleAddProductToSectionApi: (sectionId: string, productId: string) => Promise<void>;
  handleRemoveProductFromSectionApi: (sectionId: string, productId: string, productTitle?: string, sectionTitle?: string) => Promise<void>;
  handleReorderSectionProductsApi: (sectionId: string, productIds: string[]) => Promise<void>;
  handleReorderSectionsApi: (sectionIds: string[]) => Promise<void>;

  // Section management
  toggleSection: (sectionId: string) => void;
  startEditing: (section: Section) => void;
  saveEdit: () => void;
  cancelEdit: () => void;
  handleAddSection: () => void;
  handleToggleActive: (section: Section) => void;
  openAddSection: () => void;
  closeAddSection: () => void;

  // Product management
  getSectionProducts: (section: SectionWithProducts) => SectionProductItem[];
  handleProductSelect: (productId: string) => void;
  getExistingProductIds: (sectionId: string) => string[];
  handleRemoveProduct: (sectionId: string, productId: string, productTitle?: string, sectionTitle?: string) => void;

  // Drag and drop
  handleSectionDragEnd: (event: DragEndEvent) => void;
  handleProductDragEnd: (event: DragEndEvent, section: SectionWithProducts) => void;

  // Search modal
  openSearchModal: (sectionId: string) => void;
  closeSearchModal: () => void;

  // Computed values
  isSectionExpanded: (sectionId: string) => boolean;
  isSectionEditing: (sectionId: string) => boolean;

  // Setters
  setEditingTitle: (title: string) => void;
  setNewSectionTitle: (title: string) => void;
}

const SectionsTabContext = createContext<SectionsTabContextType | undefined>(undefined);

export const SectionsTabProvider = ({ children, initialSections }: SectionsTabProviderProps) => {
  const adminSectionsTab = useAdminSectionsTab({ initialSections });
  return (
    <SectionsTabContext.Provider value={adminSectionsTab}>
      {children}
      {adminSectionsTab.confirmation && (
        <ConfirmationDialog
          isOpen={adminSectionsTab.confirmation.isOpen}
          onClose={adminSectionsTab.confirmation.hideConfirmation}
          onConfirm={adminSectionsTab.confirmation.onConfirm || (() => {})}
          title={adminSectionsTab.confirmation.title}
          message={adminSectionsTab.confirmation.message}
          confirmText={adminSectionsTab.confirmation.confirmText}
          cancelText={adminSectionsTab.confirmation.cancelText}
          variant={adminSectionsTab.confirmation.variant}
          isLoading={adminSectionsTab.confirmation.isLoading}
        />
      )}
    </SectionsTabContext.Provider>
  );
};

export const useSectionsTab = () => {
  const context = useContext(SectionsTabContext);
  if (!context) throw new Error('useSectionsTab must be used within a SectionsTabProvider');
  return context;
};
