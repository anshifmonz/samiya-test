"use client";

import { Package } from "lucide-react";
import { OrderItem } from "@/types/order";

interface OrderItemsProps {
  items: OrderItem[];
}

const OrderItems = ({ items }: OrderItemsProps) => {
  return (
    <div className="space-y-3">
      <h4 className="font-medium text-foreground">Items Ordered</h4>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h5 className="font-medium text-foreground">{item.name}</h5>
              <p className="text-sm text-muted-foreground">
                Quantity: {item.quantity} × ${item.price.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-foreground">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItems;