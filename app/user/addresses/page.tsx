import { redirect } from 'next/navigation';
import { getServerUser } from 'lib/auth/getServerUser';
import { getUserAddresses } from 'lib/api/user/profile/address';
import { mapAddressesToDisplay } from 'utils/addressMapper';
import AddressBook from 'components/user/address/AddressBook';
import type { Metadata } from 'next';
import type { Address } from 'types/address';

export const metadata: Metadata = {
  title: 'My Addresses - Samiya Online',
  description: 'Manage your saved shipping and billing addresses for faster checkout.',
  openGraph: {
    title: 'My Addresses - Samiya Online',
    description: 'Manage your saved shipping and billing addresses for faster checkout.',
    type: 'website',
    images: ['/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@samiya_online',
    title: 'My Addresses - Samiya Online',
    description: 'Manage your saved shipping and billing addresses for faster checkout.',
    images: ['/opengraph-image.png']
  }
};

export default async function AddressPage() {
  const user = await getServerUser();
  if (!user) redirect('/signin');

  const { data } = await getUserAddresses(user.id);
  const addresses = data || ([] as Address[]);
  const displayAddresses = mapAddressesToDisplay(addresses);

  return <AddressBook initialAddresses={displayAddresses} />;
}
