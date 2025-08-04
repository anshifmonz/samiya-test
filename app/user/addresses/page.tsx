import { redirect } from 'next/navigation';
import { getServerUser } from 'lib/auth/getServerUser';
import { getUserAddresses } from 'lib/user/profile/address';
import { mapAddressesToDisplay } from 'utils/addressMapper';
import AddressBook from 'components/user/address/AddressBook';

export default async function AddressPage() {
  const user = await getServerUser();
  if (!user) redirect('/signin');

  const addresses = await getUserAddresses(user.id);
  const displayAddresses = mapAddressesToDisplay(addresses);

  return <AddressBook initialAddresses={displayAddresses} />;
}
