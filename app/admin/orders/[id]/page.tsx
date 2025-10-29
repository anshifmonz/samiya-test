import type { Metadata } from 'next';
import { supabaseAdmin } from 'lib/supabase';
import type { OrderDetail } from 'types/admin/order';
import OrderDetails from 'components/admin/orders/[id]/OrderDetails';

async function getOrderDetails(orderId: string): Promise<OrderDetail | null> {
  const { data, error } = await supabaseAdmin.rpc('get_order_details', { p_order_id: orderId });
  if (error) return null;
  return data;
}

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const order = await getOrderDetails(params.id);

  if (!order) {
    return {
      title: 'Order Not Found - Admin',
      description: 'The requested order could not be found.'
    };
  }

  const title = `Order #${order.id} - Admin`;
  const description = `Details for order #${order.id} placed by ${order.user.name}. Status: ${order.status}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: ['/opengraph-image.png']
    },
    twitter: {
      card: 'summary_large_image',
      site: '@samiya_online',
      title,
      description,
      images: ['/opengraph-image.png']
    }
  };
}

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const order = await getOrderDetails(params.id);
  return <OrderDetails order={order} />;
}
