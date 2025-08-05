import { redirect } from 'next/navigation';
import { getServerUser } from 'lib/auth/getServerUser';
import { getUserWishlists } from 'lib/user/wishlists/get';
import Wishlist from 'components/user/wishlists/Wishlist';

export default async function WishlistPage() {
  const user = await getServerUser();
  if (!user) redirect('/auth/login');

  const { wishlists } = await getUserWishlists(user.id);

  return <Wishlist wishlists={wishlists} />;
}
