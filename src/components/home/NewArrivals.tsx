import { type SpecialProduct } from "@/types/special";
import ProductCard from "./shared/ProductCard";
import CarouselWrapper from "./shared/CarouselWrapper";
import SectionHeading from "./shared/SectionHeading";

const NewArrivals = ({ newArrivals }: { newArrivals: SpecialProduct[] }) => {
  return (
    <section className="relative overflow-hidden">
      <SectionHeading title="Just Dropped" />
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
