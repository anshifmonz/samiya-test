import React from 'react';
import { LandingSection, Collections, NewArrivals, BudgetSection, SelectionSections } from 'components/home';
import FeaturedProducts from 'components/home/FeaturedProducts';
import getCollections from '@/lib/collections';
import getNewArrivals from '@/lib/newarrivals';
import getSpecials from '@/lib/specials';

export default async function HomePage() {
  const collections = await getCollections();
  const newArrivals = await getNewArrivals();
  const specials = await getSpecials();

  return (
    <div className="min-h-screen bg-luxury-cream">
      <LandingSection />

      <Collections collections={collections} />

      <NewArrivals newArrivals={newArrivals} />

      <BudgetSection />

      <FeaturedProducts />

      <SelectionSections specials={specials} />
    </div>
  );
}
