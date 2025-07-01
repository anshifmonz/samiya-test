import React from 'react';
import Home from '@/components/home';
import getCollections from '@/lib/collections';
import getNewArrivals from '@/lib/newarrivals';
import getSpecials from '@/lib/specials';

export default async function HomePage() {
  const collections = await getCollections();
  const newArrivals = await getNewArrivals();
  const specials = await getSpecials();

  return (
    <Home collections={collections} newArrivals={newArrivals} specials={specials} />
  );
}
