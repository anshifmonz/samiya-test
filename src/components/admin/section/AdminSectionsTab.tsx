import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import { type Section, type SectionWithProducts, type SectionProductItem } from '@/types/section';
import { type Product } from '@/types/product';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Switch } from 'components/ui/switch';
import CarouselWrapper from 'components/home/shared/CarouselWrapper';
import ProductSearchModal from './ProductSearchModal';
import SectionProductCard from './SectionProductCard';
import AdminTabHeaderButton from '../shared/AdminTabHeaderButton';

interface AdminSectionsTabProps {
  sections: SectionWithProducts[];
  products: Product[];
  onAddSection: (section: Omit<Section, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditSection: (section: Section) => void;
  onDeleteSection: (sectionId: string) => void;
  onAddProductToSection: (sectionId: string, productId: string) => void;
  onRemoveProductFromSection: (sectionId: string, productId: string) => void;
}

const AdminSectionsTab: React.FC<AdminSectionsTabProps> = ({
  sections,
  products,
  onAddSection,
  onEditSection,
  onDeleteSection,
  onAddProductToSection,
  onRemoveProductFromSection
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [searchModalOpen, setSearchModalOpen] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const startEditing = (section: Section) => {
    setEditingSection(section.id);
    setEditingTitle(section.title);
  };

  const saveEdit = () => {
    if (editingSection && editingTitle.trim()) {
      const section = sections.find(s => s.id === editingSection);
      if (section) {
        onEditSection({ ...section, title: editingTitle.trim() });
      }
    }
    setEditingSection(null);
    setEditingTitle('');
  };

  const cancelEdit = () => {
    setEditingSection(null);
    setEditingTitle('');
  };

  const handleAddSection = () => {
    if (newSectionTitle.trim()) {
      onAddSection({
        title: newSectionTitle.trim(),
        isActive: true,
        sortOrder: 0
      });
      setNewSectionTitle('');
      setShowAddSection(false);
    }
  };

  const handleToggleActive = (section: Section) => {
    onEditSection({ ...section, isActive: !section.isActive });
  };

  const getSectionProducts = (section: SectionWithProducts): SectionProductItem[] => {
    return section.products || [];
  };

  const handleProductSelect = (productId: string) => {
    if (searchModalOpen) {
      onAddProductToSection(searchModalOpen, productId);
      setSearchModalOpen(null);
    }
  };

  const getExistingProductIds = (sectionId: string): string[] => {
    const section = sections.find(s => s.id === sectionId);
    return section ? section.products.map(p => p.id) : [];
  };

  const handleRemoveProduct = (sectionId: string, productId: string) => {
    onRemoveProductFromSection(sectionId, productId);
  };

  return (
    <div className="space-y-6">
      {/* Add Section Button */}
      <div className="flex justify-between items-center">
        <h3 className="luxury-heading text-xl text-luxury-black">Manage Sections</h3>
        <AdminTabHeaderButton
          onClick={() => setShowAddSection(true)}
          label="Add Section"
        >
          <Plus size={16} />
        </AdminTabHeaderButton>
      </div>

      {showAddSection && (
        <div className="bg-luxury-cream/50 border border-luxury-gray/20 rounded-lg p-4 space-y-3">
          <Input
            placeholder="Enter section title..."
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            className="border-luxury-gray/30 focus:border-luxury-gold"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddSection();
              if (e.key === 'Escape') setShowAddSection(false);
            }}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleAddSection}
              disabled={!newSectionTitle.trim()}
              className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-black px-4 py-2 rounded-lg"
            >
              Add Section
            </Button>
            <Button
              onClick={() => setShowAddSection(false)}
              variant="outline"
              className="border-luxury-gray/30 text-luxury-gray hover:text-luxury-black"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Sections List */}
      <div className="space-y-4">
        {sections.length === 0 ? (
          <div className="text-center py-12 text-luxury-gray">
            <p className="luxury-body text-lg">No sections created yet.</p>
            <p className="luxury-body text-sm mt-2">Click "Add Section" to get started.</p>
          </div>
        ) : (
          sections.map((section) => {
            const isExpanded = expandedSections.has(section.id);
            const sectionProducts = getSectionProducts(section);
            const isEditing = editingSection === section.id;

            return (
              <div
                key={section.id}
                className="bg-white border border-luxury-gray/20 rounded-lg overflow-hidden shadow-sm"
              >
                <div className="p-2 sm:p-4 bg-luxury-cream/30">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center xs:gap-1 gap-3 flex-1">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="text-luxury-gray hover:text-luxury-black transition-colors duration-200 flex-shrink-0"
                      >
                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </button>

                      {isEditing ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="border-luxury-gray/30 focus:border-luxury-gold flex-1"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit();
                              if (e.key === 'Escape') cancelEdit();
                            }}
                            autoFocus
                          />
                          <Button
                            onClick={saveEdit}
                            size="sm"
                            className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-black"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={cancelEdit}
                            size="sm"
                            variant="outline"
                            className="border-luxury-gray/30"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <h4 className="luxury-heading xs:text-base text-lg text-luxury-black flex-1">
                          {section.title}
                        </h4>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {!isEditing && (
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={section.isActive ?? true}
                            onCheckedChange={() => handleToggleActive(section)}
                            className="data-[state=checked]:bg-luxury-gold"
                          />
                          <span className="luxury-body text-sm text-luxury-gray">
                            {section.isActive ?? true ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-0">
                          <Button
                            onClick={() => startEditing(section)}
                            size="sm"
                            variant="ghost"
                            className="text-luxury-gray hover:text-luxury-black xs:w-4 w-6 sm:w-10"
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            onClick={() => onDeleteSection(section.id)}
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 xs:w-4 w-6 sm:w-10"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section Content */}
                {isExpanded && (
                  <div className="p-0 pr-2 sm:p-4 space-y-4">
                    {/* Add Product Button */}
                    <div className="flex justify-between items-center pl-4">
                      <span className="luxury-body text-sm text-luxury-gray">
                        {sectionProducts.length} product{sectionProducts.length !== 1 ? 's' : ''}
                      </span>
                      <AdminTabHeaderButton
                        onClick={() => setSearchModalOpen(section.id)}
                        label="Add Product"
                        className="px-3 py-1 text-xs"
                      >
                        <Plus size={14} />
                      </AdminTabHeaderButton>
                    </div>

                    {/* Products Carousel */}
                    {sectionProducts.length > 0 ? (
                      <CarouselWrapper className="w-full">
                        {sectionProducts.map((product) => (
                          <SectionProductCard
                            key={product.id}
                            product={product}
                            onRemove={() => handleRemoveProduct(section.id, product.id)}
                          />
                        ))}
                      </CarouselWrapper>
                    ) : (
                      <div className="text-center py-8 text-luxury-gray">
                        <p className="luxury-body text-sm">No products in this section yet.</p>
                        <p className="luxury-body text-xs mt-1">Click "Add Product" to get started.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Product Search Modal */}
      {searchModalOpen && (
        <ProductSearchModal
          isOpen={!!searchModalOpen}
          onClose={() => setSearchModalOpen(null)}
          onProductSelect={handleProductSelect}
          existingProductIds={getExistingProductIds(searchModalOpen)}
        />
      )}
    </div>
  );
};

export default AdminSectionsTab;
