import type { Metadata } from 'next';
import Search from 'components/search';
import { redirect } from 'next/navigation';
import searchProducts from 'lib/public/search';
import getCategories from 'lib/public/category';
import { type Category } from 'types/category';
import type { SearchResult, ProductFilters } from 'types/product';
import { generateBaseMetadata } from 'lib/utils/generateMetadata';

export const revalidate = 180;

interface Props {
  searchParams: {
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    colors?: string;
    tags?: string;
    source?: string;
    sortOrder?: string;
  };
}

// parse search filters from url parameters
function parseFilters(searchParams: Props['searchParams']): ProductFilters {
  const filters: ProductFilters = {};

  if (searchParams.category) filters.category = searchParams.category;

  if (searchParams.minPrice) {
    const minPrice = parseFloat(searchParams.minPrice);
    if (!isNaN(minPrice)) filters.minPrice = minPrice;
  }

  if (searchParams.maxPrice) {
    const maxPrice = parseFloat(searchParams.maxPrice);
    if (!isNaN(maxPrice)) filters.maxPrice = maxPrice;
  }

  if (searchParams.colors) filters.colors = searchParams.colors.split(',').filter(Boolean);

  if (searchParams.tags) filters.tags = searchParams.tags.split(',').filter(Boolean);

  if (searchParams.sortOrder) filters.sortOrder = searchParams.sortOrder;

  return filters;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = searchParams.q || '';
  const category = searchParams.category || '';

  const title = query
    ? `Search results for "${query}"${category ? ` in ${category}` : ''}`
    : `Search`;
  const description = query
    ? `Explore our wide range of products matching "${query}"${
        category ? ` in the ${category} category` : ''
      }. Find your perfect wedding or party dress.`
    : `Search for wedding dresses, party wear, and traditional attire at Samiya Online.`;

  return generateBaseMetadata({
    title,
    description,
    url: `/search?q=${query}`
  });
}

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q || '';
  const minPrice = searchParams.minPrice;
  const maxPrice = searchParams.maxPrice;
  const source = searchParams.source;

  if (
    ((!query || query.trim() === '') && source !== 'budget') ||
    (source === 'budget' && minPrice == null && maxPrice == null)
  ) {
    redirect('/');
  }
  const filters = parseFilters(searchParams);
  const products: SearchResult = await searchProducts(query, filters);
  const categories: Category[] = await getCategories();

  return (
    <Search
      initialProducts={products.products}
      initialTotalCount={products.totalCount}
      initialQuery={query}
      initialFilters={filters}
      initialCategories={categories}
      source={source}
    />
  );
}
