import { getCollections } from 'lib/api/public/collections/get';
import Collections from 'src/components/collections/Collections';

export default async function CollectionsPage() {
  const { data, error } = await getCollections();
  if (error) return <div>Error loading collections</div>;

  return <Collections collections={data} />;
}
