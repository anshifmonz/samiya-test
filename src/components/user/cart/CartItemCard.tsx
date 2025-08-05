'use client';

import { Badge } from 'ui/badge';
import { Button } from 'ui/button';
import { Checkbox } from 'ui/checkbox';
import { Card, CardContent } from 'ui/card';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from 'types/cart';

interface CartItemCardProps {
  item: CartItem;
  onSelectItem: (itemId: string, selected: boolean) => void;
  onQuantityChange: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

const CartItemCard = ({ item, onSelectItem, onQuantityChange, onRemoveItem }: CartItemCardProps) => {
  const calculateDiscount = (price: number, originalPrice?: number) => {
    if (!originalPrice) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <Card className={`transition-all ${item.selected ? 'ring-2 ring-primary/20 bg-primary/5' : ''}`}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Checkbox
            checked={item.selected}
            onCheckedChange={(checked) => onSelectItem(item.id, checked as boolean)}
          />
          <img
            src={item.image}
            alt={item.title}
            className="w-20 h-20 object-cover rounded-lg bg-muted"
          />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveItem(item.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-4 text-sm">
              <span>Size: <Badge variant="outline">{item.selectedSize}</Badge></span>
              <span>Color: <Badge variant="outline">{item.selectedColor}</Badge></span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold">₹{item.price}</span>
                {item.originalPrice && (
                  <>
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{item.originalPrice}
                    </span>
                    <Badge variant="destructive" className="text-xs">
                      {calculateDiscount(item.price, item.originalPrice)}% OFF
                    </Badge>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-medium w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItemCard;
