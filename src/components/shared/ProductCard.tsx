import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { type Product } from 'types/product';
import { Badge } from 'ui/badge';
import { Button } from 'ui/button';
import { Heart } from 'lucide-react';
import ImageFallback from './ImageFallback';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const firstImage = Object.values(product.images)[0]?.[0];

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

  const shouldShowSalePrice = () => {
    const hash = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 10) >= 7;
  };

  return (
    <Link href={`/product/${product.id}`}>
      <div className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-[var(--product-card-shadow-hover)] transition-all duration-300">
        <div className="relative aspect-square overflow-hidden bg-muted">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            width={400}
            height={400}
            priority
          />
        ) : (
          <ImageFallback />
        )}

        {/* Badge */}
        {product.category && (
          <Badge
            variant={getBadgeVariant(product.category)}
            className="absolute top-2 left-2"
          >
            {product.category}
          </Badge>
        )}

        {/* Heart button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
        >
          <Heart className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-medium text-foreground line-clamp-2 text-sm">
          {product.title}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-foreground">
              ₹{product.price.toFixed(2)}
            </span>
            {/* Add original price if on sale */}
            {shouldShowSalePrice() && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{(product.price * 1.3).toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Color Swatches */}
        {Object.keys(product.images).length > 0 && (
          <div className="flex items-center gap-1 pt-1">
            {Object.keys(product.images).slice(0, 4).map(color => (
              <div
                key={color}
                className="w-3 h-3 rounded-full border border-border shadow-sm"
                style={{
                  backgroundColor: getColorValue(color)
                }}
                title={color.charAt(0).toUpperCase() + color.slice(1)}
              />
            ))}
            {Object.keys(product.images).length > 4 && (
              <span className="text-xs text-muted-foreground ml-1">
                +{Object.keys(product.images).length - 4}
              </span>
            )}
          </div>
        )}
      </div>
      </div>
    </Link>
  );
};

export default ProductCard;
