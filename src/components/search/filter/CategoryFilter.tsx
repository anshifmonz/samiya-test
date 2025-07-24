import { type Category } from 'types/category';
import { Checkbox } from 'ui/checkbox';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  availableCategories?: string[];
  categories: Category[];
  categoryCountMap?: Map<string, number>;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onCategoryChange, availableCategories, categories, categoryCountMap }) => {
  const handleCategoryClick = (categoryName: string) => {
    onCategoryChange(categoryName);
  };

  const getCategoryCount = (categoryName: string): number => {
    const category = categories.find(cat => cat.name === categoryName);
    if (category && categoryCountMap) {
      return categoryCountMap.get(category.id) || 0;
    }
    return 0;
  };

  const getTotalCount = (): number => {
    return categoryCountMap ? Array.from(categoryCountMap.values()).reduce((sum, count) => sum + count, 0) : 0;
  };

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-foreground">Categories</h3>
      <div className="space-y-2">
        {/* All Categories option */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="all-categories"
            checked={selectedCategory === 'all'}
            onCheckedChange={() => handleCategoryClick('all')}
          />
          <label
            htmlFor="all-categories"
            className="text-sm font-normal cursor-pointer flex-1 flex justify-between"
          >
            <span>All Categories</span>
            <span className="text-muted-foreground">({getTotalCount()})</span>
          </label>
        </div>

        {/* Available categories from search results */}
        {availableCategories && availableCategories.map((categoryName) => (
          <div key={categoryName} className="flex items-center space-x-2">
            <Checkbox
              id={`category-${categoryName}`}
              checked={selectedCategory === categoryName}
              onCheckedChange={() => handleCategoryClick(categoryName)}
            />
            <label
              htmlFor={`category-${categoryName}`}
              className="text-sm font-normal cursor-pointer flex-1 flex justify-between"
            >
              <span>{categoryName}</span>
              <span className="text-muted-foreground">({getCategoryCount(categoryName)})</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
