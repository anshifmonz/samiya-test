import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import getProduct from 'lib/public/product';
import { type Product } from 'types/product';
import { getServerUser } from 'lib/auth/getServerUser';
import similarProducts from 'lib/public/similarProducts';
import ProductPage from 'components/product/Product';
import SimilarProducts from 'components/product/SimilarProducts';
import { generateBaseMetadata } from 'lib/utils/generateMetadata';

export const revalidate = 600;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const product: Product | null = await getProduct(slug);

  if (!product) {
    return generateBaseMetadata({
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
      noIndex: true
    });
  }

  const pageUrl = `/product/${slug}`;
  const title = `${product.title}`;
  const description =
    product.description ||
    `Shop ${product.title} at Samiya Online. Discover our exclusive collection of wedding, party, and casual dresses with elegant designs and premium fabric.`;

  const firstColor = Object.keys(product.images || {})[0];
  const imageUrl = product.images?.[firstColor]?.images?.[0]?.url;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: imageUrl,
    description: description,
    brand: {
      '@type': 'Brand',
      name: 'Samiya Online'
    },
    offers: {
      '@type': 'Offer',
      url: `https://www.samiyaonline.com${pageUrl}`,
      priceCurrency: 'INR',
      price: product.price || '0'
    }
  };

  return generateBaseMetadata({
    title,
    description,
    url: pageUrl,
    image: imageUrl,
    type: 'website',
    keywords: [
      product.title,
      'Samiya Online',
      'fashion',
      'dresses',
      'wedding wear',
      'abaya',
      'gown',
      'saree',
      'party wear'
    ],
    schema: jsonLd
  });
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
