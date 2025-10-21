'use client';

import OrdersTable from './OrdersTable';
import { useOrders } from 'contexts/admin/orders/OrdersContext';
import AdminSearchBar from 'components/admin/shared/AdminSearchBar';
import { OrdersProvider } from 'contexts/admin/orders/OrdersContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'ui/select';

const OrdersTabContent = () => {
  const {
    orders,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy
  } = useOrders();

  return (
    <main className="min-h-screen bg-luxury-white p-4 pt-24 sm:p-6 sm:pt-24">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="mb-8">
          <div className="flex justify-between items-center animate-fade-in-up">
            <div className="mb-6">
              <h1 className="luxury-heading xs:text-2xl text-3xl sm:text-4xl text-luxury-black mb-2 sm:mb-4">
                Order Management
              </h1>
              <p className="luxury-body text-luxury-gray xs:text-sm text-base sm:text-lg">
                Manage your orders with ease
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-luxury-gray/20 rounded-xl p-3 sm:p-6">
          <div className="w-full">
            <AdminSearchBar searchQuery={searchQuery} onSearchChange={e => setSearchQuery(e)} />

            <div className="mt-6 mb-2">
              <div className="flex flex-col items-start justify-between gap-6 sm:gap-0">
                <div className="flex items-center justify-end gap-3 sm:gap-4 w-[100%]">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 max-w-[50%]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at">Newest First</SelectItem>
                      <SelectItem value="total_amount">Total Amount</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={statusFilter || 'all'}
                    onValueChange={value => setStatusFilter(value === 'all' ? null : value)}
                  >
                    <SelectTrigger className="w-48 max-w-[50%]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <OrdersTable orders={orders} loading={loading} error={error} />
          </div>
        </div>
      </div>
    </main>
  );
};

const OrdersTab = () => {
  return (
    <OrdersProvider>
      <OrdersTabContent />
    </OrdersProvider>
  );
};

export default OrdersTab;
