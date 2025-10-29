import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import getUserProfile from 'lib/api/user/profile/get';
import { getServerUser } from 'utils/getServerSession';
import ProfileOverview from 'components/user/profile/ProfileOverview';
import ProfileNavigation from 'components/user/profile/ProfileNavigation';

export const metadata: Metadata = {
  title: 'My Profile - Samiya Online',
  description: 'Manage your personal information, account settings, and preferences.',
  openGraph: {
    title: 'My Profile - Samiya Online',
    description: 'Manage your personal information, account settings, and preferences.',
    type: 'website',
    images: ['/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@samiya_online',
    title: 'My Profile - Samiya Online',
    description: 'Manage your personal information, account settings, and preferences.',
    images: ['/opengraph-image.png']
  }
};

export default async function ProfilePage() {
  const user = await getServerUser();
  if (!user) redirect('/signin');

  const { data } = await getUserProfile();
  const profile = data || null;
  if (!profile) redirect('/signin');

  return (
    <div className="min-h-screen bg-profile-bg">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          <ProfileOverview profile={profile} />
          <ProfileNavigation />
        </div>
      </div>
    </div>
  );
}
