import React from 'react';

interface ProductDetailsProps {
  product: any;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  return (
    <div className="space-y-8 flex flex-col justify-center">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-luxury-gold/10 text-luxury-gold px-4 py-2 rounded-full luxury-body text-sm font-medium border border-luxury-gold/20">
            {product.category}
          </span>
        </div>
        <h1 className="luxury-heading text-3xl lg:text-4xl font-light text-luxury-black mb-4 leading-tight">
          {product.title}
        </h1>
        <p className="text-3xl lg:text-4xl font-light text-luxury-gold mb-2">
          ₹{product.price.toLocaleString()}
        </p>
      </div>
      <div>
        <h3 className="luxury-subheading text-luxury-black mb-4">Description</h3>
        <p className="luxury-body text-luxury-gray leading-relaxed">
          {product.description}
        </p>
      </div>
      <div className="pt-6">
        <button className="w-full luxury-btn-primary py-4 px-8 rounded-2xl luxury-body text-lg font-medium transition-all duration-300">
          Contact for Purchase
        </button>
        <p className="luxury-body text-sm text-luxury-gray mt-4 text-center">
          Call us at +91 9876543210 or visit our store
        </p>
      </div>
    </div>
  );
};

export default ProductDetails;
