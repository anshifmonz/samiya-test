import React from 'react';
import Home from '@/components/home';
import getNewArrivals from '@/lib/newarrivals';
import getSpecials from '@/lib/specials';

export default async function HomePage() {
  const newArrivals = await getNewArrivals();
  const specials = await getSpecials();

  return (
    <Home newArrivals={newArrivals} specials={specials} />
  );
}
