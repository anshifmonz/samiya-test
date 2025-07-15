'use client';

import Image from 'next/image';
import { type SpecialProduct } from 'types/special';
import ImageFallback from 'components/shared/ImageFallback';
import { SectionProductItem } from 'types/section';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import isCloudinaryUrl from 'src/lib/utils/isCloudinaryUrls';

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

  return (
    <Link href={`/product/${product.id}`}>
      <div className="relative flex flex-col gap-1 rounded-sm overflow-hidden shadow-sm group cursor-pointer w-[clamp(164px,calc(50vw-30px),458px)] lg:w-[clamp(200px,calc(17.5vw-16px),277px)]">
        <div className="relative flex-grow w-full aspect-[4/5] overflow-hidden">
          {image ? (
            isCloudinaryUrl(image) ? (
              <CldImage
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
          {showDiscountBadge && (
            <div className="absolute bottom-4 right-2 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded-sm">
              10% OFF
            </div>
          )}
        </div>
        <div className={`bg-transparent ${className}`}>
          <h4 className="font-cormorant text-sm md:text-xs text-gray-900 pt-2 leading-tight">{product.title}</h4>
          <p className="text-sm font-inter font-semibold text-gray-900">
            <span className="text-[11px] font-light line-through text-gray-500 mr-2">Rs {product.price}</span> Rs {product.price}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Productcard;
