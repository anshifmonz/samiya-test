import { redirect } from 'next/navigation';
import UserLogin from 'components/auth/UserSignin';
import { getServerUser } from 'utils/getServerSession';
import { generateBaseMetadata } from 'lib/utils/generateMetadata';

export const metadata = generateBaseMetadata({
  title: 'Sign In',
  description:
    'Sign in to your Samiya Online account to manage your orders, wishlists, and personal information.',
  url: '/signin',
  noIndex: true
});

export default async function SignupPage() {
  const user = await getServerUser();
  if (user) redirect('/');

  return <UserLogin />;
}
