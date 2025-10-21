'use client';

import { useRouter } from 'next/navigation';
import { Button } from 'ui/button';
import { apiRequest } from 'lib/utils/apiRequest';
import { type OrderDetail } from 'types/admin/order';

const OrderActions = ({ order }: { order: OrderDetail }) => {
  const router = useRouter();

  const handleApprove = async () => {
    const { error } = await apiRequest(`/api/admin/orders/${order.id}/approve`, {
      method: 'POST',
      body: { localOrderId: order.id },
      successMessage: 'Order approved successfully!',
      showSuccessToast: true
    });

    if (!error) router.refresh();
  };

  const handleCancel = async () => {
    const { error } = await apiRequest(`/api/admin/orders/${order.id}/cancel`, {
      method: 'POST',
      body: { localOrderId: order.id },
      successMessage: 'Order cancelled successfully!',
      showSuccessToast: true
    });

    if (!error) router.refresh();
  };

  return (
    <section className="bg-white rounded-xl border border-luxury-gray/10 p-8 shadow-sm">
      <h2 className="luxury-heading text-xl text-luxury-black mb-6">Order Actions</h2>
      <div className="space-y-4">
        <Button className="w-full" variant="outline">
          Print Invoice
        </Button>
        {order.status === 'pending' && (
          <>
            <Button className="w-full" onClick={handleCancel}>
              Cancel
            </Button>
            <Button className="w-full" variant="destructive" onClick={handleApprove}>
              Approve
            </Button>
          </>
        )}
      </div>
    </section>
  );
};

export default OrderActions;
