import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Cart from 'components/user/cart/Cart';
import { getServerUser } from 'lib/auth/getServerUser';
import { getUserCart } from 'lib/api/user/cart/get';

export const metadata: Metadata = {
  title: 'My Shopping Cart - Samiya Online',
  description: 'Review your selected items and proceed to checkout.',
  openGraph: {
    title: 'My Shopping Cart - Samiya Online',
    description: 'Review your selected items and proceed to checkout.',
    type: 'website',
    images: ['/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@samiya_online',
    title: 'My Shopping Cart - Samiya Online',
    description: 'Review your selected items and proceed to checkout.',
    images: ['/opengraph-image.png']
  }
};

export default async function CartPage() {
  const user = await getServerUser();
  if (!user) redirect('/signin');

  const { data } = await getUserCart(user.id);
  const cartItems = data?.items || [];

  return <Cart initialCartItems={cartItems} />;
}
