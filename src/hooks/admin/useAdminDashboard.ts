import { useState } from 'react';
import { type Collection } from 'types/collection';
import { showToast } from 'hooks/ui/use-toast';
import { apiRequest } from 'utils/apiRequest';
import { useConfirmation } from 'hooks/useConfirmation';

interface UseAdminDashboardProps {
  initialCollections: Collection[];
}

export const useAdminDashboard = ({
  initialCollections
}: UseAdminDashboardProps) => {
  const [collectionList, setCollectionList] = useState<Collection[]>(initialCollections);
  const confirmation = useConfirmation();

  // Collection handlers with API calls
  const fetchCollections = async () => {
const { data } = await apiRequest('/api/admin/collection', { showLoadingBar: true });
    if (data) {
      setCollectionList(data.collections);
    }
  };

  const handleAddCollection = async (newCollection: Omit<Collection, 'id'>) => {
const { error } = await apiRequest('/api/admin/collection', { method: 'POST', body: newCollection, showLoadingBar: true });
    if (!error) {
      await fetchCollections();
      showToast({ title: 'Success', description: 'Collection added successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  const handleEditCollection = async (updatedCollection: Collection) => {
const { error } = await apiRequest('/api/admin/collection', { method: 'PUT', body: updatedCollection, showLoadingBar: true });
    if (!error) {
      await fetchCollections();
      showToast({ title: 'Success', description: 'Collection updated successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
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
    if (!error) {
      await fetchCollections();
      showToast({ title: 'Success', description: 'Collection deleted successfully' });
    } else {
      showToast({ type: 'error', title: 'Error', description: error });
    }
  };

  return {
    collectionList,
    handleAddCollection,
    handleEditCollection,
    handleDeleteCollection,
    confirmation,
  };
};
