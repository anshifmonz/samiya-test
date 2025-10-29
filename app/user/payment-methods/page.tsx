import type { Metadata } from 'next';
import PaymentMethods from 'components/user/payment-methods/PaymentMethods';

export const metadata: Metadata = {
  title: 'Payment Methods - Samiya Online',
  description: 'Manage your saved payment methods for quick and easy checkout.',
  openGraph: {
    title: 'Payment Methods - Samiya Online',
    description: 'Manage your saved payment methods for quick and easy checkout.',
    type: 'website',
    images: ['/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@samiya_online',
    title: 'Payment Methods - Samiya Online',
    description: 'Manage your saved payment methods for quick and easy checkout.',
    images: ['/opengraph-image.png']
  }
};

export default function PaymentPage() {
  return <PaymentMethods />;
}
