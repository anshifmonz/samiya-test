import { type OrderDetail } from 'types/admin/order';

const FinancialSummary = ({ summary }: { summary: OrderDetail['financial_summary'] }) => {
  return (
    <section className="bg-white rounded-xl border border-luxury-gray/10 p-8 shadow-sm">
      <h2 className="luxury-heading text-xl text-luxury-black mb-6">Financial Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <p className="text-luxury-gray">Subtotal</p>
          <p className="font-medium text-luxury-black">₹{summary.subtotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-luxury-gray">Discount</p>
          <p className="font-medium text-luxury-black">- ₹{summary.discount.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-luxury-gray">Shipping</p>
          <p className="font-medium text-luxury-black">₹{summary.shipping_cost.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-luxury-gray">Taxes</p>
          <p className="font-medium text-luxury-black">₹{summary.taxes.toFixed(2)}</p>
        </div>
        <div className="border-t border-luxury-gray/20 my-4"></div>
        <div className="flex justify-between text-lg">
          <p className="font-bold text-luxury-black">Grand Total</p>
          <p className="font-bold text-luxury-black">₹{summary.grand_total.toFixed(2)}</p>
        </div>
      </div>
    </section>
  );
};

export default FinancialSummary;
