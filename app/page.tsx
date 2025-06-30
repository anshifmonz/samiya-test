import React, { Suspense } from 'react';
import Navigation from 'components/shared/Navigation';
import { LandingSection, Collections, TestimonialsSection, ContactSection, NewArrivals, BudgetSection } from 'components/home';
import FeaturedProductsServer from 'components/home/FeaturedProductsServer';
import LoadingSpinner from 'components/shared/LoadingSpinner';
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

      <Suspense fallback={<LoadingSpinner text="Loading featured products..." />}>
        <FeaturedProductsServer />
      </Suspense>

      <TestimonialsSection />

      <ContactSection />
    </div>
  );
}
