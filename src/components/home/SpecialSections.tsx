'use client';

import { useRef, useState, useEffect, Fragment } from 'react';
import { type SectionWithProducts } from 'types/section';
import CarouselWrapper from './shared/CarouselWrapper';
import ProductCard from './shared/ProductCard';
import SectionHeading from './shared/SectionHeading';
import BudgetSection from './BudgetSelection';

interface SpecialSectionsProps {
  specials: SectionWithProducts[];
}

const useInView = <T extends HTMLElement>(options?: IntersectionObserverInit): [React.RefObject<T>, boolean] => {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let observer: IntersectionObserver | null = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer && observer.disconnect();
        }
      },
      options || { threshold: 0.18 }
    );
    observer.observe(node);
    return () => observer && observer.disconnect();
  }, [options]);

  return [ref, inView];
};

const SpecialSection = ({ special, index }: { special: SectionWithProducts, index: number }) => {
    const [sectionRef, inView] = useInView<HTMLElement>({ threshold: 0.18 });
    const [budgetRef, budgetInView] = useInView<HTMLElement>({ threshold: 0.18 });

    return (
        <Fragment key={special.id}>
            <section
                ref={sectionRef}
                className={`relative overflow-hidden transition-opacity duration-1000 ${index === 0 ? '-mt-8' : ''} ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}
            >
                <SectionHeading title={special.title.toUpperCase()} />
                <CarouselWrapper>
                    {special.products.map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </CarouselWrapper>
            </section>

            {index === 1 && (
                <section
                    ref={budgetRef}
                    className={`relative overflow-hidden transition-opacity duration-1000 ${budgetInView ? 'animate-fade-in-up' : 'opacity-0'}`}
                >
                    <BudgetSection />
                </section>
            )}
        </Fragment>
    );
}

const SpecialSections = ({ specials }: SpecialSectionsProps) => {
  const nonEmptySpecials = specials.filter(special => special.products && special.products.length > 0);

  return (
    <section className="flex flex-col gap-[70px]">
      {nonEmptySpecials.map((special, index) => (
        <SpecialSection key={special.id} special={special} index={index} />
      ))}
    </section>
  );
};

export default SpecialSections;
