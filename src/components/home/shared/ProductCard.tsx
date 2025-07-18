'use client';

import Link from 'next/link';
import Image from 'next/image';
import ImageFallback from 'components/shared/ImageFallback';
import { type SpecialProduct } from 'types/special';
import { type SectionProductItem } from 'types/section';
import isCloudinaryUrl from 'utils/isCloudinaryUrls';
import CloudinaryWithFallback from 'components/shared/CloudinaryWithFallback';

interface ProductcardProps {
  product: SpecialProduct | SectionProductItem;
  className?: string;
  showDiscountBadge?: boolean;
}

const Productcard = ({ product, className, showDiscountBadge = true }: ProductcardProps) => {
  let image: string | undefined;

  if (Array.isArray(product.images)) {
    image = product.images[0];
  } else if (typeof product.images === 'string') {
    image = product.images.trim() || undefined;
  }

  const discountPercentage = product?.originalPrice && product?.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <Link href={`/product/${product.id}`}>
      <div className="relative flex flex-col gap-1 rounded-sm overflow-hidden shadow-sm group cursor-pointer w-[clamp(164px,calc(50vw-30px),458px)] lg:w-[clamp(200px,calc(17.5vw-16px),277px)]">
        <div className="relative flex-grow w-full aspect-[4/5] overflow-hidden">
          {image ? (
            isCloudinaryUrl(image) ? (
              <CloudinaryWithFallback
                src={image}
                alt={`Product: ${product.title}${product.price ? `, Price: Rs ${product.price}` : ''}`}
                width={458}
                height={573}
                sizes="(max-width: 600px) 100vw, 458px"
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={image}
                alt={product.title}
                className="w-full h-full object-cover"
                width={458}
                height={573}
              />
            )
          ) : (
            <ImageFallback />
          )}
          {showDiscountBadge && product?.originalPrice && discountPercentage > 0 && (
            <div className="absolute bottom-4 right-2 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded-sm">
              <span className="text-xs">{discountPercentage}% OFF</span>
            </div>
          )}
        </div>
        <div className={`bg-transparent ${className}`}>
          <h4 className="font-cormorant text-sm md:text-xs text-gray-900 pt-2 leading-tight">{product.title}</h4>
          <span className="font-semibold text-foreground">
            <span className="mr-2">₹{product.price.toFixed(2)}</span>
            {product?.originalPrice && <span className="line-through text-xs">₹{product?.originalPrice?.toFixed(2)}</span>}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Productcard;
