import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ProductCard from './shared/ProductCard';
import { type Special } from '@/types/special';

interface SpecialSectionsProps {
  specials: Special[];
}

const SpecialSections = ({ specials }: SpecialSectionsProps) => {
  return (
    <section>
      {specials.map((special, index) => (
        <section key={special.id} className={`${index % 2 === 0 ? 'bg-luxury-beige' : 'bg-luxury-cream'} py-20 relative overflow-hidden`}>
          <div className="relative ml-10 mr-10 mx-auto px-4">
            <div className="text-center mb-10">
              <div className="animate-fade-in-up">
                <h2 className="luxury-heading text-4xl sm:text-6xl text-luxury-black mb-6">
                  {special.name.toUpperCase()}
                </h2>
              </div>
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <p className="luxury-body text-xl text-luxury-gray max-w-3xl mx-auto">
                  {special.description}
                </p>
              </div>
            </div>

            <Carousel className="w-full" opts={{ align: "start", loop: false }}>
              <CarouselContent className="-ml-2 md:-ml-4">
                {special.products.map((product) => (
                  <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-4/5 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <ProductCard product={product} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>
        </section>
      ))}
    </section>
  );
};

export default SpecialSections;
