import { type SectionWithProducts } from 'types/section';
import CarouselWrapper from './shared/CarouselWrapper';
import ProductCard from './shared/ProductCard';
import SectionHeading from './shared/SectionHeading';
import BudgetSection from './BudgetSelection';

interface SpecialSectionsProps {
  specials: SectionWithProducts[];
}

const SpecialSections = ({ specials }: SpecialSectionsProps) => {
  return (
    <section className="flex flex-col gap-[70px]">
      {specials.map((special, index) => (
        <>
          {index === 2 && (
            <section key={special.id} className="relative overflow-hidden">
              <BudgetSection />
            </section>
          )}
          <section key={special.id} className={`relative overflow-hidden ${index === 0 ? '-mt-8' : ''}`}>
            <SectionHeading title={special.title.toUpperCase()} />
            <CarouselWrapper>
              {special.products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </CarouselWrapper>
          </section>
        </>
      ))}
    </section>
  );
};

export default SpecialSections;
