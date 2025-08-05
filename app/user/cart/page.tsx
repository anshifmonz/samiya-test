import { redirect } from 'next/navigation';
import Cart from 'components/user/cart/Cart';
import { getServerUser } from 'lib/auth/getServerUser';
import { getUserCart } from 'lib/user/cart/get';

export default async function CartPage() {
  const user = await getServerUser();
  if (!user) redirect('/signin');

  const { data } = await getUserCart(user.id);
  const cartItems = data?.items || [];

  return <Cart initialCartItems={cartItems} />;
}
