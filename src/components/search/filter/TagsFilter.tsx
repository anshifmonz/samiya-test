import React from 'react';

interface TagsFilterProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

const TagsFilter: React.FC<TagsFilterProps> = ({ selectedTags, onTagToggle }) => {
  const tags = ['wedding', 'festive', 'silk', 'cotton', 'traditional', 'formal', 'office', 'embroidery', 'kids'];

  return (
    <div>
      <h3 className="luxury-subheading text-luxury-black mb-4 tracking-wider">Tags</h3>
      <div className="space-y-3">
        {tags.map(tag => {
          const isSelected = selectedTags.includes(tag);
          return (
            <label key={tag} className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onTagToggle(tag)}
                className="w-4 h-4 text-luxury-gold border-2 border-luxury-gray/30 focus:ring-luxury-gold/50 focus:ring-2 transition-all duration-200 rounded-sm cursor-pointer"
              />
              <span className={`luxury-body font-medium capitalize transition-colors duration-200 ${
                isSelected
                  ? 'text-luxury-gold'
                  : 'text-luxury-gray group-hover:text-luxury-gold'
              }`}>
                {tag}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default TagsFilter;
