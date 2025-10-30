import { redirect } from 'next/navigation';
import { getServerUser } from 'lib/auth/getServerUser';
import { generateBaseMetadata } from 'lib/utils/generateMetadata';
import ForgotPasswordForm from 'components/user/forgot-password/ForgotPasswordForm';

export const metadata = generateBaseMetadata({
  title: 'Forgot Password',
  description: 'Reset your password for Samiya Online account.',
  noIndex: true
});

export default async function ForgotPasswordPage() {
  const user = await getServerUser();
  if (user) redirect('/');

  return <ForgotPasswordForm />;
}
