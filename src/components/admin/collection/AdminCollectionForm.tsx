import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { type Collection } from '@/types/collection';
import {
  CollectionTitleInput,
  DescriptionTextarea,
  ImageUrlInput,
  ActionButtons
} from './form';

interface AdminCollectionFormProps {
  collection?: Collection | null;
  onSave: (collection: Collection | Omit<Collection, 'id'>) => void;
  onCancel: () => void;
}

const AdminCollectionForm: React.FC<AdminCollectionFormProps> = ({ collection, onSave, onCancel }) => {
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
    if (collection) {
      setFormData({
        title: collection.title,
        description: collection.description,
        image: collection.image
      });
    }
  }, [collection]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (collection) {
      onSave({ ...formData, id: collection.id });
    } else {
      onSave(formData);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-luxury-gray/20 p-6 flex items-center justify-between z-[9999]">
          <h2 className="luxury-heading text-2xl text-luxury-black">
            {collection ? 'Edit Collection' : 'Add New Collection'}
          </h2>
          <button
            onClick={onCancel}
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
            onCancel={onCancel}
            isEditing={!!collection}
          />
        </form>
      </div>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
};

export default AdminCollectionForm;
