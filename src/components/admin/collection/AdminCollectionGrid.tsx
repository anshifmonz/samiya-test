import AdminCollectionCard from './AdminCollectionCard';
import { useCollectionsTab } from 'contexts/admin/CollectionsTabContext';

const AdminCollectionGrid: React.FC = () => {
  const { filteredCollections } = useCollectionsTab();

  if (filteredCollections.length === 0) {
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
      {filteredCollections.map((collection) => (
        <AdminCollectionCard
          key={collection.id}
          collection={collection}
        />
      ))}
    </div>
  );
};

export default AdminCollectionGrid;
