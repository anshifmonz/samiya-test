'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CollectionsCard from 'components/home/collections/CollectionsCard';
import { type Collection } from '@/types/collection';
import CarouselWrapper from 'components/home/shared/CarouselWrapper';
import SectionHeading from 'components/home/shared/SectionHeading';

const Collections = ({ collections }: { collections: Collection[] }) => {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    router.push(`/search?q=${category.toLowerCase()}`);
  };

  return (
    <section className="relative overflow-hidden -mt-8">
      <SectionHeading title="Collections" />
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
    </section>
  );
};

export default Collections;
