import { redirect } from 'next/navigation';
import { type Address } from 'types/address';
import { getServerUser } from 'lib/auth/getServerUser';
import { getCheckout } from 'lib/api/user/checkout/get';
import Checkout from 'components/user/checkout/Checkout';
import { getUserAddresses } from 'lib/api/user/profile/address';
import { generateBaseMetadata } from 'lib/utils/generateMetadata';

export const dynamic = 'force-dynamic';

export const metadata = generateBaseMetadata({
  title: 'Checkout',
  description: 'Complete your purchase securely at Samiya Online.',
  noIndex: true
});

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
