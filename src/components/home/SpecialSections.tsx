import { type Special } from '@/types/special';
import CarouselWrapper from './shared/CarouselWrapper';
import ProductCard from './shared/ProductCard';

interface SpecialSectionsProps {
  specials: Special[];
}

const SpecialSections = ({ specials }: SpecialSectionsProps) => {
  return (
    <section>
      {specials.map((special) => (
        <section key={special.id} className="py-20 relative overflow-hidden">
          <div className="relative ml-0 mr-0 mx-auto pl-1">
            <div className="text-center mb-10">
              <div className="animate-fade-in-up">
                <h2 className="luxury-heading text-2xl sm:text-3xl text-luxury-black mb-6">
                  {special.name.toUpperCase()}
                </h2>
              </div>
            </div>

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
