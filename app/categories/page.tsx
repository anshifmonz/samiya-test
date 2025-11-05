import { getCategories } from 'lib/api/public/categories/get';
import Categories from 'src/components/categories/Categories';
import { generateBaseMetadata } from 'lib/utils/generateMetadata';

export const metadata = generateBaseMetadata({
  title: 'Explore Our Categories',
  description:
    'Browse our curated categories of wedding dresses, party wear, and traditional attire. Find the perfect outfit for your special occasion.',
  url: '/categories'
});

export default async function CategoriesPage() {
  const { data, error } = await getCategories();
  if (error) return <div>Error loading categories</div>;

  return <Categories categories={data} />;
}
