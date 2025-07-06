import React from 'react';
import Home from '@/components/home';
import getSpecials from '@/lib/specials';

export default async function HomePage() {
  const specials = await getSpecials();

  return (
    <Home specials={specials} />
  );
}
