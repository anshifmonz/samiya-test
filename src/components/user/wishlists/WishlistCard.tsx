'use client';

import Image from 'next/image';
import { Badge } from 'ui/badge';
import { Button } from 'ui/button';
import { Card, CardContent } from 'ui/card';
import { Trash2, ShoppingCart, Zap } from 'lucide-react';
import { WishlistWithProduct } from 'types/wishlist';
import { useWishlistContext } from 'contexts/user/WishlistContext';

interface WishlistCardProps {
  item: WishlistWithProduct;
}

const WishlistCard = ({ item }: WishlistCardProps) => {
  const { removeFromWishlist, addToCart, purchaseNow } = useWishlistContext();

  const calculateDiscount = (price: number, originalPrice: number) => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <Card className="bg-profile-card border-profile-border hover:shadow-hover transition-all duration-200">
      <CardContent className="p-2 sm:p-4">
        <div className="flex gap-4">
          <div className="relative flex-shrink-0 aspect-[5/6] w-24 h-28">
            <Image
              src={item.product.primary_image_url || '/placeholder-image.jpg'}
              alt={item.product.title}
              width={120}
              height={144}
              className="object-cover rounded"
            />
            {item.product.original_price && item.product.original_price > item.product.price && (
              <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5">
                {calculateDiscount(item.product.price, item.product.original_price)}% OFF
              </Badge>
            )}
          </div>
          <div className="flex-1 flex flex-col justify-between space-y-2">
            <div className="flex items-start justify-between w-full">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="font-semibold text-foreground text-base text-lg line-clamp-1">
                    {item.product.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.product.description}
                  </p>
                </div>
                <div>
                  <div className="flex gap-2 text-xs">
                    {item?.size.name && <Badge variant="outline">{item.size.name}</Badge>}
                    {item.color.color_name && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {item.color.color_name}{' '}
                          <span
                            className="w-3 h-3 rounded-full ml-2"
                            style={{ backgroundColor: item.color.hex_code }}
                          ></span>
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xl font-bold text-foreground">₹{item.product.price}</span>
                    {item.product.original_price &&
                      item.product.original_price > item.product.price && (
                        <span className="text-base text-muted-foreground line-through">
                          ₹{item.product.original_price}
                        </span>
                      )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between h-full">
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 text-destructive hover:text-destructive"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" className="flex-1" onClick={() => addToCart(item)}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button className="flex-1" onClick={() => purchaseNow(item)}>
                    <Zap className="w-4 h-4 mr-2" />
                    Purchase Now
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

export default WishlistCard;
