import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerUser } from 'lib/auth/getServerUser';
import Payment from 'components/user/payment/Payment';

export const metadata: Metadata = {
  title: 'Payment Status - Samiya Online',
  description: 'View the status of your recent payment.',
  openGraph: {
    title: 'Payment Status - Samiya Online',
    description: 'View the status of your recent payment.',
    type: 'website',
    images: ['/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@samiya_online',
    title: 'Payment Status - Samiya Online',
    description: 'View the status of your recent payment.',
    images: ['/opengraph-image.png']
  }
};

interface PaymentReturnPageProps {
  searchParams: {
    order_id?: string;
    status?: string;
  };
}

export default async function PaymentReturnPage({ searchParams }: PaymentReturnPageProps) {
  const user = await getServerUser();
  if (!user) redirect('/signin');

  const { order_id } = searchParams;
  if (!order_id) redirect('/user/orders');

  return <Payment orderId={order_id} />;
}
