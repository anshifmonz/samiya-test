import React from 'react';
import Navigation from '../components/Navigation';
import AboutSection from '../components/AboutSection';
import TestimonialsSection from '../components/TestimonialsSection';
import ContactSection from '../components/ContactSection';
import FeaturedCategories from '../components/FeaturedCategories';
import FeaturedProducts from '../components/FeaturedProducts';
import LandingSection from '../components/LandingSection';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-luxury-cream">
      <Navigation />

      <LandingSection />

      <FeaturedCategories />

      <AboutSection />

      <FeaturedProducts />

      <TestimonialsSection />

      <ContactSection />
    </div>
  );
};

export default Index;
