'use client';

import CartItemCard from './CartItemCard';
import SelectAllControls from './SelectAllControls';
import { useCartContext } from 'contexts/user/CartContext';

const CartItemsList = () => {
  const { cartItems } = useCartContext();

  return (
    <div className="lg:col-span-2 space-y-4">
      <SelectAllControls />

      {cartItems.map(item => (
        <CartItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default CartItemsList;
