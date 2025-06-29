import React from 'react';
import { Folder } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <Folder size={48} className="mx-auto text-luxury-gray/40 mb-4" />
      <h3 className="luxury-subheading text-luxury-gray text-lg mb-2">
        No categories found
      </h3>
      <p className="luxury-body text-luxury-gray/70">
        Start by adding your first category to organize your products.
      </p>
    </div>
  );
};

export default EmptyState;
