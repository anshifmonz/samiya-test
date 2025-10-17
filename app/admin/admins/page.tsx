import { getUsers } from 'lib/api/admin/users/getUsers';
import { Admins } from 'components/admin/admins';

export default async function AdminsPage() {
  const { users } = await getUsers();
  return <Admins initialAdmins={users || []} />;
}
