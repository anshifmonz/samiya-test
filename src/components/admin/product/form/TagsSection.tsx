import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface TagsSectionProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagsSection: React.FC<TagsSectionProps> = ({ tags, onTagsChange }) => {
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      onTagsChange([...tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <label className="block luxury-subheading text-luxury-black mb-2 tracking-wider">
        Tags
      </label>
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-luxury-gray/30 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50"
          />
          <button
            type="button"
            onClick={addTag}
            className="bg-luxury-gold text-luxury-black px-4 py-2 rounded-lg hover:bg-luxury-gold-light transition-colors duration-200"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-luxury-cream text-luxury-gray px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-red-500 hover:text-red-700 transition-colors duration-200"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagsSection;
