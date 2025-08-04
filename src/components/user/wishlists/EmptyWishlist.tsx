'use client';

import { Button } from 'ui/button';
import { Card, CardContent } from 'ui/card';
import { Heart } from 'lucide-react';

interface EmptyWishlistProps {
  onContinueShopping: () => void;
}

const EmptyWishlist = ({ onContinueShopping }: EmptyWishlistProps) => {
  return (
    <Card className="bg-profile-card border-profile-border">
      <CardContent className="text-center py-16">
        <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Your wishlist is empty</h3>
        <p className="text-muted-foreground mb-6">Start adding items you love to see them here</p>
        <Button onClick={onContinueShopping}>Continue Shopping</Button>
      </CardContent>
    </Card>
  );
};

export default EmptyWishlist;
