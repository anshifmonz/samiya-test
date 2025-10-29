import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import getUserProfile from 'lib/api/user/profile/get';
import { getServerUser } from 'lib/auth/getServerUser';
import Security from 'components/user/security/Security';

export const metadata: Metadata = {
  title: 'Account Security - Samiya Online',
  description:
    'Manage your account security settings, including password and two-factor authentication.',
  openGraph: {
    title: 'Account Security - Samiya Online',
    description:
      'Manage your account security settings, including password and two-factor authentication.',
    type: 'website',
    images: ['/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@samiya_online',
    title: 'Account Security - Samiya Online',
    description:
      'Manage your account security settings, including password and two-factor authentication.',
    images: ['/opengraph-image.png']
  }
};

export default async function SecurityPage() {
  const user = await getServerUser();
  if (!user) redirect('/signin');

  const { data } = await getUserProfile();
  return <Security profile={data} />;
}
