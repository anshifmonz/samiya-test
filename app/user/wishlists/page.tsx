import type { Metadata } from 'next';
import Wishlist from 'components/user/wishlists/Wishlist';
import { getUserWishlists } from 'lib/api/user/wishlists/get';

export const metadata: Metadata = {
  title: 'My Wishlists - Samiya Online',
  description: 'View and manage your saved wishlists.',
  openGraph: {
    title: 'My Wishlists - Samiya Online',
    description: 'View and manage your saved wishlists.',
    type: 'website',
    images: ['/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@samiya_online',
    title: 'My Wishlists - Samiya Online',
    description: 'View and manage your saved wishlists.',
    images: ['/opengraph-image.png']
  }
};

export default async function WishlistPage() {
  const { data } = await getUserWishlists();
  const wishlists = data || [];

  return <Wishlist wishlists={wishlists} />;
}
