import { type Section, type SectionWithProducts } from 'types/section';
import { type Product } from 'types/product';
import ProductSearchModal from './ProductSearchModal';
import { useAdminSectionsTab } from 'hooks/admin/section/useAdminSectionsTab';
import {
  AddSectionForm,
  SectionsHeader,
  SectionsList,
  DraggableSectionItem
} from './components';

interface AdminSectionsTabProps {
  sections: SectionWithProducts[];
  products: Product[];
  onAddSection: (section: Omit<Section, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditSection: (section: Section) => void;
  onDeleteSection: (sectionId: string, sectionTitle?: string) => void;
  onAddProductToSection: (sectionId: string, productId: string) => void;
  onRemoveProductFromSection: (sectionId: string, productId: string, productTitle?: string, sectionTitle?: string) => void;
  onReorderSections: (sectionIds: string[]) => void;
  onReorderSectionProducts: (sectionId: string, productIds: string[]) => void;
  isSuperAdmin: boolean;
}

const AdminSectionsTab: React.FC<AdminSectionsTabProps> = ({
  sections,
  products,
  onAddSection,
  onEditSection,
  onDeleteSection,
  onAddProductToSection,
  onRemoveProductFromSection,
  onReorderSections,
  onReorderSectionProducts,
  isSuperAdmin
}) => {
  const {
    editingTitle,
    showAddSection,
    newSectionTitle,
    searchModalOpen,
    setLocalProductOrders,
    toggleSection,
    startEditing,
    saveEdit,
    cancelEdit,
    handleAddSection,
    handleToggleActive,
    getSectionProducts,
    handleProductSelect,
    getExistingProductIds,
    handleRemoveProduct,
    handleSectionDragEnd,
    handleProductDragEnd,
    openAddSection,
    closeAddSection,
    openSearchModal,
    closeSearchModal,
    isSectionExpanded,
    isSectionEditing,
    setEditingTitle,
    setNewSectionTitle,
  } = useAdminSectionsTab({
    sections,
    products,
    onAddSection,
    onEditSection,
    onDeleteSection,
    onAddProductToSection,
    onRemoveProductFromSection,
    onReorderSections,
    onReorderSectionProducts
  });

  return (
    <div className="space-y-6">
      <SectionsHeader onAddSection={openAddSection} />

      <AddSectionForm
        showAddSection={showAddSection}
        newSectionTitle={newSectionTitle}
        onNewSectionTitleChange={setNewSectionTitle}
        onAddSection={handleAddSection}
        onCancel={closeAddSection}
      />

      <div className="space-y-4">
        <SectionsList
          sections={sections}
          onDragEnd={handleSectionDragEnd}
        >
          {sections.map((section) => {
            const isExpanded = isSectionExpanded(section.id);
            const isEditing = isSectionEditing(section.id);

            return (
              <DraggableSectionItem
                key={section.id}
                section={section}
                isExpanded={isExpanded}
                isEditing={isEditing}
                editingTitle={editingTitle}
                onToggleSection={toggleSection}
                onStartEditing={startEditing}
                onSaveEdit={saveEdit}
                onCancelEdit={cancelEdit}
                onEditTitleChange={setEditingTitle}
                onToggleActive={handleToggleActive}
                onDeleteSection={onDeleteSection}
                onAddProduct={openSearchModal}
                onRemoveProduct={handleRemoveProduct}
                onReorderProducts={onReorderSectionProducts}
                setLocalProductOrders={setLocalProductOrders}
                getSectionProducts={getSectionProducts}
                handleProductDragEnd={handleProductDragEnd}
                isSuperAdmin={isSuperAdmin}
              />
            );
          })}
        </SectionsList>
      </div>

      {searchModalOpen && (
        <ProductSearchModal
          isOpen={!!searchModalOpen}
          onClose={closeSearchModal}
          onProductSelect={handleProductSelect}
          existingProductIds={getExistingProductIds(searchModalOpen)}
        />
      )}
    </div>
  );
};

export default AdminSectionsTab;
