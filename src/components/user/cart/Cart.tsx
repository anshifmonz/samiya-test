'use client';

import { useState } from 'react';
import { Button } from 'ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'hooks/ui/use-toast';
import { useRouter } from 'next/navigation';
import EmptyCart from './EmptyCart';
import CartSummary from './CartSummary';
import CartItemsList from './CartItemsList';
import { CartItem } from 'types/cart';

const mockCartItems: CartItem[] = [
  {
    id: '1',
    title: 'Premium Cotton T-Shirt',
    description: 'Comfortable everyday wear',
    image: '/api/placeholder/200/200',
    price: 599,
    originalPrice: 799,
    selectedSize: 'M',
    selectedColor: 'Navy Blue',
    quantity: 2,
    selected: true,
  },
  {
    id: '2',
    title: 'Wireless Headphones',
    description: 'High-quality sound',
    image: '/api/placeholder/200/200',
    price: 2999,
    selectedSize: 'One Size',
    selectedColor: 'Black',
    quantity: 1,
    selected: true,
  },
  {
    id: '3',
    title: 'Running Shoes',
    description: 'Comfortable sports footwear',
    image: '/api/placeholder/200/200',
    price: 3499,
    originalPrice: 4999,
    selectedSize: '9',
    selectedColor: 'White/Blue',
    quantity: 1,
    selected: false,
  },
];

const Cart = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);

  const handleSelectItem = (itemId: string, selected: boolean) => {
    setCartItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, selected } : item
      )
    );
  };

  const handleSelectAll = () => {
    setCartItems(items =>
      items.map(item => ({ ...item, selected: true }))
    );
  };

  const handleDeselectAll = () => {
    setCartItems(items =>
      items.map(item => ({ ...item, selected: false }))
    );
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  };

  const selectedItems = cartItems.filter(item => item.selected);
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalDiscount = selectedItems.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + ((item.originalPrice - item.price) * item.quantity);
    }
    return sum;
  }, 0);
  const deliveryCharges = selectedItems.length > 0 ? (subtotal > 1000 ? 0 : 99) : 0;
  const totalAmount = subtotal + deliveryCharges;

  const handleProceedToCheckout = () => {
    toast({
      title: "Proceeding to checkout",
      description: `Processing ${selectedItems.length} items`,
    });
  };

  const handleContinueShopping = () => {
    router.push("/");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
          </div>

          <EmptyCart onContinueShopping={handleContinueShopping} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Shopping Cart ({cartItems.length} items)</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <CartItemsList
            cartItems={cartItems}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onQuantityChange={handleQuantityChange}
            onRemoveItem={handleRemoveItem}
          />

          <CartSummary
            selectedItems={selectedItems}
            subtotal={subtotal}
            totalDiscount={totalDiscount}
            deliveryCharges={deliveryCharges}
            totalAmount={totalAmount}
            onProceedToCheckout={handleProceedToCheckout}
            onContinueShopping={handleContinueShopping}
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
