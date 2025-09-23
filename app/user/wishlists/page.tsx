import { getUserWishlists } from 'lib/api/user/wishlists/get';
import Wishlist from 'components/user/wishlists/Wishlist';

export default async function WishlistPage() {
  const { data } = await getUserWishlists();
  const wishlists = data || [];

  return <Wishlist wishlists={wishlists} />;
}
