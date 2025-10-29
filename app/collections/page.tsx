import type { Metadata } from 'next';
import { getCollections } from 'lib/api/public/collections/get';
import Collections from 'src/components/collections/Collections';

export const metadata: Metadata = {
  title: 'Explore Our Collections - Samiya Online',
  description:
    'Browse our curated collections of wedding dresses, party wear, and traditional attire. Find the perfect outfit for your special occasion.',
  openGraph: {
    title: 'Explore Our Collections - Samiya Online',
    description:
      'Browse our curated collections of wedding dresses, party wear, and traditional attire. Find the perfect outfit for your special occasion.',
    type: 'website',
    images: ['/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@samiya_online',
    title: 'Explore Our Collections - Samiya Online',
    description:
      'Browse our curated collections of wedding dresses, party wear, and traditional attire. Find the perfect outfit for your special occasion.',
    images: ['/opengraph-image.png']
  }
};

export default async function CollectionsPage() {
  const { data, error } = await getCollections();
  if (error) return <div>Error loading collections</div>;

  return <Collections collections={data} />;
}
