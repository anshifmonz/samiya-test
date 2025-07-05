import { type SpecialProduct } from "@/types/special";
import ProductCard from "./shared/ProductCard";
import CarouselWrapper from "./shared/CarouselWrapper";
import SectionHeading from "./shared/SectionHeading";

const NewArrivals = ({ newArrivals }: { newArrivals: SpecialProduct[] }) => {
  return (
    <section className="relative overflow-hidden">
      <SectionHeading title="Just Dropped" />
      <CarouselWrapper>
        {newArrivals.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </CarouselWrapper>
    </section>
  );
};

export default NewArrivals;
