import { Edit } from 'lucide-react';
import { Button } from 'components/ui/button';
import { useCouponsTab } from '@/contexts/admin/coupons/CouponsContext';

const CouponsTable = () => {
  const { coupons, loading, error, expireCoupon, openEditDialog } = useCouponsTab();

  if (error) {
    return (
      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-luxury-gray/20 bg-white/95 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-luxury-gray/20">
          <thead className="bg-luxury-gray/5">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-luxury-gray uppercase tracking-wider">
                Coupon Code
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-luxury-gray uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-luxury-gray uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-luxury-gray uppercase tracking-wider">
                End Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-luxury-gray uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-luxury-gray uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-luxury-gray/10">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center space-x-2 text-luxury-gray">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-luxury-gold"></div>
                    <span className="text-sm">Loading coupons...</span>
                  </div>
                </td>
              </tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <div className="text-luxury-gray">
                    <p className="text-sm font-medium">No coupons found</p>
                  </div>
                </td>
              </tr>
            ) : (
              coupons.map(coupon => (
                <tr
                  key={coupon.id}
                  className="hover:bg-luxury-gray/5 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-luxury-black">
                    {coupon.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-luxury-gray">
                    {coupon.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-luxury-gray">
                    {new Date(coupon.start_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-luxury-gray">
                    {new Date(coupon.end_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-luxury-gray">
                    {new Date(coupon.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(coupon)}
                        className="text-luxury-gold hover:text-yellow-500 hover:bg-yellow-50"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => expireCoupon(coupon.id)}>
                        Expire
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CouponsTable;
