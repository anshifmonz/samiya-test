import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import CollectionTitleInput from './form/CollectionTitleInput';
import DescriptionTextarea from './form/DescriptionTextarea';
import ImageUrlInput from './form/ImageUrlInput';
import ActionButtons from './form/ActionButtons';
import { useCollectionsTab } from 'contexts/admin/CollectionsTabContext';

const AdminCollectionForm: React.FC = () => {
  const { currentCollection, handleAddCollection, handleEditCollection, handleCancelForm } = useCollectionsTab();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (currentCollection) {
      setFormData({
        title: currentCollection.title,
        description: currentCollection.description,
        image: currentCollection.image
      });
    }
  }, [currentCollection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCollection) {
      await handleEditCollection({ ...formData, id: currentCollection.id });
    } else {
      await handleAddCollection(formData);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-luxury-gray/20 p-6 flex items-center justify-between z-[9999]">
          <h2 className="luxury-heading text-2xl text-luxury-black">
            {currentCollection ? 'Edit Collection' : 'Add New Collection'}
          </h2>
          <button
            onClick={handleCancelForm}
            className="text-luxury-gray hover:text-luxury-black transition-colors duration-200"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-3 sm:p-6 space-y-6">
          <CollectionTitleInput
            value={formData.title}
            onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
          />

          <DescriptionTextarea
            value={formData.description}
            onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
          />

          <ImageUrlInput
            value={formData.image}
            onChange={(value) => setFormData(prev => ({ ...prev, image: value }))}
          />

          <ActionButtons
            onCancel={handleCancelForm}
            isEditing={!!currentCollection}
          />
        </form>
      </div>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
};

export default AdminCollectionForm;
