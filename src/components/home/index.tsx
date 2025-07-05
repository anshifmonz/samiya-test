import { type Special } from '@/types/special';
import LandingSection from './LandingSection';
import CategoryTabs from './CategoryTabs';
import SelectionSections from './SpecialSections';

const Home = ({ specials }: { specials: Special[] }) => {
  return (
    <div className="flex flex-col gap-[70px] min-h-screen bg-luxury-white">
      <CategoryTabs />
      <LandingSection />
      <SelectionSections specials={specials} />
    </div>
  );
};

export default Home;
