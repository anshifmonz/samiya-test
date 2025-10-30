import type { Metadata } from 'next';
import { generateBaseMetadata } from 'lib/utils/generateMetadata';
import Collections from 'components/collections/[id]/Collections';
import { getSectionProducts } from 'lib/api/public/collections/[id]/get';

export const revalidate = 0;

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sectionId = params.id;
  const { data: section, error } = await getSectionProducts(sectionId, 1, 0);

  if (error || !section) {
    return generateBaseMetadata({
      title: 'Collection Not Found',
      description: 'The requested collection could not be found.',
      noIndex: true
    });
  }

  const title = section.title + ' Collection';
  const description =
    section.description || `Explore the exclusive ${section.title} collection at Samiya Online.`;

  return generateBaseMetadata({
    title,
    description,
    url: `/collections/${sectionId}`
  });
}

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
