'use client';

import { Button } from 'ui/button';
import { Card, CardContent } from 'ui/card';
import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

const EmptyCheckout = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-profile-bg pt-16">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
          </div>
        </div>
        <Card className="bg-profile-card border-profile-border">
      <CardContent className="text-center py-16">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">No items to checkout</h3>
        <p className="text-muted-foreground mb-6">Your cart is empty or checkout session has expired.</p>
        <Button onClick={() => router.push('/user/cart')}>
          Go to Cart
        </Button>
      </CardContent>
    </Card>
      </div>
    </div>
  );
}

export default EmptyCheckout;
