import { redirect } from 'next/navigation';
import Cart from 'components/user/cart/Cart';
import { getServerUser } from 'lib/auth/getServerUser';

export default async function CartPage() {
  const user = await getServerUser();
  if (!user) redirect('/signin');

  return <Cart />;
}
