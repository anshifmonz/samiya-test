import { type Special, type SpecialProduct } from '@/types/special';
import { type Collection } from '@/types/collection';

import LandingSection from './LandingSection';
import Collections from './Collections';
import NewArrivals from './NewArrivals';
import BudgetSection from './BudgetSelection';
import SelectionSections from './SpecialSections';

const Home = ({ collections, newArrivals, specials }: { collections: Collection[], newArrivals: SpecialProduct[], specials: Special[] }) => {
  return (
    <div className="flex flex-col gap-[70px] min-h-screen bg-luxury-white">
      <LandingSection />
      <Collections collections={collections} />
      <NewArrivals newArrivals={newArrivals} />
      <BudgetSection />
      <SelectionSections specials={specials} />
    </div>
  );
};

export default Home;
