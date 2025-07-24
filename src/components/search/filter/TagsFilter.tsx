import { Badge } from 'ui/badge';

interface TagsFilterProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  availableTags?: Array<{ name: string; count: number }>;
}

const TagsFilter: React.FC<TagsFilterProps> = ({ selectedTags, onTagToggle, availableTags }) => {
  const defaultTags = [
    { name: 'wedding', count: 0 },
    { name: 'festive', count: 0 },
    { name: 'silk', count: 0 },
    { name: 'cotton', count: 0 },
    { name: 'traditional', count: 0 },
    { name: 'formal', count: 0 },
    { name: 'office', count: 0 },
    { name: 'embroidery', count: 0 },
    { name: 'kids', count: 0 }
  ];

  // set available tags if provided, otherwise use default tags
  const tags = availableTags && availableTags.length > 0 ? availableTags : defaultTags;

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-foreground">Tags</h3>
      <div className="space-y-2">
        {tags.map(({ name, count }) => {
          const isSelected = selectedTags.includes(name);
          return (
            <Badge
              key={name}
              variant={isSelected ? "default" : "secondary"}
              className="cursor-pointer justify-between w-full py-2 px-3 text-sm transition-colors hover:opacity-80"
              onClick={() => onTagToggle(name)}
            >
              <span className="capitalize">{name}</span>
              <span className="ml-2 text-xs opacity-70">({count})</span>
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default TagsFilter;
