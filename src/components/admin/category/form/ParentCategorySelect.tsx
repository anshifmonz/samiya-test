import React from 'react';
import { Category } from '@/data/categories';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';

interface ParentCategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  categories: Category[];
  currentCategory?: Category | null;
}

const ParentCategorySelect: React.FC<ParentCategorySelectProps> = ({
  value,
  onChange,
  categories,
  currentCategory
}) => {
  const getAvailableParents = () => {
    // When editing, exclude the category itself and its descendants from parent options
    if (currentCategory) {
      const excludeIds = new Set([currentCategory.id]);
      const addDescendants = (parentId: string) => {
        categories.forEach(c => {
          if (c.parentId === parentId) {
            excludeIds.add(c.id);
            addDescendants(c.id);
          }
        });
      };
      addDescendants(currentCategory.id);

      return categories.filter(c => !excludeIds.has(c.id));
    }

    return categories;
  };

  const availableParents = getAvailableParents();

  return (
    <div>
      <label className="block luxury-subheading text-sm text-luxury-black mb-2">
        Parent Category
      </label>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-full px-4 py-3 luxury-body text-sm rounded-xl bg-luxury-cream/50 text-luxury-black border border-luxury-gray/20 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:border-luxury-gold/30 transition-all duration-300">
          <SelectValue placeholder="Select parent category (optional)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No Parent (Root Category)</SelectItem>
          {availableParents.map((parent) => (
            <SelectItem key={parent.id} value={parent.id}>
              {parent.path.join(' → ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="luxury-body text-luxury-gray/70 text-sm mt-2">
        Leave empty to create a root category
      </p>
    </div>
  );
};

export default ParentCategorySelect;
