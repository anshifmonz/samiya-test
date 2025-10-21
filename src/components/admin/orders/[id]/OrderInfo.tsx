import { Badge } from 'ui/badge';
import { Hash } from 'lucide-react';
import { type OrderDetail } from 'types/admin/order';

const OrderInfo = ({ order }: { order: OrderDetail }) => {
  return (
    <section className="bg-white rounded-xl border border-luxury-gray/10 p-8 shadow-sm">
      <header className="flex items-center mb-6">
        <div className="w-12 h-12 bg-luxury-gold/10 rounded-lg flex items-center justify-center mr-4">
          <Hash className="w-6 h-6 text-luxury-gold" />
        </div>
        <h2 className="luxury-heading text-xl text-luxury-black">Order Information</h2>
      </header>
      <div className="space-y-4">
        <div>
          <h3 className="luxury-body text-sm text-luxury-gray uppercase tracking-wider mb-1">
            Order ID
          </h3>
          <p className="luxury-body text-luxury-black font-medium">#{order.id.substring(0, 6)}</p>
        </div>
        <div>
          <h3 className="luxury-body text-sm text-luxury-gray uppercase tracking-wider mb-1">
            Order Date
          </h3>
          <p className="luxury-body text-luxury-black font-medium">
            {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
        <div>
          <h3 className="luxury-body text-sm text-luxury-gray uppercase tracking-wider mb-1">
            Order Status
          </h3>
          <Badge>{order.status}</Badge>
        </div>
        <div>
          <h3 className="luxury-body text-sm text-luxury-gray uppercase tracking-wider mb-1">
            Payment Method
          </h3>
          <p className="luxury-body text-luxury-black font-medium">{order.payment_method}</p>
        </div>
        <div>
          <h3 className="luxury-body text-sm text-luxury-gray uppercase tracking-wider mb-1">
            Payment Status
          </h3>
          <Badge variant={order.payment_status === 'paid' ? 'success' : 'warning'}>
            {order.payment_status}
          </Badge>
        </div>
      </div>
    </section>
  );
};

export default OrderInfo;
