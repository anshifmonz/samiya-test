import { redirect } from 'next/navigation';
import { type Address } from 'types/address';
import { getCheckout } from 'lib/user/checkout/get';
import { getServerUser } from 'lib/auth/getServerUser';
import { getUserAddresses } from 'lib/user/profile/address';
import Checkout from 'components/user/checkout/Checkout';

export const dynamic = 'force-dynamic';

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
