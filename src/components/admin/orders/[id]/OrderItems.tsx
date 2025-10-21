import OrderItemCard from './OrderItemCard';
import { type OrderDetail } from 'types/admin/order';

const OrderItems = ({ items }: { items: OrderDetail['order_items'] }) => {
  return (
    <section className="bg-white rounded-xl border border-luxury-gray/10 p-8 shadow-sm">
      <h2 className="luxury-heading text-xl text-luxury-black mb-6">Order Items</h2>
      <div className="grid gap-4">
        {items.map(item => (
          <OrderItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default OrderItems;
