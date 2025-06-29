import React from 'react';
import Navigation from '@/components/shared/Navigation';
import CollectionsHero from '@/components/collections/CollectionsHero';
import CollectionsGrid from '@/components/collections/CollectionsGrid';

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-luxury-cream">
      <Navigation />
      <CollectionsHero />
      <CollectionsGrid />
    </div>
  );
}
