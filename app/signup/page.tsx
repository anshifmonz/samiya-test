import UserSignup from 'components/auth/UserSignup';
import { getServerUser } from 'utils/getServerSession';
import { redirect } from 'next/navigation';

export default async function SignupPage() {
  const user = await getServerUser();
  if (user) redirect('/');

  return <UserSignup />;
}
