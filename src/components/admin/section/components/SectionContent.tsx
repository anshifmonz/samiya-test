import { Plus } from 'lucide-react';
import { type SectionWithProducts } from 'types/section';
import { useSectionsTab } from 'contexts/admin/SectionsTabContext';
import AdminTabHeaderButton from '../../shared/AdminTabHeaderButton';
import ProductsCarousel from './ProductsCarousel';

interface SectionContentProps {
  section: SectionWithProducts;
}

const SectionContent: React.FC<SectionContentProps> = ({ section }) => {
  const { openSearchModal, getSectionProducts } = useSectionsTab();

  const sectionProducts = getSectionProducts(section);
  return (
    <div className="p-0 pr-2 sm:p-4 space-y-4">
      {/* Add Product Button */}
      <div className="flex justify-between items-center pl-4">
        <span className="luxury-body text-sm text-luxury-gray">
          {sectionProducts.length} product{sectionProducts.length !== 1 ? 's' : ''}
        </span>
        <AdminTabHeaderButton
          onClick={() => openSearchModal(section.id)}
          label="Add Product"
          className="px-3 py-1 text-xs"
        >
          <Plus size={14} />
        </AdminTabHeaderButton>
      </div>

      {/* Products Carousel */}
      <ProductsCarousel
        section={section}
      />
    </div>
  );
};

export default SectionContent;
