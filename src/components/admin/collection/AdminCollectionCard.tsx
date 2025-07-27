import { Edit, Trash } from 'lucide-react';
import Image from 'next/image';
import { type Collection } from 'types/collection';
import { useCollectionsTab } from 'contexts/admin/CollectionsTabContext';
import { useCurrentAdmin } from 'contexts/admin/AdminDashboardContext';

interface AdminCollectionCardProps {
  collection: Collection;
}

const AdminCollectionCard: React.FC<AdminCollectionCardProps> = ({ collection }) => {
  const { handleStartEditing, handleDeleteCollection } = useCollectionsTab();
  const { isSuperAdmin } = useCurrentAdmin();

  const handleEdit = () => handleStartEditing(collection);
  const handleDelete = isSuperAdmin ? async () => await handleDeleteCollection(collection.id, collection.title) : undefined;
  return (
    <div className="luxury-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-luxury-gray/10 hover:border-luxury-gold/30 bg-white/95 backdrop-blur-md group">
      <div className="relative overflow-hidden aspect-[4/3]">
        <Image
          src={collection.image}
          alt={collection.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          width={400}
          height={300}
        />

        <div className="absolute inset-0 bg-luxury-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={handleEdit}
            className="bg-white text-luxury-black p-2 rounded-lg hover:bg-luxury-gold-light transition-colors duration-200 shadow-lg"
            title="Edit Collection"
          >
            <Edit size={18} />
          </button>
          {handleDelete && (
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-lg"
              title="Delete Collection"
            >
              <Trash size={18} />
            </button>
          )}
        </div>

        <div className="absolute top-3 left-3 bg-luxury-black/80 text-white px-3 py-1 rounded-full">
          <span className="luxury-body text-xs font-medium">ID: {collection.id}</span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="luxury-heading text-lg text-luxury-black mb-3 line-clamp-2">
          {collection.title}
        </h3>

        <p className="luxury-body text-sm text-luxury-gray mb-4 line-clamp-3">
          {collection.description}
        </p>
      </div>
    </div>
  );
};

export default AdminCollectionCard;
