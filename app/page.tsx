import React from 'react';
import Navigation from 'components/shared/Navigation';
import { LandingSection, Collections, TestimonialsSection, ContactSection, NewArrivals, BudgetSection } from 'components/home';
import FeaturedProducts from 'components/home/FeaturedProducts';
import getCollections from '@/lib/collections';
import getNewArrivals from '@/lib/newarrivals';

export default async function HomePage() {
  const collections = await getCollections();
  const newArrivals = await getNewArrivals();

  return (
    <div className="min-h-screen bg-luxury-cream">
      <Navigation />

      <LandingSection />

      <Collections collections={collections} />

      <NewArrivals newArrivals={newArrivals} />

      <BudgetSection />

      <FeaturedProducts />

      <TestimonialsSection />

      <ContactSection />
    </div>
  );
}
