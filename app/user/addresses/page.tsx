import { redirect } from 'next/navigation';
import { getServerUser } from 'lib/auth/getServerUser';
import { getUserAddresses } from 'lib/api/user/profile/address';
import { mapAddressesToDisplay } from 'utils/addressMapper';
import AddressBook from 'components/user/address/AddressBook';
import { type Address } from 'types/address';

export default async function AddressPage() {
  const user = await getServerUser();
  if (!user) redirect('/signin');

  const { data } = await getUserAddresses(user.id);
  const addresses = data || ([] as Address[]);
  const displayAddresses = mapAddressesToDisplay(addresses);

  return <AddressBook initialAddresses={displayAddresses} />;
}
