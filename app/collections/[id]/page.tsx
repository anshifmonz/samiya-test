import Collections from 'components/collections/[id]/Collections';
import { getSectionProducts } from 'lib/api/public/collections/[id]/get';

export const revalidate = 0;

export default async function CollectionsPage({ params }: { params: { id: string } }) {
  const sectionId = params.id;
  const { data, error } = await getSectionProducts(sectionId, 12, 0);

  if (error) return <div>Error loading collections</div>;

  return (
    <div className="min-h-screen bg-luxury-white">
      <Collections section={data} />
    </div>
  );
}
