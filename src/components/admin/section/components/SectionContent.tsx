import React from 'react';
import { Plus } from 'lucide-react';
import { type SectionWithProducts, type SectionProductItem } from 'types/section';
import AdminTabHeaderButton from '../../shared/AdminTabHeaderButton';
import ProductsCarousel from './ProductsCarousel';

interface SectionContentProps {
  section: SectionWithProducts;
  sectionProducts: SectionProductItem[];
  onAddProduct: (sectionId: string) => void;
  onRemoveProduct: (sectionId: string, productId: string, productTitle?: string, sectionTitle?: string) => void;
  onProductDragEnd: (event: any, section: SectionWithProducts) => void;
}

const SectionContent: React.FC<SectionContentProps> = ({
  section,
  sectionProducts,
  onAddProduct,
  onRemoveProduct,
  onProductDragEnd
}) => {
  return (
    <div className="p-0 pr-2 sm:p-4 space-y-4">
      {/* Add Product Button */}
      <div className="flex justify-between items-center pl-4">
        <span className="luxury-body text-sm text-luxury-gray">
          {sectionProducts.length} product{sectionProducts.length !== 1 ? 's' : ''}
        </span>
        <AdminTabHeaderButton
          onClick={() => onAddProduct(section.id)}
          label="Add Product"
          className="px-3 py-1 text-xs"
        >
          <Plus size={14} />
        </AdminTabHeaderButton>
      </div>

      {/* Products Carousel */}
      <ProductsCarousel
        section={section}
        sectionProducts={sectionProducts}
        onDragEnd={onProductDragEnd}
        onRemoveProduct={onRemoveProduct}
      />
    </div>
  );
};

export default SectionContent;
