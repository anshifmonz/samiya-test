import { redirect } from 'next/navigation';
import UserSignup from 'components/auth/UserSignup';
import { getServerUser } from 'utils/getServerSession';
import { generateBaseMetadata } from 'lib/utils/generateMetadata';

export const metadata = generateBaseMetadata({
  title: 'Sign Up',
  description:
    'Create an account with Samiya Online to enjoy a personalized shopping experience, manage your orders, and access exclusive offers.',
  url: '/signup',
  noIndex: true
});

export default async function SignupPage() {
  const user = await getServerUser();
  if (user) redirect('/');

  return <UserSignup />;
}
