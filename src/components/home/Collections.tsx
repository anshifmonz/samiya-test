'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CollectionsCard from './collections/CollectionsCard';
import { type Collection } from '@/types/collection';
import CarouselWrapper from './shared/CarouselWrapper';
import SectionHeading from './shared/SectionHeading';

const Collections = ({ collections }: { collections: Collection[] }) => {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    router.push(`/search?q=${category.toLowerCase()}`);
  };

  return (
    <section className="relative overflow-hidden -mt-8">
      <SectionHeading title="Collections" />
      <div className="relative mx-auto pl-1">
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
