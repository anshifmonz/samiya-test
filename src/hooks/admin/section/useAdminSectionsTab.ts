import { useState, useEffect } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { type Section, type SectionWithProducts, type SectionProductItem } from 'types/section';
import { type Product } from 'types/product';

interface UseAdminSectionsTabProps {
  sections: SectionWithProducts[];
  products: Product[];
  onAddSection: (section: Omit<Section, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditSection: (section: Section) => void;
  onDeleteSection: (sectionId: string, sectionTitle?: string) => void;
  onAddProductToSection: (sectionId: string, productId: string) => void;
  onRemoveProductFromSection: (sectionId: string, productId: string, productTitle?: string, sectionTitle?: string) => void;
  onReorderSections: (sectionIds: string[]) => void;
  onReorderSectionProducts: (sectionId: string, productIds: string[]) => void;
}

export const useAdminSectionsTab = ({
  sections,
  onAddSection,
  onEditSection,
  onDeleteSection,
  onAddProductToSection,
  onRemoveProductFromSection,
  onReorderSections,
  onReorderSectionProducts
}: UseAdminSectionsTabProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [searchModalOpen, setSearchModalOpen] = useState<string | null>(null);
  const [localProductOrders, setLocalProductOrders] = useState<Record<string, SectionProductItem[]>>({});

  useEffect(() => {
    setLocalProductOrders({});
  }, [sections]);

  // Section management functions
  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const startEditing = (section: Section) => {
    setEditingSection(section.id);
    setEditingTitle(section.title);
  };

  const saveEdit = () => {
    if (editingSection && editingTitle.trim()) {
      const section = sections.find(s => s.id === editingSection);
      if (section) {
        onEditSection({ ...section, title: editingTitle.trim() });
      }
    }
    setEditingSection(null);
    setEditingTitle('');
  };

  const cancelEdit = () => {
    setEditingSection(null);
    setEditingTitle('');
  };

  const handleAddSection = () => {
    if (newSectionTitle.trim()) {
      onAddSection({
        title: newSectionTitle.trim(),
        isActive: true,
        sortOrder: 0
      });
      setNewSectionTitle('');
      setShowAddSection(false);
    }
  };

  const handleToggleActive = (section: Section) => {
    onEditSection({ ...section, isActive: !section.isActive });
  };

  // Product management functions
  const getSectionProducts = (section: SectionWithProducts): SectionProductItem[] => {
    if (localProductOrders[section.id]) {
      return localProductOrders[section.id];
    }
    return section.products || [];
  };

  const handleProductSelect = (productId: string) => {
    if (searchModalOpen) {
      onAddProductToSection(searchModalOpen, productId);
      setSearchModalOpen(null);
    }
  };

  const getExistingProductIds = (sectionId: string): string[] => {
    const section = sections.find(s => s.id === sectionId);
    return section ? section.products.map(p => p.id) : [];
  };

  const handleRemoveProduct = (sectionId: string, productId: string, productTitle?: string, sectionTitle?: string) => {
    onRemoveProductFromSection(sectionId, productId, productTitle, sectionTitle);
  };

  // Drag and drop handlers
  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sections.findIndex(section => section.id === active.id);
      const newIndex = sections.findIndex(section => section.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newSections = arrayMove(sections, oldIndex, newIndex);
        const sectionIds = newSections.map((section: SectionWithProducts) => section.id);
        onReorderSections(sectionIds);
      }
    }
  };

  const handleProductDragEnd = (event: DragEndEvent, section: SectionWithProducts) => {
    const { active, over } = event;
    const sectionProducts = getSectionProducts(section);

    if (active.id !== over?.id) {
      const oldIndex = sectionProducts.findIndex(product => product.id === active.id);
      const newIndex = sectionProducts.findIndex(product => product.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newProducts = arrayMove(sectionProducts, oldIndex, newIndex);
        const productIds = newProducts.map((product: SectionProductItem) => product.id);

        setLocalProductOrders(prev => ({
          ...prev,
          [section.id]: newProducts
        }));

        onReorderSectionProducts(section.id, productIds);
      }
    }
  };

  // UI state management
  const openAddSection = () => setShowAddSection(true);
  const closeAddSection = () => setShowAddSection(false);
  const openSearchModal = (sectionId: string) => setSearchModalOpen(sectionId);
  const closeSearchModal = () => setSearchModalOpen(null);

  // Computed values
  const isSectionExpanded = (sectionId: string) => expandedSections.has(sectionId);
  const isSectionEditing = (sectionId: string) => editingSection === sectionId;

  return {
    // State
    editingTitle,
    showAddSection,
    newSectionTitle,
    searchModalOpen,
    localProductOrders,
    setLocalProductOrders,

    // Section management
    toggleSection,
    startEditing,
    saveEdit,
    cancelEdit,
    handleAddSection,
    handleToggleActive,
    openAddSection,
    closeAddSection,

    // Product management
    getSectionProducts,
    handleProductSelect,
    getExistingProductIds,
    handleRemoveProduct,

    // Drag and drop
    handleSectionDragEnd,
    handleProductDragEnd,

    // Search modal
    openSearchModal,
    closeSearchModal,

    // Computed values
    isSectionExpanded,
    isSectionEditing,

    // Setters
    setEditingTitle,
    setNewSectionTitle,
  };
};
