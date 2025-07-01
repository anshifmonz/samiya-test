import { type Product } from "@/data/specials";
import { NewArrivalsHeader, NewArrivalCarousel } from './newarrivals';

const NewArrivals = ({ newArrivals }: { newArrivals: Product[] }) => {
  return (
    <section className="bg-luxury-cream py-20 relative overflow-hidden">
      <NewArrivalsHeader />
      <NewArrivalCarousel newArrivals={newArrivals} />
    </section>
  );
};

export default NewArrivals;
