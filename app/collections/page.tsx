import { getCollections } from 'lib/api/public/collections/get';
import Collections from 'src/components/collections/Collections';
import { generateBaseMetadata } from 'lib/utils/generateMetadata';

export const metadata = generateBaseMetadata({
  title: 'Explore Our Collections',
  description:
    'Browse our curated collections of wedding dresses, party wear, and traditional attire. Find the perfect outfit for your special occasion.',
  url: '/collections'
});

export default async function CollectionsPage() {
  const { data, error } = await getCollections();
  if (error) return <div>Error loading collections</div>;

  return <Collections collections={data} />;
}
