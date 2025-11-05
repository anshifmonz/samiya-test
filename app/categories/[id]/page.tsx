import type { Metadata } from 'next';
import Category from 'components/categories/[id]/Category';
import { generateBaseMetadata } from 'lib/utils/generateMetadata';
import { getCategoryProducts } from 'lib/api/public/categories/[id]/get';

export const revalidate = 0;

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categoryId = params.id;
  const { data: category, error } = await getCategoryProducts(categoryId, 1, 0);

  if (error || !category) {
    return generateBaseMetadata({
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
      noIndex: true
    });
  }

  const title = category.name + ' Category';
  const description =
    category.description || `Explore the exclusive ${category.name} category at Samiya Online.`;

  return generateBaseMetadata({
    title,
    description,
    url: `/categories/${categoryId}`
  });
}

export default async function CategoryPage({ params }: Props) {
  const categoryId = params.id;
  const { data, error } = await getCategoryProducts(categoryId, 12, 0);

  if (error) return <div>Error loading category</div>;

  return (
    <div className="min-h-screen bg-luxury-white">
      <Category category={data} />
    </div>
  );
}
