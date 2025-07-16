import React, { useState } from 'react';
import AdminSearchBar from '../AdminSearchBar';
import AdminCollectionGrid from './AdminCollectionGrid';
import AdminCollectionForm from './AdminCollectionForm';
import AdminTabHeader from '../shared/AdminTabHeader';
import { Plus } from 'lucide-react';
import { type Collection } from '@/types/collection';

interface AdminCollectionsTabProps {
  collections: Collection[];
  onAddCollection: (collection: Omit<Collection, 'id'>) => void;
  onEditCollection: (collection: Collection) => void;
  onDeleteCollection: (collectionId: string) => void;
  isSuperAdmin: boolean;
}

const AdminCollectionsTab: React.FC<AdminCollectionsTabProps> = ({
  collections,
  onAddCollection,
  onEditCollection,
  onDeleteCollection,
  isSuperAdmin
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  const filteredCollections = collections.filter(collection =>
    collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCollection = (newCollection: Omit<Collection, 'id'>) => {
    onAddCollection(newCollection);
    setShowAddForm(false);
  };

  const handleEditCollection = (updatedCollection: Collection) => {
    onEditCollection(updatedCollection);
    setEditingCollection(null);
  };

  return (
    <div>
      <AdminTabHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={() => setShowAddForm(true)}
        addLabel="Add Collection"
      >
        <Plus size={20} />
      </AdminTabHeader>

      <div className="mb-6">
        <p className="luxury-subheading text-luxury-gold text-sm tracking-wider">
          {filteredCollections.length} collection{filteredCollections.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <AdminCollectionGrid
        collections={filteredCollections}
        onEdit={setEditingCollection}
        onDelete={onDeleteCollection}
        isSuperAdmin={isSuperAdmin}
      />

      {(showAddForm || editingCollection) && (
        <AdminCollectionForm
          collection={editingCollection}
          onSave={editingCollection ? handleEditCollection : handleAddCollection}
          onCancel={() => {
            setShowAddForm(false);
            setEditingCollection(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminCollectionsTab;
