import React from 'react';
import AdminCollectionCard from './AdminCollectionCard';
import { type Collection } from '@/types/collection';

interface AdminCollectionGridProps {
  collections: Collection[];
  onEdit: (collection: Collection) => void;
  onDelete: (collectionId: string) => void;
}

const AdminCollectionGrid: React.FC<AdminCollectionGridProps> = ({ collections, onEdit, onDelete }) => {
  if (collections.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="luxury-card rounded-2xl p-12 max-w-md mx-auto">
          <h3 className="luxury-heading text-xl text-luxury-black mb-4">No collections found</h3>
          <p className="luxury-body text-luxury-gray">
            Try adjusting your search criteria or add a new collection.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {collections.map((collection) => (
        <AdminCollectionCard
          key={collection.id}
          collection={collection}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default AdminCollectionGrid;
