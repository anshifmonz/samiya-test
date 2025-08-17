import { redirect } from 'next/navigation';
import { getServerUser } from 'lib/auth/getServerUser';
import PaymentReturn from 'components/user/payment/PaymentReturn';

interface PaymentReturnPageProps {
  searchParams: {
    order_id?: string;
    status?: string;
  };
}

export default async function PaymentReturnPage({ searchParams }: PaymentReturnPageProps) {
  const user = await getServerUser();
  if (!user) redirect('/signin');

  const { order_id, status } = searchParams;
  if (!order_id) redirect('/user/orders');

  return <PaymentReturn orderId={order_id} status={status} />;
}
