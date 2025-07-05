'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CollectionsCard from './collections/CollectionsCard';
import { type Collection } from '@/types/collection';
import CarouselWrapper from './shared/CarouselWrapper';

const Collections = ({ collections }: { collections: Collection[] }) => {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    router.push(`/search?q=${category.toLowerCase()}`);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto pl-4">
        <div className="text-center mb-10">
          <div className="animate-fade-in-up">
            <h2 className="luxury-heading text-2xl sm:text-3xl text-luxury-black mb-6">
              Collections
            </h2>
          </div>
        </div>

        <CarouselWrapper>
          {collections.map((collection) => (
            <CollectionsCard
              collection={collection}
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              onClick={() => handleCategoryClick(collection.title)}
            />
          ))}
        </CarouselWrapper>
      </div>
    </section>
  );
};

export default Collections;
