import { redirect } from 'next/navigation';
import { getServerUser } from 'lib/auth/getServerUser';
import { generateBaseMetadata } from 'lib/utils/generateMetadata';
import ResetPasswordForm from 'components/user/reset-password/ResetPasswordForm';

export const metadata = generateBaseMetadata({
  title: 'Reset Password',
  description: 'Set a new password for your Samiya Online account.',
  noIndex: true
});

export default async function ResetPasswordPage() {
  const user = await getServerUser();
  if (user) redirect('/');

  return <ResetPasswordForm />;
}
