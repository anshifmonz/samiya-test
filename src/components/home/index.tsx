import { type SectionWithProducts } from 'types/section';
import LandingSection from './LandingSection';
import CategoryTabs from './CategoryTabs';
import SelectionSections from './SpecialSections';

const Home = ({ specials }: { specials: SectionWithProducts[] }) => {
  return (
    <div className="flex flex-col gap-[70px] min-h-screen bg-luxury-white">
      <CategoryTabs />
      <LandingSection />
      <SelectionSections specials={specials} />
    </div>
  );
};

export default Home;
