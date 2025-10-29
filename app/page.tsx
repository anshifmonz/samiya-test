import React from 'react';
import Home from 'components/home';
import type { Metadata } from 'next';
import getSectionsWithProducts from 'lib/public/section';

export const revalidate = 180;

export const metadata: Metadata = {
  title: 'Samiya Online - Elegant Wedding & Party Dresses',
  description:
    "Discover exquisite wedding attire and traditional wear crafted for life's most precious moments. Elegant bridal collection, sherwanis, kurtis, salwar suits, and festive wear.",
  openGraph: {
    title: 'Samiya Online - Elegant Wedding & Party Dresses',
    description:
      "Discover exquisite wedding attire and traditional wear crafted for life's most precious moments.",
    type: 'website',
    images: ['/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@samiya_online',
    title: 'Samiya Online - Elegant Wedding & Party Dresses',
    description:
      "Discover exquisite wedding attire and traditional wear crafted for life's most precious moments.",
    images: ['/opengraph-image.png']
  }
};

export default async function HomePage() {
  const specials = await getSectionsWithProducts();

  return <Home specials={specials} />;
}
