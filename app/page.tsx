import React, { Suspense } from 'react';
import Navigation from '@/components/shared/Navigation';
import { LandingSection, FeaturedCategories, OurStoreSection, TestimonialsSection, ContactSection } from '@/components/home';
import FeaturedProductsServer from '@/components/home/FeaturedProductsServer';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-luxury-cream">
      <Navigation />

      <LandingSection />

      <FeaturedCategories />

      <OurStoreSection />

      <Suspense fallback={<LoadingSpinner text="Loading featured products..." />}>
        <FeaturedProductsServer />
      </Suspense>

      <TestimonialsSection />

      <ContactSection />
    </div>
  );
}
