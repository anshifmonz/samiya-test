import React from 'react';
import Navigation from '../components/shared/Navigation';
import AboutSection from '../components/home/AboutSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import ContactSection from '../components/home/ContactSection';
import FeaturedCategories from '../components/home/FeaturedCategories';
import FeaturedProducts from '../components/home/FeaturedProducts';
import LandingSection from '../components/home/LandingSection';

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
