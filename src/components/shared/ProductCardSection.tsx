'use client';

import Link from 'next/link';
import Image from 'next/image';
import { type SectionProduct } from 'types/collection';

interface ProductCardProps {
  product: SectionProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const firstImage = product.primary_image_url || '/placeholder.svg';
  const colors = product.available_colors || [];

  return (
    <Link href={`/product/${product.id}`}>
      <div className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-[var(--product-card-shadow-hover)] transition-all duration-300">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <Image
            src={firstImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            width={400}
            height={500}
            priority
          />
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-medium text-foreground line-clamp-2 text-sm">{product.title}</h3>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">₹{product.price.toFixed(2)}</span>
              {product.original_price && product.original_price > product.price && (
                <span className="line-through text-xs text-muted-foreground">
                  ₹{product.original_price.toFixed(2)}
                </span>
              )}
            </div>
            {/* Color swatches (right side) */}
            {colors.length > 0 && (
              <div className="flex gap-1">
                {colors.slice(0, 3).map(color => (
                  <div
                    key={color.color_name}
                    className="w-3 h-3 rounded-full border border-white shadow-sm ring-1 ring-gray-200"
                    style={{ backgroundColor: color.hex_code }}
                    title={color.color_name.charAt(0).toUpperCase() + color.color_name.slice(1)}
                  />
                ))}
                {colors.length > 3 && (
                  <span className="text-xs text-muted-foreground ml-1">+{colors.length - 3}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
