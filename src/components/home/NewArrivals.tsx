import { type SpecialProduct } from "@/types/special";
import NewArrivalsHeader from './newarrivals/NewArrivalsHeader';
import ProductCard from "./shared/ProductCard";
import CarouselWrapper from "./shared/CarouselWrapper";

const NewArrivals = ({ newArrivals }: { newArrivals: SpecialProduct[] }) => {
  return (
    <section className="py-20 relative overflow-hidden">
      <NewArrivalsHeader />
      <div className="relative mx-auto pl-1">
        <CarouselWrapper>
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </CarouselWrapper>
      </div>
    </section>
  );
};

export default NewArrivals;
