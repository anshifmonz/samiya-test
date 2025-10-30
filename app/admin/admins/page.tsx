import { Admins } from 'components/admin/admins';
import { getUsers } from 'lib/api/admin/users/getUsers';
import { generateBaseMetadata } from 'lib/utils/generateMetadata';

export const metadata = generateBaseMetadata({
  title: 'Admin Users',
  description: 'Manage administrator accounts and permissions.',
  noIndex: true
});

export default async function AdminsPage() {
  const { users } = await getUsers();
  return <Admins initialAdmins={users || []} />;
}
