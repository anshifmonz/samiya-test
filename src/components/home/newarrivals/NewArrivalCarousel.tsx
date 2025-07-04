import { type SpecialProduct } from '@/types/special';
import CarouselWrapper from '../shared/CarouselWrapper';
import ProductCard from '../shared/ProductCard';

const NewArrivalCarousel = ({ newArrivals }: { newArrivals: SpecialProduct[] }) => {
  return (
    <div className="relative mx-auto pl-4">
      <CarouselWrapper>
        {newArrivals.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </CarouselWrapper>
    </div>
  );
};

export default NewArrivalCarousel;
