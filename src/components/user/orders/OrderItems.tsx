'use client';

import Image from 'next/image';
import { Package } from 'lucide-react';
import { OrderHistoryItem } from 'types/order';

const OrderItems = ({ items }: { items: OrderHistoryItem[] }) => {
  return (
    <div className="space-y-3">
      <h4 className="font-medium text-foreground">Items Ordered</h4>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.product_name}
                  className="w-full h-full object-cover"
                  width={64}
                  height={64}
                />
              ) : (
                <Package className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <h5 className="font-medium text-foreground">{item.product_name}</h5>
              <p className="text-sm text-muted-foreground">
                Quantity: {item.quantity} × ₹{item.final_price.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-foreground">₹{item.total_price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItems;
