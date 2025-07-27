import { createContext, useContext } from 'react';
import { useAdminCollectionsTab } from 'hooks/admin/collections/useCollectionsTab';
import { type Collection } from 'types/collection';
import { ConfirmationDialog } from 'ui/confirmation-dialog';

interface CollectionsTabProviderProps {
  children: React.ReactNode;
  initialCollections: Collection[];
}

interface CollectionsTabContextType {
  // State
  searchQuery: string;
  showAddForm: boolean;
  editingCollection: Collection | null;
  filteredCollections: Collection[];
  collections: Collection[];
  confirmation: any;

  // Handlers
  handleSearchChange: (query: string) => void;
  handleAddCollection: (newCollection: Omit<Collection, 'id'>) => Promise<void>;
  handleEditCollection: (updatedCollection: Collection) => Promise<void>;
  handleDeleteCollection: (collectionId: string, collectionTitle?: string) => Promise<void>;
  handleShowAddForm: () => void;
  handleHideAddForm: () => void;
  handleStartEditing: (collection: Collection) => void;
  handleStopEditing: () => void;
  handleCancelForm: () => void;
  fetchCollections: () => Promise<void>;

  // Legacy handlers (for backward compatibility)
  setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingCollection: React.Dispatch<React.SetStateAction<Collection | null>>;

  // Computed values
  isFormVisible: boolean;
  currentCollection: Collection | null;
  collectionsCountText: string;
}

const CollectionsTabContext = createContext<CollectionsTabContextType | undefined>(undefined);

export const CollectionsTabProvider = ({ children, initialCollections }: CollectionsTabProviderProps) => {
  const adminCollectionsTab = useAdminCollectionsTab({ initialCollections });
  return (
    <CollectionsTabContext.Provider value={adminCollectionsTab}>
      {children}
      {adminCollectionsTab.confirmation && (
        <ConfirmationDialog
          isOpen={adminCollectionsTab.confirmation.isOpen}
          onClose={adminCollectionsTab.confirmation.hideConfirmation}
          onConfirm={adminCollectionsTab.confirmation.onConfirm || (() => {})}
          title={adminCollectionsTab.confirmation.title}
          message={adminCollectionsTab.confirmation.message}
          confirmText={adminCollectionsTab.confirmation.confirmText}
          cancelText={adminCollectionsTab.confirmation.cancelText}
          variant={adminCollectionsTab.confirmation.variant}
          isLoading={adminCollectionsTab.confirmation.isLoading}
        />
      )}
    </CollectionsTabContext.Provider>
  );
};

export const  useCollectionsTab = () => {
  const context = useContext(CollectionsTabContext);
  if (!context) throw new Error('useCollectionsTab must be used within a CollectionsTabProvider');
  return context;
};
