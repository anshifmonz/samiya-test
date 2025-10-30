'use client';

import Link from 'next/link';
import Image from 'next/image';
import { type SimilarProduct } from 'types/product';
import { Badge } from 'ui/badge';
import ImageFallback from '../shared/ImageFallback';
import CloudinaryWithFallback from '../shared/CloudinaryWithFallback';
import isCloudinaryUrl from 'utils/isCloudinaryUrls';

interface SimilarProductCardProps {
  product: SimilarProduct;
}

const SimilarProductCard: React.FC<SimilarProductCardProps> = ({ product }) => {
  const getBadgeVariant = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'sale':
        return 'destructive';
      case 'new':
        return 'default';
      case 'bestseller':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getColorValue = (colorName: string) => {
    const colorData = product.available_colors.find(color => color.color_name === colorName);
    if (colorData?.hex_code && colorData.hex_code !== '######') {
      return colorData.hex_code;
    }

    // legacy support
    switch (colorName.toLowerCase()) {
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
      default: return colorName;
    }
  };

  const CardContent = () => (
    <div className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-[var(--product-card-shadow-hover)] transition-all duration-300">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        {product.primary_image_url ? (
          isCloudinaryUrl(product.primary_image_url) ? (
            <CloudinaryWithFallback
              src={product.primary_image_url}
              alt={product.category ? `${product.title} (${product.category})` : product.title}
              width={400}
              height={500}
              sizes="(max-width: 600px) 100vw, 400px"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              priority
            />
          ) : (
            <Image
              src={product.primary_image_url}
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

        {product.category && (
          <Badge variant={getBadgeVariant(product.category)} className="absolute top-2 left-2">
            {product.category}
          </Badge>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-medium text-foreground line-clamp-2 text-sm">{product.title}</h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-foreground">
              <span className="mr-2">₹{product.price.toFixed(2)}</span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-xs line-through text-muted-foreground">
                  ₹{product.original_price.toLocaleString()}
                </span>
              )}
            </span>
          </div>

          {product.available_colors && product.available_colors.length > 0 && (
            <div className="flex gap-1">
              {product.available_colors
                .sort((a, b) => a.sort_order - b.sort_order)
                .slice(0, 3)
                .map(color => (
                  <div
                    key={color.color_name}
                    className="w-3 h-3 rounded-full border border-white shadow-sm ring-1 ring-gray-200"
                    style={{
                      backgroundColor: getColorValue(color.color_name)
                    }}
                    title={
                      color.color_name
                        ? color.color_name.charAt(0).toUpperCase() + color.color_name.slice(1)
                        : ''
                    }
                  />
                ))}
              {product.available_colors.length > 3 && (
                <span className="text-xs text-muted-foreground ml-1">
                  +{product.available_colors.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Link href={`/product/${product.slug || product.id}`}>
      <CardContent />
    </Link>
  );
};

export default SimilarProductCard;
