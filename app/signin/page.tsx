import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import UserLogin from 'components/auth/UserSignin';
import { getServerUser } from 'utils/getServerSession';

export const metadata: Metadata = {
  title: 'Sign In - Samiya Online',
  description:
    'Sign in to your Samiya Online account to manage your orders, wishlists, and personal information.',
  openGraph: {
    title: 'Sign In - Samiya Online',
    description:
      'Sign in to your Samiya Online account to manage your orders, wishlists, and personal information.',
    type: 'website',
    images: ['/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@samiya_online',
    title: 'Sign In - Samiya Online',
    description:
      'Sign in to your Samiya Online account to manage your orders, wishlists, and personal information.',
    images: ['/opengraph-image.png']
  }
};

export default async function SignupPage() {
  const user = await getServerUser();
  if (user) redirect('/');

  return <UserLogin />;
}
