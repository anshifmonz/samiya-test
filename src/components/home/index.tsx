import { type Product, type Special } from '@/data/specials';
import { type Collection } from '@/data/collections';

import LandingSection from './LandingSection';
import Collections from './Collections';
import FeaturedProducts from './FeaturedProducts';
import NewArrivals from './NewArrivals';
import BudgetSection from './BudgetSelection';
import SelectionSections from './SpecialSections';

const Home = ({ collections, newArrivals, specials }: { collections: Collection[], newArrivals: Product[], specials: Special[] }) => {
  return (
    <div className="min-h-screen bg-luxury-cream">
      <LandingSection />
      <Collections collections={collections} />
      <FeaturedProducts />
      <NewArrivals newArrivals={newArrivals} />
      <BudgetSection />
      <SelectionSections specials={specials} />
    </div>
  );
};

export default Home;
