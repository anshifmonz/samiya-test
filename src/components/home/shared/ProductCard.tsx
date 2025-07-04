import Image from 'next/image';
import { type SpecialProduct } from '@/types/special';
import ImageFallback from 'components/shared/ImageFallback';

const Productcard = ({ product }: { product: SpecialProduct }) => {
  const image = product.images[0];

  return (
    <div className="flex flex-col relative h-[370px] w-[280px] rounded-sm overflow-hidden shadow-sm cursor-pointer">
      <div className="relative flex-grow w-full h-full overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={product.title}
            className="w-full h-full object-cover"
            width={280}
            height={370}
          />
        ) : (
          <ImageFallback />
        )}
        <div className="absolute bottom-4 right-2 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded-sm">
          10% OFF
        </div>
      </div>
      <div className="bg-transparent">
        <h4 className="font-cormorant font-medium text-gray-900 pt-2 text-base leading-tight">{product.title}</h4>
        <p className="text-md font-inter font-semibold text-gray-900">
          <span className="text-sm font-light line-through text-gray-500">Rs {product.price}</span> RS {product.price}
        </p>
      </div>
    </div>
  );
};

export default Productcard;
