import Image from 'next/image';
import { Card, CardContent } from 'ui/card';
import { type OrderDetail } from 'types/admin/order';

const OrderItemCard = ({ item }: { item: OrderDetail['order_items'][0] }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative flex-shrink-0 aspect-[5/6] w-24">
            <Image
              src={item.product_image}
              alt={item.product_name}
              width={120}
              height={144}
              className="object-cover rounded flex-shrink-0"
            />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start h-full">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="font-semibold text-foreground text-lg line-clamp-1">
                    {item.product_name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {item.color_name} / {item.size_name}
                  </p>
                  <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xl font-bold text-foreground">
                      ₹{item.final_price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col h-full items-end justify-between">
                <div className="text-sm">Qty: {item.quantity}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderItemCard;
