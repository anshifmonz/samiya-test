import React, { useState } from 'react';
import AdminSearchBar from '../AdminSearchBar';
import AdminCollectionGrid from './AdminCollectionGrid';
import AdminCollectionForm from './AdminCollectionForm';
import { Plus } from 'lucide-react';
import { type Collection } from '@/types/collection';

interface AdminCollectionsTabProps {
  collections: Collection[];
  onAddCollection: (collection: Omit<Collection, 'id'>) => void;
  onEditCollection: (collection: Collection) => void;
  onDeleteCollection: (collectionId: string) => void;
}

const AdminCollectionsTab: React.FC<AdminCollectionsTabProps> = ({
  collections,
  onAddCollection,
  onEditCollection,
  onDeleteCollection
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
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
        <div className="flex-1 max-w-2xl">
          <AdminSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="luxury-btn-primary px-6 py-3 rounded-xl font-medium text-sm tracking-wider uppercase shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Collection
        </button>
      </div>

      <div className="mb-6">
        <p className="luxury-subheading text-luxury-gold text-sm tracking-wider">
          {filteredCollections.length} collection{filteredCollections.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <AdminCollectionGrid
        collections={filteredCollections}
        onEdit={setEditingCollection}
        onDelete={onDeleteCollection}
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
