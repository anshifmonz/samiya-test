import type { Metadata } from 'next';
import { Admins } from 'components/admin/admins';
import { getUsers } from 'lib/api/admin/users/getUsers';

export const metadata: Metadata = {
  title: 'Admin Users - Admin',
  description: 'Manage administrator accounts and permissions.',
  openGraph: {
    title: 'Admin Users - Admin',
    description: 'Manage administrator accounts and permissions.',
    type: 'website',
    images: ['/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@samiya_online',
    title: 'Admin Users - Admin',
    description: 'Manage administrator accounts and permissions.',
    images: ['/opengraph-image.png']
  }
};

export default async function AdminsPage() {
  const { users } = await getUsers();
  return <Admins initialAdmins={users || []} />;
}
