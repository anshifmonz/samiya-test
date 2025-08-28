'use client';

import { Badge } from 'ui/badge';
import { Button } from 'ui/button';
import { Card, CardContent } from 'ui/card';
import { Heart, ShoppingCart, Zap } from 'lucide-react';
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
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={item.product.primary_image_url || '/placeholder-image.jpg'}
            alt={item.product.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
            onClick={() => removeFromWishlist(item.id)}
          >
            <Heart className="w-4 h-4 text-destructive fill-destructive" />
          </Button>
          {item.product.original_price && item.product.original_price > item.product.price && (
            <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
              {calculateDiscount(item.product.price, item.product.original_price)}% OFF
            </Badge>
          )}
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h3 className="font-semibold text-foreground text-lg mb-2">{item.product.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{item.product.description}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Size:</span>
              <Badge variant="outline">{item.size.name}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Color:</span>
              <Badge variant="outline">{item.color.color_name}</Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">${item.product.price}</span>
            {item.product.original_price && item.product.original_price > item.product.price && (
              <span className="text-lg text-muted-foreground line-through">
                ${item.product.original_price}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Button variant="outline" className="w-full" onClick={() => addToCart(item)}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            <Button className="w-full" onClick={() => purchaseNow(item)}>
              <Zap className="w-4 h-4 mr-2" />
              Purchase Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WishlistCard;
