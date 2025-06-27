
import React from 'react';
import { Product } from '../../data/products';
import { Edit, Trash } from 'lucide-react';

interface AdminProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const AdminProductCard: React.FC<AdminProductCardProps> = ({ product, onEdit, onDelete }) => {
  const firstImage = Object.values(product.images)[0]?.[0]; // Get first image from first color

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${product.title}"?`)) {
      onDelete(product.id);
    }
  };

  return (
    <div className="luxury-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-luxury-gray/10 hover:border-luxury-gold/30 bg-white/95 backdrop-blur-md group">
      <div className="relative overflow-hidden">
        <img
          src={firstImage}
          alt={product.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Admin Actions Overlay */}
        <div className="absolute inset-0 bg-luxury-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={() => onEdit(product)}
            className="bg-white text-luxury-black p-2 rounded-lg hover:bg-luxury-gold-light transition-colors duration-200 shadow-lg"
            title="Edit Product"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-lg"
            title="Delete Product"
          >
            <Trash size={18} />
          </button>
        </div>

        {/* Product ID Badge */}
        <div className="absolute top-3 left-3 bg-luxury-black/80 text-white px-3 py-1 rounded-full">
          <span className="luxury-body text-xs font-medium">ID: {product.id}</span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 right-3 glass rounded-full px-3 py-1">
          <span className="luxury-subheading text-xs text-white font-light tracking-wider">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="luxury-heading text-lg text-luxury-black mb-3 line-clamp-2">
          {product.title}
        </h3>

        <p className="luxury-body text-sm text-luxury-gray mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="luxury-heading text-xl text-luxury-gold">
            ₹{product.price.toLocaleString()}
          </span>

          {/* Color Swatches */}
          <div className="flex gap-1">
            {Object.keys(product.images).slice(0, 3).map(color => (
              <div
                key={color}
                className="w-3 h-3 rounded-full border border-white shadow-sm ring-1 ring-luxury-gray/20"
                style={{
                  backgroundColor: color === 'cream' ? '#F5F5DC' :
                                 color === 'navy' ? '#000080' :
                                 color === 'red' ? '#DC2626' :
                                 color === 'green' ? '#059669' :
                                 color === 'blue' ? '#2563EB' :
                                 color === 'purple' ? '#7C3AED' :
                                 color === 'pink' ? '#EC4899' :
                                 color === 'yellow' ? '#EAB308' :
                                 color === 'orange' ? '#EA580C' :
                                 color === 'brown' ? '#92400E' :
                                 color === 'gray' ? '#6B7280' :
                                 color === 'black' ? '#000000' :
                                 color === 'white' ? '#FFFFFF' : color
                }}
                title={color.charAt(0).toUpperCase() + color.slice(1)}
              />
            ))}
            {Object.keys(product.images).length > 3 && (
              <span className="text-xs text-luxury-gray">+{Object.keys(product.images).length - 3}</span>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {product.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-luxury-cream text-luxury-gray text-xs rounded-full luxury-body border border-luxury-gray/20"
            >
              {tag}
            </span>
          ))}
          {product.tags.length > 3 && (
            <span className="px-2 py-1 text-luxury-gray text-xs">+{product.tags.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductCard;
