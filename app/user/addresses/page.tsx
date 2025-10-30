import { redirect } from 'next/navigation';
import type { Address } from 'types/address';
import { getServerUser } from 'lib/auth/getServerUser';
import { mapAddressesToDisplay } from 'utils/addressMapper';
import AddressBook from 'components/user/address/AddressBook';
import { getUserAddresses } from 'lib/api/user/profile/address';
import { generateBaseMetadata } from 'lib/utils/generateMetadata';

export const metadata = generateBaseMetadata({
  title: 'My Addresses',
  description: 'Manage your saved shipping and billing addresses for faster checkout.',
  noIndex: true
});

export default async function AddressPage() {
  const user = await getServerUser();
  if (!user) redirect('/signin');

  const { data } = await getUserAddresses(user.id);
  const addresses = data || ([] as Address[]);
  const displayAddresses = mapAddressesToDisplay(addresses);

  return <AddressBook initialAddresses={displayAddresses} />;
}
