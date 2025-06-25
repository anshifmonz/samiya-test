
import React from 'react';
import { Product } from '../../data/products';
import AdminProductCard from './AdminProductCard';

interface AdminProductGridProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const AdminProductGrid: React.FC<AdminProductGridProps> = ({ products, onEdit, onDelete }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="luxury-card rounded-2xl p-12 max-w-md mx-auto">
          <h3 className="luxury-heading text-xl text-luxury-black mb-4">No products found</h3>
          <p className="luxury-body text-luxury-gray">
            Try adjusting your search criteria or add a new product.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => (
        <AdminProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default AdminProductGrid;
