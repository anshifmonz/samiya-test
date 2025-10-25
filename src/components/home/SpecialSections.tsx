'use client';

import { useRef, useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import BudgetSection from './BudgetSelection';
import ProductCard from './shared/ProductCard';
import SectionHeading from './shared/SectionHeading';
import CarouselWrapper from './shared/CarouselWrapper';
import { type SectionWithProducts } from 'types/section';

interface SpecialSectionsProps {
  specials: SectionWithProducts[];
}

const useInView = <T extends HTMLElement>(
  options?: IntersectionObserverInit
): [React.RefObject<T>, boolean] => {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let observer: IntersectionObserver | null = new window.IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer && observer.disconnect();
      }
    }, options || { threshold: 0.18 });
    observer.observe(node);
    return () => observer && observer.disconnect();
  }, [options]);

  return [ref, inView];
};

const SpecialSection = ({ special, index }: { special: SectionWithProducts; index: number }) => {
  const [sectionRef, inView] = useInView<HTMLDivElement>({ threshold: 0.18 });

  return (
    <div
      ref={sectionRef}
      className={`relative overflow-hidden transition-opacity duration-1000 ${
        index === 0 ? '-mt-8' : ''
      } ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}
    >
      <div className="relative flex items-center justify-center mb-6">
        <SectionHeading title={special.title.toUpperCase()} />
        <Link
          href={`/collections/${special.id}`}
          aria-label="View all in section"
          className="absolute right-6 ml-2 flex items-center gap-1 px-3 py-1 rounded-full bg-luxury-gold/80 hover:bg-luxury-gold text-luxury-black transition-colors duration-200"
        >
          {/* <span className="hidden sm:inline text-sm font-medium">View All</span> */}
          <ArrowRight size={20} />
        </Link>
      </div>
      <CarouselWrapper>
        {special.products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
        {/* View more like this card */}
        <Link href={`/collections/${special.id}`} aria-label="View more like this">
          <div
            className="flex flex-col items-center justify-center aspect-[4/5] w-[clamp(164px,calc(50vw-30px),458px)] lg:w-[clamp(200px,calc(17.5vw-16px),277px)] rounded-sm border border-luxury-gold/40 bg-luxury-cream/60 shadow-md cursor-pointer hover:bg-luxury-gold/20 transition-colors duration-200 p-4 mx-2"
            role="button"
            tabIndex={0}
            aria-label="View more like this"
          >
            <ArrowRight size={32} className="text-luxury-gold mb-2" />
            <span className="text-xs sm:text-base font-semibold text-luxury-black">
              View more like this
            </span>
          </div>
        </Link>
      </CarouselWrapper>
    </div>
  );
};

const SpecialSections = ({ specials }: SpecialSectionsProps) => {
  const [budgetRef, budgetInView] = useInView<HTMLElement>({ threshold: 0.18 });
  const nonEmptySpecials = specials.filter(
    special => special.products && special.products.length > 0
  );

  return (
    <main className="flex flex-col gap-[70px]">
      {nonEmptySpecials.map((special, index) => (
        <Fragment key={special.id}>
          <SpecialSection special={special} index={index} />
          {index === 1 && nonEmptySpecials.length > 2 && (
            <section
              ref={budgetRef}
              className={`relative overflow-hidden transition-opacity duration-1000 ${
                budgetInView ? 'animate-fade-in-up' : 'opacity-0'
              }`}
            >
              <BudgetSection />
            </section>
          )}
        </Fragment>
      ))}
    </main>
  );
};

export default SpecialSections;
