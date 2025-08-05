import { redirect } from 'next/navigation';
import { getServerUser } from 'lib/auth/getServerUser';
import Security from "components/user/security/Security";

export default async function SecurityPage() {
  const user = await getServerUser();
  if (!user) redirect('/signin');

  return <Security />;
}
