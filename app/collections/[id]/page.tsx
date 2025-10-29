import Collections from 'components/collections/[id]/Collections';
import { getSectionProducts } from 'lib/api/public/collections/[id]/get';
import type { Metadata } from 'next';

export const revalidate = 0;

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sectionId = params.id;
  const { data: section, error } = await getSectionProducts(sectionId, 1, 0);

  if (error || !section) {
    return {
      title: 'Collection Not Found',
      description: 'The requested collection could not be found.'
    };
  }

  const title = section.title + ' Collection - Samiya Online';
  const description =
    section.description || `Explore the exclusive ${section.title} collection at Samiya Online.`;
  const imageUrl = '/opengraph-image.png'; // SectionWithProducts does not have an image property

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [imageUrl]
    },
    twitter: {
      card: 'summary_large_image',
      site: '@samiya_online',
      title,
      description,
      images: [imageUrl]
    }
  };
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
