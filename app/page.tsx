import React, { Suspense } from 'react';
import Navigation from 'components/shared/Navigation';
import { LandingSection, Collections, OurStoreSection, TestimonialsSection, ContactSection } from 'components/home';
import FeaturedProductsServer from 'components/home/FeaturedProductsServer';
import LoadingSpinner from 'components/shared/LoadingSpinner';
import { getCollections } from '@/lib/api';

export default async function HomePage() {
  const collections = await getCollections();

  return (
    <div className="min-h-screen bg-luxury-cream">
      <Navigation />

      <LandingSection />

      <Collections collections={collections} />

      <OurStoreSection />

      <Suspense fallback={<LoadingSpinner text="Loading featured products..." />}>
        <FeaturedProductsServer />
      </Suspense>

      <TestimonialsSection />

      <ContactSection />
    </div>
  );
}
