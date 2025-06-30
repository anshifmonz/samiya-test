import { type NewArrival } from "@/data/newarrivals";
import { NewArrivalsHeader, NewArrivalCarousel } from './newarrivals';

const NewArrivals = ({ newArrivals }: { newArrivals: NewArrival[] }) => {
  return (
    <section className="bg-luxury-cream py-20 relative overflow-hidden">
      <NewArrivalsHeader />
      <NewArrivalCarousel newArrivals={newArrivals} />
    </section>
  );
};

export default NewArrivals;
