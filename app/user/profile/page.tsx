import { redirect } from 'next/navigation';
import getUserProfile from 'lib/api/user/profile/get';
import { getServerUser } from 'utils/getServerSession';
import { generateBaseMetadata } from 'lib/utils/generateMetadata';
import ProfileOverview from 'components/user/profile/ProfileOverview';
import ProfileNavigation from 'components/user/profile/ProfileNavigation';

export const metadata = generateBaseMetadata({
  title: 'My Profile',
  description: 'Manage your personal information, account settings, and preferences.',
  noIndex: true
});

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
