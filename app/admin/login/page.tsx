import type { Metadata } from 'next';
import AdminLogin from 'components/admin/AdminLogin';

export const metadata: Metadata = {
  title: 'Admin Login - Samiya Online',
  description: 'Log in to the Samiya Online administration panel.',
  openGraph: {
    title: 'Admin Login - Samiya Online',
    description: 'Log in to the Samiya Online administration panel.',
    type: 'website',
    images: ['/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@samiya_online',
    title: 'Admin Login - Samiya Online',
    description: 'Log in to the Samiya Online administration panel.',
    images: ['/opengraph-image.png']
  }
};

export default function LoginPage() {
  return <AdminLogin />;
}
