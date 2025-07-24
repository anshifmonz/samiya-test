'use client';

import Link from 'next/link';
import Image from 'next/image';
import isCloudinaryUrl from 'utils/isCloudinaryUrls';
import { type SearchProduct, type Product } from 'types/product';
import { Badge } from 'ui/badge';
import { Edit, Trash } from 'lucide-react';
import ImageFallback from './ImageFallback';
import CloudinaryWithFallback from './CloudinaryWithFallback';

type ProductCardProduct = SearchProduct | Product;

interface ProductCardProps {
  product: ProductCardProduct;
  isAdmin?: boolean;
  onEdit?: (product: ProductCardProduct) => void;
  onDelete?: (product: ProductCardProduct) => void;
  showTags?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isAdmin = false,
  onEdit,
  onDelete,
  showTags = false
}) => {
  const firstColorData = Object.values(product.images)[0];
  const firstImageRaw = firstColorData?.images?.[0];
  const firstImage = firstImageRaw?.url;

  const getBadgeVariant = (category: string) => {
    switch (category?.toLowerCase()) {
      case "sale":
        return "destructive";
      case "new":
        return "default";
      case "bestseller":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getColorValue = (color: string) => {
    const colorData = product.images[color];
    if (colorData?.hex && colorData.hex !== '######') {
      return colorData.hex;
    }

    // legacy support
    switch (color.toLowerCase()) {
      case 'cream': return '#F5F5DC';
      case 'navy': return '#000080';
      case 'red': return '#DC2626';
      case 'green': return '#059669';
      case 'blue': return '#2563EB';
      case 'purple': return '#7C3AED';
      case 'pink': return '#EC4899';
      case 'yellow': return '#EAB308';
      case 'orange': return '#EA580C';
      case 'brown': return '#92400E';
      case 'gray': return '#6B7280';
      case 'black': return '#000000';
      case 'white': return '#FFFFFF';
      default: return color;
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(product);
    }
  };

  // Type guards
  const isFullProduct = (p: ProductCardProduct): p is Product => 'short_code' in p && 'categoryId' in p;
  const isSearchProduct = (p: ProductCardProduct): p is SearchProduct => 'category' in p && !('short_code' in p);

  const getShortCode = (p: ProductCardProduct) => {
    if (isFullProduct(p)) return p.short_code;
    return undefined;
  };

  const getOriginalPrice = (p: ProductCardProduct) => {
    if (isFullProduct(p)) return p.originalPrice;
    if (isSearchProduct(p)) return p.original_price;
    return undefined;
  };

  const getCategory = (p: ProductCardProduct) => {
    if (isFullProduct(p)) return p.categoryId;
    if (isSearchProduct(p)) return p.categoryId;
    return undefined;
  };

  const getTags = (p: ProductCardProduct) => {
    if ('tags' in p && Array.isArray(p.tags)) return p.tags;
    return [];
  };

  const CardContent = () => (
    <div className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-[var(--product-card-shadow-hover)] transition-all duration-300">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        {firstImage ? (
          isCloudinaryUrl(firstImage) ? (
            <CloudinaryWithFallback
              src={firstImage}
              alt={getCategory(product) ? `${product.title} (category: ${getCategory(product)})` : product.title}
              width={400}
              height={500}
              sizes="(max-width: 600px) 100vw, 400px"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              priority
            />
          ) : (
            <Image
              src={firstImage}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              width={400}
              height={500}
              priority
            />
          )
        ) : (
          <ImageFallback />
        )}

        {/* Admin Actions Overlay */}
        {isAdmin && onEdit && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <button
              onClick={() => onEdit(product)}
              className="bg-white text-black p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
              title="Edit Product"
            >
              <Edit size={18} />
            </button>
            {onDelete && (
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-lg"
              title="Delete Product"
              >
                <Trash size={18} />
              </button>
            )}
          </div>
        )}

        {/* Short Code Badge */}
        {getShortCode(product) && (
          <Badge
            variant={getBadgeVariant(getShortCode(product)!)}
            className="absolute top-2 left-2"
          >
            {getShortCode(product)}
          </Badge>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-medium text-foreground line-clamp-2 text-sm">
          {product.title}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-foreground">
              <span className="mr-2">₹{product.price.toFixed(2)}</span>
              {getOriginalPrice(product) && getOriginalPrice(product)! > product.price && (
                <span className="line-through text-xs">₹{getOriginalPrice(product)!.toFixed(2)}</span>
              )}
            </span>
          </div>

          {/* color swatches */}
          {Object.keys(product.images).length > 0 && (
            <div className="flex gap-1">
              {Object.keys(product.images).slice(0, 3).map(color => (
                <div
                  key={color}
                  className="w-3 h-3 rounded-full border border-white shadow-sm ring-1 ring-gray-200"
                  style={{
                    backgroundColor: getColorValue(color)
                  }}
                  title={color.charAt(0).toUpperCase() + color.slice(1)}
                />
              ))}
              {Object.keys(product.images).length > 3 && (
                <span className="text-xs text-muted-foreground ml-1">
                  +{Object.keys(product.images).length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Tags (Admin only) */}
        {isAdmin && showTags && getTags(product).length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {getTags(product).slice(0, 3).map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full border"
              >
                {tag}
              </span>
            ))}
            {getTags(product).length > 3 && (
              <span className="px-2 py-1 text-muted-foreground text-xs">+{getTags(product).length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (isAdmin) return <CardContent />;

  return (
    <Link href={`/product/${product.id}`}>
      <CardContent />
    </Link>
  );
};

export default ProductCard;
