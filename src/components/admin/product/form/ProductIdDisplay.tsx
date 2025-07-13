import React from 'react';

interface ProductIdDisplayProps {
  productId?: string | number;
}

const ProductIdDisplay: React.FC<ProductIdDisplayProps> = ({ productId }) => {
  if (!productId) return null;

  return (
    <div className="mb-4">
      <label className="block luxury-subheading text-sm text-luxury-gray mb-2">
        Product ID
      </label>
      <div className="w-full px-4 py-3 luxury-body text-sm rounded-xl bg-luxury-gray/10 text-luxury-gray border border-luxury-gray/20 cursor-not-allowed">
        {productId}
      </div>
    </div>
  );
};

export default ProductIdDisplay;
