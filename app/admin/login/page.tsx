import AdminLogin from 'components/admin/AdminLogin';
import { generateBaseMetadata } from 'lib/utils/generateMetadata';

export const metadata = generateBaseMetadata({
  title: 'Admin Login',
  description: 'Log in to the Samiya Online administration panel.',
  noIndex: true
});

export default function LoginPage() {
  return <AdminLogin />;
}
