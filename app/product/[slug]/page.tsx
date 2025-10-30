import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import getProduct from 'lib/public/product';
import { type Product } from 'types/product';
import { getServerUser } from 'lib/auth/getServerUser';
import similarProducts from 'lib/public/similarProducts';
import ProductPage from 'components/product/Product';
import SimilarProducts from 'components/product/SimilarProducts';

export const revalidate = 600;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const product: Product | null = await getProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.'
    };
  }

  const title = product.title + ' - Samiya Online';
  const description =
    product.description ||
    `Shop for ${product.title} at Samiya Online. Discover our exquisite collection of wedding and party dresses.`;
  const firstColor = Object.keys(product.images)[0];
  const imageUrl = product.images[firstColor]?.images[0]?.url || '/opengraph-image.png';

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

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = params;
  const user = await getServerUser();

  const product: Product | null = await getProduct(slug, user?.id);
  if (!product) notFound();

  const similarProductsData = await similarProducts(product.id, 8, 0);

  return (
    <>
      <ProductPage product={product} />
      <SimilarProducts productId={product.id} initialProducts={similarProductsData || []} />
    </>
  );
}
