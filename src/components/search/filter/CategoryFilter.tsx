import React from 'react';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onCategoryChange }) => {
  const categories = ['all', 'Gents', 'Women', 'Kids'];

  return (
    <div>
      <h3 className="luxury-subheading text-luxury-black mb-4 tracking-wider">Category</h3>
      <div className="space-y-3">
        {categories.map(category => (
          <label key={category} className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="radio"
              name="category"
              value={category}
              checked={selectedCategory === category}
              onChange={() => onCategoryChange(category)}
              className="w-4 h-4 text-luxury-gold border-2 border-luxury-gray/30 focus:ring-luxury-gold/50 focus:ring-2 transition-all duration-200"
            />
            <span className="luxury-body text-luxury-gray font-medium capitalize group-hover:text-luxury-gold transition-colors duration-200">
              {category === 'all' ? 'All Categories' : category}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
