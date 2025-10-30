import Wishlist from 'components/user/wishlists/Wishlist';
import { getUserWishlists } from 'lib/api/user/wishlists/get';
import { generateBaseMetadata } from 'lib/utils/generateMetadata';

export const metadata = generateBaseMetadata({
  title: 'My Wishlists',
  description: 'View and manage your saved wishlists.',
  noIndex: true
});

export default async function WishlistPage() {
  const { data } = await getUserWishlists();
  const wishlists = data || [];

  return <Wishlist wishlists={wishlists} />;
}
