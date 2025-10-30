import { redirect } from 'next/navigation';
import Cart from 'components/user/cart/Cart';
import { getUserCart } from 'lib/api/user/cart/get';
import { getServerUser } from 'lib/auth/getServerUser';
import { generateBaseMetadata } from 'lib/utils/generateMetadata';

export const metadata = generateBaseMetadata({
  title: 'My Shopping Cart',
  description: 'Review your selected items and proceed to checkout.',
  noIndex: true
});

export default async function CartPage() {
  const user = await getServerUser();
  if (!user) redirect('/signin');

  const { data } = await getUserCart(user.id);
  const cartItems = data?.items || [];

  return <Cart initialCartItems={cartItems} />;
}
