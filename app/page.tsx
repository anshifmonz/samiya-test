"use client";

import React from 'react';
import Navigation from '@/components/shared/Navigation';
import { LandingSection, FeaturedCategories, OurStoreSection, FeaturedProducts, TestimonialsSection, ContactSection } from '@/components/home';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-luxury-cream">
      <Navigation />

      <LandingSection />

      <FeaturedCategories />

      <OurStoreSection />

      <FeaturedProducts />

      <TestimonialsSection />

      <ContactSection />
    </div>
  );
}
