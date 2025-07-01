import React from 'react';
import { type Category } from '@/types/category';
import { Edit, Trash2, ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react';
import { Card, CardContent } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';

interface CategoryCardProps {
  category: Category;
  hasChildren: boolean;
  isExpanded: boolean;
  indentationClass: string;
  onToggleExpanded: () => void;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  hasChildren,
  isExpanded,
  indentationClass,
  onToggleExpanded,
  onEdit,
  onDelete
}) => {
  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${indentationClass}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              {hasChildren ? (
                <button
                  onClick={onToggleExpanded}
                  className="p-1 hover:bg-luxury-gray/10 rounded transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown size={16} className="text-luxury-gold" />
                  ) : (
                    <ChevronRight size={16} className="text-luxury-gold" />
                  )}
                </button>
              ) : (
                <div className="w-6" />
              )}

              {isExpanded ? (
                <FolderOpen size={20} className="text-luxury-gold" />
              ) : (
                <Folder size={20} className="text-luxury-gold" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="luxury-subheading text-luxury-black font-medium">
                  {category.name}
                </h3>
                <Badge
                  variant={category.isActive ? "default" : "secondary"}
                  className={category.isActive ? "bg-luxury-gold text-luxury-black" : "bg-luxury-gray/20"}
                >
                  {category.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Level {category.level}
                </Badge>
              </div>

              {category.description && (
                <p className="luxury-body text-luxury-gray text-sm mt-1">
                  {category.description}
                </p>
              )}

              <div className="flex items-center gap-2 mt-2">
                <span className="luxury-body text-luxury-gray/70 text-xs">
                  Path: {category.path.join(' → ')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(category)}
              className="text-luxury-gold hover:text-luxury-black hover:bg-luxury-gold/10"
            >
              <Edit size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(category.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
