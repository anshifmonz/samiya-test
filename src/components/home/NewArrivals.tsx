import { type SpecialProduct } from "@/types/special";
import { NewArrivalsHeader, NewArrivalCarousel } from './newarrivals';

const NewArrivals = ({ newArrivals }: { newArrivals: SpecialProduct[] }) => {
  return (
    <section className="bg-luxury-cream py-20 relative overflow-hidden">
      <NewArrivalsHeader />
      <NewArrivalCarousel newArrivals={newArrivals} />
    </section>
  );
};

export default NewArrivals;
