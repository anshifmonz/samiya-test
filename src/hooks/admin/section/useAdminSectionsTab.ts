import { useState, useEffect } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { type Section, type SectionWithProducts, type SectionProductItem } from 'types/section';
import { showToast } from 'hooks/ui/use-toast';
import { apiRequest } from 'utils/apiRequest';
import { useConfirmation } from 'hooks/useConfirmation';

interface UseAdminSectionsTabProps {
  initialSections: SectionWithProducts[];
}

export const useAdminSectionsTab = ({
  initialSections
}: UseAdminSectionsTabProps) => {
  const [sectionList, setSectionList] = useState<SectionWithProducts[]>(initialSections);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionDescription, setNewSectionDescription] = useState('');
  const [searchModalOpen, setSearchModalOpen] = useState<string | null>(null);
  const [localProductOrders, setLocalProductOrders] = useState<Record<string, SectionProductItem[]>>({});
  const confirmation = useConfirmation();

  useEffect(() => {
    setLocalProductOrders({});
  }, [sectionList]);

  // Section API functions
  const fetchSections = async () => {
    const { data } = await apiRequest('/api/admin/section?withProducts=true', { showLoadingBar: true });
    if (data && data.sections) setSectionList(data.sections);
  };

  const handleAddSectionApi = async (newSection: Omit<Section, 'id' | 'createdAt' | 'updatedAt' | 'products'>) => {
    const { error } = await apiRequest('/api/admin/section', { method: 'POST', body: newSection, showLoadingBar: true });
    if (!error) {
      await fetchSections();
      showToast({ title: 'Success', description: 'Section added successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  const handleEditSectionApi = async (updatedSection: Section) => {
    const { error } = await apiRequest('/api/admin/section', { method: 'PUT', body: updatedSection, showLoadingBar: true });
    if (!error) {
      await fetchSections();
      showToast({ title: 'Success', description: 'Section updated successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  const handleDeleteSectionApi = async (sectionId: string, sectionTitle?: string) => {
    const confirmed = await confirmation.confirm({
      title: 'Delete Section',
      message: `Are you sure you want to permanently delete the section${sectionTitle ? ` "${sectionTitle}"` : ''}? This will remove all products from this section. This action cannot be undone.`,
      confirmText: 'Delete Section',
      cancelText: 'Cancel',
      variant: 'destructive',
    });

    if (!confirmed) return;

    const { error } = await apiRequest(`/api/admin/section?id=${encodeURIComponent(sectionId)}`, { method: 'DELETE', showLoadingBar: true });
    if (!error) {
      await fetchSections();
      showToast({ title: 'Success', description: 'Section deleted successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  const handleAddProductToSectionApi = async (sectionId: string, productId: string) => {
    const { error } = await apiRequest('/api/admin/section/products', { method: 'POST', body: { sectionId, productId }, showLoadingBar: true });
    if (!error) {
      await fetchSections();
      showToast({ title: 'Success', description: 'Product added to section successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  const handleRemoveProductFromSectionApi = async (sectionId: string, productId: string, productTitle?: string, sectionTitle?: string) => {
    const confirmed = await confirmation.confirm({
      title: 'Remove Product from Section',
      message: `Are you sure you want to remove${productTitle ? ` "${productTitle}"` : ' this product'} from${sectionTitle ? ` the "${sectionTitle}" section` : ' this section'}? The product will remain in your inventory but will no longer appear in this section.`,
      confirmText: 'Remove Product',
      cancelText: 'Cancel',
      variant: 'destructive',
    });

    if (!confirmed) return;

    const { error } = await apiRequest(`/api/admin/section/products?sectionId=${encodeURIComponent(sectionId)}&productId=${encodeURIComponent(productId)}`, { method: 'DELETE', showLoadingBar: true });
    if (!error) {
      await fetchSections();
      showToast({ title: 'Success', description: 'Product removed from section successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  const handleReorderSectionProductsApi = async (sectionId: string, productIds: string[]) => {
    const { error } = await apiRequest('/api/admin/section/products', { method: 'PATCH', body: { sectionId, productIds }, showLoadingBar: true });
    if (!error) {
      await fetchSections();
      showToast({ title: 'Success', description: 'Section products reordered successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  const handleReorderSectionsApi = async (sectionIds: string[]) => {
    const { error } = await apiRequest('/api/admin/section', { method: 'PATCH', body: { sectionIds }, showLoadingBar: true });
    if (!error) {
      await fetchSections();
      showToast({ title: 'Success', description: 'Sections reordered successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

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
    setEditingDescription(section.description || '');
  };

  const saveEdit = () => {
    if (editingSection && editingTitle.trim() && editingDescription.trim()) {
      const section = sectionList.find(s => s.id === editingSection);
      if (section) {
        handleEditSectionApi({ ...section, title: editingTitle.trim(), description: editingDescription.trim() });
      }
    }
    setEditingSection(null);
    setEditingTitle('');
    setEditingDescription('');
  };

  const cancelEdit = () => {
    setEditingSection(null);
    setEditingTitle('');
    setEditingDescription('');
  };

  const handleAddSection = () => {
    if (newSectionTitle.trim() && newSectionDescription.trim()) {
      handleAddSectionApi({
        title: newSectionTitle.trim(),
        description: newSectionDescription.trim(),
        isActive: true,
        sortOrder: 0
      });
      setNewSectionTitle('');
      setNewSectionDescription('');
      setShowAddSection(false);
    }
  };

  const handleToggleActive = (section: Section) => {
    handleEditSectionApi({ ...section, isActive: !section.isActive });
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
      handleAddProductToSectionApi(searchModalOpen, productId);
    }
  };

  const getExistingProductIds = (sectionId: string): string[] => {
    const section = sectionList.find(s => s.id === sectionId);
    return section ? section.products.map(p => p.id) : [];
  };

  const handleRemoveProduct = (sectionId: string, productId: string, productTitle?: string, sectionTitle?: string) => {
    handleRemoveProductFromSectionApi(sectionId, productId, productTitle, sectionTitle);
  };

  // Drag and drop handlers
  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sectionList.findIndex(section => section.id === active.id);
      const newIndex = sectionList.findIndex(section => section.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newSections = arrayMove(sectionList, oldIndex, newIndex);
        const sectionIds = newSections.map((section: SectionWithProducts) => section.id);
        handleReorderSectionsApi(sectionIds);
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

        handleReorderSectionProductsApi(section.id, productIds);
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
    // Data
    sectionList,

    // State
    editingTitle,
    editingDescription,
    showAddSection,
    newSectionTitle,
    newSectionDescription,
    searchModalOpen,
    localProductOrders,
    setLocalProductOrders,

    // API functions
    fetchSections,
    handleAddSectionApi,
    handleEditSectionApi,
    handleDeleteSectionApi,
    handleAddProductToSectionApi,
    handleRemoveProductFromSectionApi,
    handleReorderSectionProductsApi,
    handleReorderSectionsApi,

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
    setEditingDescription,
    setNewSectionTitle,
    setNewSectionDescription,

    // Confirmation dialog state
    confirmation
  };
};
