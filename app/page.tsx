import React from 'react';
import Home from 'components/home';
import getSectionsWithProducts from 'lib/public/section';

export const revalidate = 180;

export default async function HomePage() {
  const specials = await getSectionsWithProducts();

  return (
    <Home specials={specials} />
  );
}
