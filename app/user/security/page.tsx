import { redirect } from 'next/navigation';
import getUserProfile from 'lib/api/user/profile/get';
import { getServerUser } from 'lib/auth/getServerUser';
import Security from 'components/user/security/Security';

export default async function SecurityPage() {
  const user = await getServerUser();
  if (!user) redirect('/signin');

  const { data } = await getUserProfile();
  return <Security profile={data} />;
}
