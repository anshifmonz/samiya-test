import { Card } from 'ui/card';
import { ShoppingBag } from 'lucide-react';
import OrderInfo from './OrderInfo';
import OrderItems from './OrderItems';
import OrderActions from './OrderActions';
import CustomerDetails from './CustomerDetails';
import FinancialSummary from './FinancialSummary';
import { type OrderDetail } from 'types/admin/order';

const OrderDetails = ({ order }: { order: OrderDetail }) => {
  if (!order) {
    return (
      <main className="min-h-screen bg-luxury-white pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <header className="text-center mb-16">
            <h1 className="luxury-heading text-4xl md:text-5xl text-luxury-black mb-4">
              Order Details
            </h1>
            <p className="luxury-body text-luxury-gray text-lg max-w-2xl mx-auto">
              Order #{order.id.substring(0, 6)}
            </p>
          </header>
          <Card className="bg-profile-card border-profile-border p-8 pt-20 pb-20 text-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No orders found</h3>
            <p className="text-muted-foreground">
              No orders found for ID #{order.id.substring(0, 6)}
            </p>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-luxury-white pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="text-center mb-16">
          <h1 className="luxury-heading text-4xl md:text-5xl text-luxury-black mb-4">
            Order Details
          </h1>
          <p className="luxury-body text-luxury-gray text-lg max-w-2xl mx-auto">
            Order #{order.id.substring(0, 6)}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <OrderItems items={order.order_items} />
            <FinancialSummary summary={order.financial_summary} />
            <CustomerDetails
              user={order.user}
              shippingAddress={order.shipping_address}
              billingAddress={order.billing_address}
            />
          </div>
          <div className="space-y-8">
            <OrderInfo order={order} />
            <OrderActions order={order} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderDetails;
