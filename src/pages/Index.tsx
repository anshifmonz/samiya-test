import React from 'react';
import Navigation from '../components/shared/Navigation';
import { LandingSection, FeaturedCategories, OurStoreSection, FeaturedProducts, TestimonialsSection, ContactSection } from '../components/home';

const Index: React.FC = () => {
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
};

export default Index;
