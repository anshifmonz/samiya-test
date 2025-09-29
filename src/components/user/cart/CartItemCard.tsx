'use client';

import Image from 'next/image';
import { Badge } from 'ui/badge';
import { Button } from 'ui/button';
import { Checkbox } from 'ui/checkbox';
import { Card, CardContent } from 'ui/card';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from 'types/cart';
import { useCartContext } from 'contexts/user/CartContext';
import isCloudinaryUrl from 'src/lib/utils/isCloudinaryUrls';
import CloudinaryWithFallback from 'components/shared/CloudinaryWithFallback';

const CartItemCard = ({ item }: { item: CartItem }) => {
  const { handleSelectItem, handleQuantityChange, handleRemoveItem } = useCartContext();

  const calculateDiscount = (price: number, originalPrice?: number) => {
    if (!originalPrice) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <Card
      className={`transition-all ${item.isSelected ? 'ring-2 ring-primary/20 bg-primary/5' : ''}`}
    >
      <CardContent className="p-2 sm:p-4">
        <div className="flex gap-2 sm:gap-4">
          <Checkbox
            checked={item.isSelected}
            onCheckedChange={checked => handleSelectItem(item.id, checked as boolean)}
          />
          <div className="relative flex-shrink-0 aspect-[5/6] w-24">
            {isCloudinaryUrl(item.image) ? (
              <CloudinaryWithFallback
                src={item.image}
                alt={item.title}
                width={120}
                height={144}
                sizes="(max-width: 600px) 20vw, 64px"
                className="object-cover rounded flex-shrink-0"
                priority={true}
              />
            ) : (
              <Image
                src={item.image}
                alt={item.title}
                className="object-cover rounded flex-shrink-0"
                width={120}
                height={144}
              />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start h-full">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="font-semibold text-foreground text-base text-lg line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                </div>
                <div>
                  <div className="flex gap-2 text-xs">
                    {item?.selectedSize && <Badge variant="outline">{item?.selectedSize}</Badge>}
                    {item.selectedColor && (
                      <div className="">
                        <Badge variant="outline" className="px-1 py-1">
                          <span className="hidden sm:inline mr-2">{item.selectedColor}{' '}</span>
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.colorHex }}
                          ></span>
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xl font-bold text-foreground">₹{item.price}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
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
                </div>
              </div>
              <div className="flex flex-col h-full items-end justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-0 sm:gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-medium w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItemCard;
