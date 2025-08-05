'use client';

import { CartItem } from 'types/cart';
import CartItemCard from './CartItemCard';
import SelectAllControls from './SelectAllControls';

interface CartItemsListProps {
  cartItems: CartItem[];
  selectedItems: CartItem[];
  onSelectItem: (itemId: string, selected: boolean) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onQuantityChange: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

const CartItemsList = ({
  cartItems,
  selectedItems,
  onSelectItem,
  onSelectAll,
  onDeselectAll,
  onQuantityChange,
  onRemoveItem
}: CartItemsListProps) => {
  return (
    <div className="lg:col-span-2 space-y-4">
      <SelectAllControls
        allSelected={selectedItems.length === cartItems.length}
        onSelectAll={onSelectAll}
        onDeselectAll={onDeselectAll}
      />

      {cartItems.map((item) => (
        <CartItemCard
          key={item.id}
          item={item}
          onSelectItem={onSelectItem}
          onQuantityChange={onQuantityChange}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </div>
  );
};

export default CartItemsList;
