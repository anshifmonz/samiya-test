import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import UserSignup from 'components/auth/UserSignup';
import { getServerUser } from 'utils/getServerSession';

export const metadata: Metadata = {
  title: 'Sign Up - Samiya Online',
  description:
    'Create an account with Samiya Online to enjoy a personalized shopping experience, manage your orders, and access exclusive offers.',
  openGraph: {
    title: 'Sign Up - Samiya Online',
    description:
      'Create an account with Samiya Online to enjoy a personalized shopping experience, manage your orders, and access exclusive offers.',
    type: 'website',
    images: ['/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@samiya_online',
    title: 'Sign Up - Samiya Online',
    description:
      'Create an account with Samiya Online to enjoy a personalized shopping experience, manage your orders, and access exclusive offers.',
    images: ['/opengraph-image.png']
  }
};

export default async function SignupPage() {
  const user = await getServerUser();
  if (user) redirect('/');

  return <UserSignup />;
}
