import { useState } from 'react';
import { apiRequest } from 'lib/utils/apiRequest';
import { useAuth } from 'hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useDebounce } from 'hooks/useDebounce';
import { toast } from 'hooks/ui/use-toast';
import { CartItem } from 'types/cart';

export const useCart = ({ initialCartItems }: { initialCartItems: CartItem[] }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async (productId: string, quantity: number, selectedColor: string, variant: any) => {
    if (!user) return;

    setIsAddingToCart(true);
    try {
      await apiRequest('/api/user/cart', {
        method: 'POST',
        body: {
          productId,
          quantity,
          color: selectedColor,
          variant
        },
        successMessage: 'Item added to cart successfully!',
        errorMessage: 'Failed to add item to cart',
        showSuccessToast: true,
        showLoadingBar: true
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const updateCartQuantity = async (cartItemId: string, quantity: number) => {
    try {
      apiRequest('/api/user/cart', {
        method: 'PUT',
        body: {
          cartItemId,
          quantity
        }
      });
    } catch (error) {
      return;
    }
  };

  const debouncedUpdateCartQuantity = useDebounce(updateCartQuantity, 800);

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

    debouncedUpdateCartQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId: string) => {
    const { error } = await apiRequest('/api/user/cart', {
      method: 'DELETE',
      body: {
        cartId: itemId
      },
      successMessage: "Item has been removed from your cart",
      errorMessage: "Failed to remove item. Please try again.",
      showSuccessToast: true,
      showErrorToast: true,
      showLoadingBar: true,
    });
    if (error) return;
    setCartItems(items => items.filter(item => item.id !== itemId));
  };

  const handleProceedToCheckout = () => {
    const selectedItems = cartItems.filter(item => item.selected);
    toast({
      title: "Proceeding to checkout",
      description: `Processing ${selectedItems.length} items`,
    });
  };

  const handleContinueShopping = () => {
    router.push("/");
  };

  const handleGoBack = () => {
    router.back();
  };

  // Computed values
  const selectedItems = cartItems.filter(item => item.selected);
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalDiscount = selectedItems.reduce((sum, item) => {
    if (item.originalPrice)
      return sum + ((item.originalPrice - item.price) * item.quantity);
    return sum;
  }, 0);
  const deliveryCharges = selectedItems.length > 0 ? (subtotal > 1000 ? 0 : 99) : 0;
  const totalAmount = subtotal + deliveryCharges;

  return {
    // State
    cartItems,
    isAddingToCart,
    selectedItems,

    // Computed values
    subtotal,
    totalDiscount,
    deliveryCharges,
    totalAmount,

    // Handlers
    handleAddToCart,
    handleSelectItem,
    handleSelectAll,
    handleDeselectAll,
    handleQuantityChange,
    handleRemoveItem,
    handleProceedToCheckout,
    handleContinueShopping,
    handleGoBack,
  };
};






