import { type Special, type SpecialProduct } from '@/types/special';

import LandingSection from './LandingSection';
import CategoryTabs from './CategoryTabs';
import NewArrivals from './NewArrivals';
import BudgetSection from './BudgetSelection';
import SelectionSections from './SpecialSections';

const Home = ({ newArrivals, specials }: { newArrivals: SpecialProduct[], specials: Special[] }) => {
  return (
    <div className="flex flex-col gap-[70px] min-h-screen bg-luxury-white">
      <CategoryTabs />
      <LandingSection />
      <NewArrivals newArrivals={newArrivals} />
      <BudgetSection />
      <SelectionSections specials={specials} />
    </div>
  );
};

export default Home;
