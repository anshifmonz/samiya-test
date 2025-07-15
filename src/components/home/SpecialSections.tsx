'use client';

import { type SectionWithProducts } from 'types/section';
import CarouselWrapper from './shared/CarouselWrapper';
import ProductCard from './shared/ProductCard';
import SectionHeading from './shared/SectionHeading';
import BudgetSection from './BudgetSelection';
import { useRef, useState, useEffect } from 'react';

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
          observer && observer.disconnect(); // trigger once
        }
      },
      options || { threshold: 0.18 }
    );
    observer.observe(node);
    return () => observer && observer.disconnect();
  }, [options]);

  return [ref, inView];
};

const SpecialSections = ({ specials }: SpecialSectionsProps) => {
  return (
    <section className="flex flex-col gap-[70px]">
      {specials.map((special, index) => {
        const [sectionRef, inView] = useInView<HTMLElement>({ threshold: 0.18 });
        const [budgetRef, budgetInView] = useInView<HTMLElement>({ threshold: 0.18 });
        return (
          <>
            {index === 2 && (
              <section
                ref={budgetRef}
                key={`budget-${special.id}`}
                className={`relative overflow-hidden transition-opacity duration-1000 ${budgetInView ? 'animate-fade-in-up' : 'opacity-0'}`}
              >
                <BudgetSection />
              </section>
            )}
            <section
              ref={sectionRef}
              key={special.id}
              className={`relative overflow-hidden transition-opacity duration-1000 ${index === 0 ? '-mt-8' : ''} ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}
            >
              <SectionHeading title={special.title.toUpperCase()} />
              <CarouselWrapper>
                {special.products.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </CarouselWrapper>
            </section>
          </>
        );
      })}
    </section>
  );
};

export default SpecialSections;
