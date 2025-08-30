import ResetPasswordForm from 'components/user/reset-password/ResetPasswordForm';
import { getServerUser } from 'lib/auth/getServerUser';
import { redirect } from 'next/navigation';

export default async function ResetPasswordPage() {
  const user = await getServerUser();
  if (user) redirect('/');

  return <ResetPasswordForm />;
}
