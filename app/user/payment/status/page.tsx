import { redirect } from 'next/navigation';
import Payment from 'components/user/payment/Payment';
import { getServerUser } from 'lib/auth/getServerUser';
import { generateBaseMetadata } from 'lib/utils/generateMetadata';

export const metadata = generateBaseMetadata({
  title: 'Payment Status',
  description: 'View the status of your recent payment.',
  noIndex: true
});

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
