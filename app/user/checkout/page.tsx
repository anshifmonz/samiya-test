import { redirect } from 'next/navigation';
import { getCheckout } from 'lib/user/checkout/get';
import { getServerUser } from 'lib/auth/getServerUser';
import Checkout from 'components/user/checkout/Checkout';
import { getUserAddresses } from 'lib/user/profile/address';
import { type CheckoutData } from 'types/checkout';
import { type Address } from 'types/address';

export default async function CheckoutPage() {
  const user = await getServerUser();
  if (!user) redirect('/signin');

  const checkoutResult = await getCheckout(user.id) as { data: CheckoutData };
  const addresses = await getUserAddresses(user.id) as Address[];

  return <Checkout checkoutData={checkoutResult.data} addresses={addresses} />;
}
