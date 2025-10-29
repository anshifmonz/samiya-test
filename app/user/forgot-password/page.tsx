import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerUser } from 'lib/auth/getServerUser';
import ForgotPasswordForm from 'components/user/forgot-password/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password - Samiya Online',
  description: 'Reset your password for Samiya Online account.',
  openGraph: {
    title: 'Forgot Password - Samiya Online',
    description: 'Reset your password for Samiya Online account.',
    type: 'website',
    images: ['/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@samiya_online',
    title: 'Forgot Password - Samiya Online',
    description: 'Reset your password for Samiya Online account.',
    images: ['/opengraph-image.png']
  }
};

export default async function ForgotPasswordPage() {
  const user = await getServerUser();
  if (user) redirect('/');

  return <ForgotPasswordForm />;
}
