"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import CollectionsCard from './collections/CollectionsCard';
import { type Collection } from '@/data/collections';

const Collections = ({ collections }: { collections: Collection[] }) => {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    router.push(`/search?q=${category.toLowerCase()}`);
  };

  return (
    <div className="bg-luxury-beige py-20 relative overflow-hidden">
      <div className="relative ml-10 mr-10 mx-auto px-4">
        <div className="text-center mb-10">
          <div className="animate-fade-in-up">
            <h2 className="luxury-heading text-6xl sm:text-7xl text-luxury-black mb-6">
              <span className="luxury-subheading block text-luxury-gold-dark text-2xl sm:text-3xl mb-4 tracking-[0.3em]">
                Curated Excellence
              </span>
              Collections
            </h2>
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="luxury-body text-xl text-luxury-gray max-w-3xl mx-auto">
              Discover our meticulously curated collections designed for every special occasion
            </p>
          </div>
        </div>

        <Carousel className="w-full" opts={{ align: "start", loop: false }}>
          <CarouselContent className="-ml-2 md:-ml-4">
            {collections.map((collection) => (
              <CarouselItem key={collection.id} className="pl-2 md:pl-4 basis-4/5 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <CollectionsCard
                  collection={collection}
                  hoveredCard={hoveredCard}
                  setHoveredCard={setHoveredCard}
                  onClick={() => handleCategoryClick(collection.title)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>

          <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-luxury-beige to-transparent pointer-events-none z-5"></div>
          <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-luxury-beige to-transparent pointer-events-none z-5"></div>
        </div>

        <div className="text-center mt-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <p className="text-luxury-gray/70 text-sm tracking-wide">
            ← Scroll to explore all collections →
          </p>
        </div>
      </div>
  );
};

export default Collections;
