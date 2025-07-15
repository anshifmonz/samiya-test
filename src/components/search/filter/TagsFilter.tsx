import { Badge } from 'ui/badge';

interface TagsFilterProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  availableTags?: string[];
}

const TagsFilter: React.FC<TagsFilterProps> = ({ selectedTags, onTagToggle, availableTags }) => {
  const defaultTags = ['wedding', 'festive', 'silk', 'cotton', 'traditional', 'formal', 'office', 'embroidery', 'kids'];

  // set available tags if provided, otherwise use default tags
  const tags = availableTags && availableTags.length > 0 ? availableTags : defaultTags;

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-foreground">Tags</h3>
      <div className="space-y-2">
        {tags.map(tag => {
          const isSelected = selectedTags.includes(tag);
          return (
            <Badge
              key={tag}
              variant={isSelected ? "default" : "secondary"}
              className="cursor-pointer justify-between w-full py-2 px-3 text-sm transition-colors"
              onClick={() => onTagToggle(tag)}
            >
              <span>{tag}</span>
              <span className="ml-2">(0)</span>
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default TagsFilter;
