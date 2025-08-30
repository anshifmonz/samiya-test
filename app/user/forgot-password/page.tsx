import ForgotPasswordForm from 'components/user/forgot-password/ForgotPasswordForm';
import { getServerUser } from 'lib/auth/getServerUser';
import { redirect } from 'next/navigation';

export default async function ForgotPasswordPage() {
  const user = await getServerUser();
  if (user) redirect('/');

  return <ForgotPasswordForm />;
}
