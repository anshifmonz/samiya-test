import { redirect } from 'next/navigation';
import { getServerUser } from 'lib/auth/getServerUser';
import { getUserWishlists } from 'lib/user/wishlists/get';
import Wishlist from 'components/user/wishlists/Wishlist';

export default async function WishlistPage() {
  const user = await getServerUser();
  if (!user) redirect('/auth/login');

  const { data } = await getUserWishlists(user.id);
  const wishlists = data || [];

  return <Wishlist wishlists={wishlists} />;
}
