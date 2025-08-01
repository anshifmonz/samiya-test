import { useState, useMemo } from 'react';
import { type Collection } from 'types/collection';
import { showToast } from 'hooks/ui/use-toast';
import { apiRequest } from 'utils/apiRequest';
import { useConfirmation } from 'hooks/useConfirmation';

interface UseAdminCollectionsTabProps {
  initialCollections: Collection[];
}

export const useAdminCollectionsTab = ({
  initialCollections
}: UseAdminCollectionsTabProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const confirmation = useConfirmation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  // Filter collections based on search query
  const filteredCollections = useMemo(() => {
    return collections.filter(collection =>
      collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [collections, searchQuery]);

  const fetchCollections = async () => {
    const { data } = await apiRequest('/api/admin/collection', { showLoadingBar: true });
    if (data && data.collections) setCollections(data.collections);
  };

  const handleAddCollection = async (newCollection: Omit<Collection, 'id'>) => {
    const { error } = await apiRequest('/api/admin/collection', { method: 'POST', body: newCollection, showLoadingBar: true });
    if (error) return showToast({ type: 'error', title: 'Error', description: error });
    await fetchCollections();
    showToast({ title: 'Success', description: 'Collection added successfully' });
    setShowAddForm(false);
  };

  const handleEditCollection = async (updatedCollection: Collection) => {
    const { error } = await apiRequest('/api/admin/collection', { method: 'PUT', body: updatedCollection, showLoadingBar: true });
    if (error) return showToast({ type: 'error', title: 'Error', description: error });
    await fetchCollections();
    showToast({ title: 'Success', description: 'Collection updated successfully' });
    setEditingCollection(null);
  };

  const handleDeleteCollection = async (collectionId: string, collectionTitle?: string) => {
    const confirmed = await confirmation.confirm({
      title: 'Delete Collection',
      message: `Are you sure you want to permanently delete the collection${collectionTitle ? ` "${collectionTitle}"` : ''}? This action cannot be undone.`,
      confirmText: 'Delete Collection',
      cancelText: 'Cancel',
      variant: 'destructive',
    });

    if (!confirmed) return;

    const { error } = await apiRequest(`/api/admin/collection?id=${encodeURIComponent(collectionId)}`, { method: 'DELETE', showLoadingBar: true });
    if (error) return showToast({ type: 'error', title: 'Error', description: error });
    await fetchCollections();
    showToast({ title: 'Success', description: 'Collection deleted successfully' });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleShowAddForm = () => setShowAddForm(true);
  const handleHideAddForm = () => setShowAddForm(false);
  const handleStartEditing = (collection: Collection) => setEditingCollection(collection);
  const handleStopEditing = () => setEditingCollection(null);

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingCollection(null);
  };

  const isFormVisible = showAddForm || !!editingCollection;
  const currentCollection = editingCollection;
  const collectionsCount = filteredCollections.length;
  const collectionsCountText = `${collectionsCount} collection${collectionsCount !== 1 ? 's' : ''} found`;

  return {
    // State
    searchQuery,
    showAddForm,
    editingCollection,
    filteredCollections,
    collections,
    confirmation,

    // Handlers
    handleSearchChange,
    handleAddCollection,
    handleEditCollection,
    handleDeleteCollection,
    handleShowAddForm,
    handleHideAddForm,
    handleStartEditing,
    handleStopEditing,
    handleCancelForm,
    fetchCollections,

    // Legacy handlers (for backward compatibility)
    setShowAddForm,
    setEditingCollection,

    // Computed values
    isFormVisible,
    currentCollection,
    collectionsCountText
  };
};
  