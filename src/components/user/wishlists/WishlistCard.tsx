'use client';

import { Badge } from 'ui/badge';
import { Button } from 'ui/button';
import { Card, CardContent } from 'ui/card';
import { Heart, ShoppingCart, Zap } from 'lucide-react';
import { WishlistItem } from 'types/wishlist';

interface WishlistCardProps {
  item: WishlistItem;
  onRemove: (itemId: string) => void;
  onAddToCart: (item: WishlistItem) => void;
  onPurchaseNow: (item: WishlistItem) => void;
}

const WishlistCard = ({ item, onRemove, onAddToCart, onPurchaseNow }: WishlistCardProps) => {
  const calculateDiscount = (price: number, originalPrice: number) => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <Card className="bg-profile-card border-profile-border hover:shadow-hover transition-all duration-200">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
            onClick={() => onRemove(item.id)}
          >
            <Heart className="w-4 h-4 text-destructive fill-destructive" />
          </Button>
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
            {calculateDiscount(item.price, item.originalPrice)}% OFF
          </Badge>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h3 className="font-semibold text-foreground text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Size:</span>
              <Badge variant="outline">{item.selectedSize}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Color:</span>
              <Badge variant="outline">{item.selectedColor}</Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">${item.price}</span>
            <span className="text-lg text-muted-foreground line-through">${item.originalPrice}</span>
          </div>

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onAddToCart(item)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            <Button
              className="w-full"
              onClick={() => onPurchaseNow(item)}
            >
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
