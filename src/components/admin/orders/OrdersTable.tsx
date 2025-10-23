'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Badge } from 'ui/badge';
import { Button } from 'ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'ui/select';
import { useOrders } from 'contexts/admin/orders/OrdersContext';

import { type Order } from 'types/admin/order';

const OrdersTable = ({
  orders,
  loading,
  error
}: {
  orders: Order[];
  loading: boolean;
  error: string | null;
}) => {
  const { approveOrder, cancelOrder, updateStatus } = useOrders();
  const [localOrders, setLocalOrders] = useState<Order[]>(orders || []);
  const [updatingStatus, setUpdatingStatus] = useState<Record<string, boolean>>({});

  // keep localOrders in sync when parent updates
  useEffect(() => {
    setLocalOrders(orders || []);
  }, [orders]);

  const setUpdating = (orderId: string, value: boolean) =>
    setUpdatingStatus(prev => ({ ...prev, [orderId]: value }));

  if (error) {
    return (
      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'processing':
        return <Badge variant="info">Processing</Badge>;
      case 'shipped':
        return <Badge variant="success">Shipped</Badge>;
      case 'delivered':
        return <Badge variant="success">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'refunded':
        return <Badge variant="outline">Refunded</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-luxury-gray/20 bg-white/95 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-luxury-gray/20">
          <thead className="bg-luxury-gray/5">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-luxury-gray uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-luxury-gray uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-luxury-gray uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-luxury-gray uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-luxury-gray uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-luxury-gray uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-luxury-gray uppercase tracking-wider">
                SKUs
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-luxury-gray uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-luxury-gray/10">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center space-x-2 text-luxury-gray">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-luxury-gold"></div>
                    <span className="text-sm">Loading orders...</span>
                  </div>
                </td>
              </tr>
            ) : localOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center">
                  <div className="text-luxury-gray">
                    <p className="text-sm font-medium">No orders found</p>
                  </div>
                </td>
              </tr>
            ) : (
              localOrders.map(order => (
                <tr
                  key={order.id}
                  className="hover:bg-luxury-gray/5 transition-colors duration-200"
                >
                  <Link href={`/admin/orders/${order.id}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-luxury-black">
                      #{order.id.substring(0, 6)}
                    </td>
                  </Link>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-luxury-gray">
                    <div>{order.user_name}</div>
                    {order.user_email && (
                      <div className="text-xs text-luxury-gray/70">{order.user_email}</div>
                    )}
                    {order.user_phone && (
                      <div className="text-xs text-luxury-gray/70">{order.user_phone}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-luxury-gray">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-luxury-gray">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-luxury-gray">
                    ₹{order.final_price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-luxury-gray">
                    <Badge variant={order.payment_status === 'paid' ? 'success' : 'warning'}>
                      {order.payment_status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-luxury-gray">
                    {order.skus?.join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {order.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => approveOrder(order.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => cancelOrder(order.id)}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {order.status !== 'pending' && (
                        <Select
                          value={order.status}
                          onValueChange={async (val: string) => {
                            // prevent duplicate updates
                            if (updatingStatus[order.id]) return;
                            const prevStatus = order.status;
                            try {
                              // optimistic update
                              setLocalOrders(prev =>
                                prev.map(o => (o.id === order.id ? { ...o, status: val } : o))
                              );
                              setUpdating(order.id, true);
                              const { error } = await updateStatus(order.id, val);
                              if (error) {
                                // revert on failure
                                setLocalOrders(prev =>
                                  prev.map(o =>
                                    o.id === order.id ? { ...o, status: prevStatus } : o
                                  )
                                );
                              }
                            } finally {
                              setUpdating(order.id, false);
                            }
                          }}
                        >
                          <SelectTrigger className="h-8 w-40" disabled={!!updatingStatus[order.id]}>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-luxury-gray">Update status</span>
                              <SelectValue className="sr-only" />
                              {updatingStatus[order.id] && (
                                <div className="ml-2 animate-spin rounded-full h-3 w-3 border-b-2 border-luxury-gold" />
                              )}
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="shipped" className="cursor-pointer">
                              Shipped
                            </SelectItem>
                            <SelectItem value="delivered" className="cursor-pointer">
                              Delivered
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
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

export default OrdersTable;
