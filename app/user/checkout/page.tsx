import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { type Address } from 'types/address';
import { getCheckout } from 'lib/api/user/checkout/get';
import { getServerUser } from 'lib/auth/getServerUser';
import { getUserAddresses } from 'lib/api/user/profile/address';
import Checkout from 'components/user/checkout/Checkout';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Checkout - Samiya Online',
  description: 'Complete your purchase securely at Samiya Online.',
  openGraph: {
    title: 'Checkout - Samiya Online',
    description: 'Complete your purchase securely at Samiya Online.',
    type: 'website',
    images: ['/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@samiya_online',
    title: 'Checkout - Samiya Online',
    description: 'Complete your purchase securely at Samiya Online.',
    images: ['/opengraph-image.png']
  }
};

export default async function CheckoutPage() {
  const user = await getServerUser();
  if (!user) redirect('/signin');

  const checkoutResult = await getCheckout(user.id);
  if (checkoutResult.error || !checkoutResult.data || !checkoutResult.data.items)
    redirect('/user/cart');
  const { data } = await getUserAddresses(user.id);
  const addresses = data || ([] as Address[]);

  return <Checkout checkoutData={checkoutResult.data} addresses={addresses} />;
}
