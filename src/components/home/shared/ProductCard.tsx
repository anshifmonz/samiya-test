import Image from 'next/image';
import { type SpecialProduct } from '@/types/special';
import ImageFallback from 'components/shared/ImageFallback';

const Productcard = ({ product }: { product: SpecialProduct }) => {
  const image = product.images[0];

  return (
    <div className="relative bg-card rounded-sm overflow-hidden shadow-sm group cursor-pointer w-[clamp(164px,calc(50vw-30px),458px)] lg:w-[clamp(200px,calc(20vw-16px),243px)]">
      <div className="relative w-full aspect-[4/5] overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            width={458}
            height={573}
          />
        ) : (
          <ImageFallback />
        )}
        <div className="absolute bottom-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded-sm">
          10% OFF
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-cormorant font-medium text-gray-900 mb-2">{product.title}</h3>
        <p className="text-lg font-inter font-semibold text-gray-900">
          RS {product.price}
        </p>
      </div>
    </div>
  );
};

export default Productcard;
