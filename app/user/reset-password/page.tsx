import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerUser } from 'lib/auth/getServerUser';
import ResetPasswordForm from 'components/user/reset-password/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password - Samiya Online',
  description: 'Set a new password for your Samiya Online account.',
  openGraph: {
    title: 'Reset Password - Samiya Online',
    description: 'Set a new password for your Samiya Online account.',
    type: 'website',
    images: ['/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@samiya_online',
    title: 'Reset Password - Samiya Online',
    description: 'Set a new password for your Samiya Online account.',
    images: ['/opengraph-image.png']
  }
};

export default async function ResetPasswordPage() {
  const user = await getServerUser();
  if (user) redirect('/');

  return <ResetPasswordForm />;
}
