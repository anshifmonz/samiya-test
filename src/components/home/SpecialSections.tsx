import { type Special } from '@/types/special';
import CarouselWrapper from './shared/CarouselWrapper';
import ProductCard from './shared/ProductCard';
import SectionHeading from './shared/SectionHeading';

interface SpecialSectionsProps {
  specials: Special[];
}

const SpecialSections = ({ specials }: SpecialSectionsProps) => {
  return (
    <section className="flex flex-col gap-[70px]">
      {specials.map((special) => (
        <section key={special.id} className="relative overflow-hidden">
          <SectionHeading title={special.name.toUpperCase()} />
          <div className="relative mx-auto pl-1">
            <CarouselWrapper>
              {special.products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </CarouselWrapper>
          </div>
        </section>
      ))}
    </section>
  );
};

export default SpecialSections;
