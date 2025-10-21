import { User } from 'lucide-react';
import { type OrderDetail } from 'types/admin/order';

const CustomerDetails = ({
  user,
  shippingAddress,
  billingAddress
}: {
  user: OrderDetail['user'];
  shippingAddress: OrderDetail['shipping_address'];
  billingAddress: OrderDetail['billing_address'];
}) => {
  return (
    <section className="bg-white rounded-xl border border-luxury-gray/10 p-8 shadow-sm">
      <header className="flex items-center mb-6">
        <div className="w-12 h-12 bg-luxury-gold/10 rounded-lg flex items-center justify-center mr-4">
          <User className="w-6 h-6 text-luxury-gold" />
        </div>
        <h2 className="luxury-heading text-xl text-luxury-black">Customer Details</h2>
      </header>
      <div className="space-y-4">
        <div>
          <h3 className="luxury-body text-sm text-luxury-gray uppercase tracking-wider mb-1">
            Name
          </h3>
          <p className="luxury-body text-luxury-black font-medium">{user.name}</p>
        </div>
        <div>
          <h3 className="luxury-body text-sm text-luxury-gray uppercase tracking-wider mb-1">
            Email
          </h3>
          <p className="luxury-body text-luxury-black font-medium">{user.email}</p>
        </div>
        <div>
          <h3 className="luxury-body text-sm text-luxury-gray uppercase tracking-wider mb-1">
            Phone
          </h3>
          <p className="luxury-body text-luxury-black font-medium">{user.phone}</p>
        </div>
      </div>
      <div className="mt-8 flex justify-between gap-8 flex-col lg:flex-row">
        <div>
          <h3 className="luxury-body text-sm text-luxury-gray uppercase tracking-wider mb-4">
            Shipping Address
          </h3>
          <address className="not-italic space-y-2 text-luxury-black">
            <p>{shippingAddress.full_name}</p>
            <p>
              {shippingAddress.street}, {shippingAddress.landmark}
            </p>
            <p>
              {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postal_code}
            </p>
            <p>{shippingAddress.country}</p>
          </address>
        </div>
        <div>
          <h3 className="luxury-body text-sm text-luxury-gray uppercase tracking-wider mb-4">
            Billing Address
          </h3>
          <address className="not-italic space-y-2 text-luxury-black">
            <p>{billingAddress.full_name}</p>
            <p>
              {billingAddress.street}, {billingAddress.landmark}
            </p>
            <p>
              {billingAddress.city}, {billingAddress.state} - {billingAddress.postal_code}
            </p>
            <p>{billingAddress.country}</p>
          </address>
        </div>
      </div>
    </section>
  );
};

export default CustomerDetails;
