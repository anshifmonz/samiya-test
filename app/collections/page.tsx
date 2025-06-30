import React, { Suspense } from 'react';
import CollectionsHero from 'components/collections/CollectionsHero';
import CollectionsGridServer from 'components/collections/CollectionsGridServer';
import LoadingSpinner from 'components/shared/LoadingSpinner';

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-luxury-cream">
      <CollectionsHero />
      <Suspense fallback={<LoadingSpinner text="Loading collections..." />}>
        <CollectionsGridServer />
      </Suspense>
    </div>
  );
}
