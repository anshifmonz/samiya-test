import { useState } from 'react';
import { CartItem } from 'types/cart';
import { useRouter } from 'next/navigation';
import { apiRequest } from 'utils/apiRequest';
import { useDebounce } from 'hooks/useDebounce';
import { useAuthContext } from 'contexts/AuthContext';

export const useCart = ({ initialCartItems }: { initialCartItems: CartItem[] }) => {
  const { user } = useAuthContext();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async (
    productId: string,
    quantity: number,
    selectedColor: string,
    variant: any
  ) => {
    if (!user) return;

    setIsAddingToCart(true);
    try {
      apiRequest('/api/user/cart', {
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
    apiRequest('/api/user/cart', {
      method: 'PUT',
      body: { cartItemId, quantity }
    });
  };

  const updateCartSelection = async (cartItemId: string, isSelected: boolean) => {
    apiRequest('/api/user/cart', {
      method: 'PATCH',
      body: {
        cartItemId,
        isSelected
      }
    });
  };

  const bulkUpdateCartSelection = async (isSelected: boolean) => {
    apiRequest('/api/user/cart/bulk-select', {
      method: 'PATCH',
      body: { isSelected }
    });
  };

  const debouncedUpdateCartQuantity = useDebounce(updateCartQuantity, 1000);
  const debouncedUpdateCartSelection = useDebounce(updateCartSelection, 1000);
  const debouncedUpdateCartBulkSelection = useDebounce(bulkUpdateCartSelection, 1000);

  const handleSelectItem = (itemId: string, isSelected: boolean) => {
    setCartItems(items => items.map(item => (
      item.id === itemId
      ? { ...item, isSelected }
      : item
    )));

    debouncedUpdateCartSelection(itemId, isSelected);
  };

  const handleSelectAll = () => {
    setCartItems(items => items.map(item => ({ ...item, isSelected: true })));
    debouncedUpdateCartBulkSelection(true);
  };

  const handleDeselectAll = () => {
    setCartItems(items => items.map(item => ({ ...item, isSelected: false })));
    debouncedUpdateCartBulkSelection(false);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems(items => items.map(item => (
      item.id === itemId
      ? { ...item, quantity: newQuantity }
      : item
    )));

    debouncedUpdateCartQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId: string) => {
    const { data, error } = await apiRequest('/api/user/cart', {
      method: 'DELETE',
      body: { cartId: itemId },
      successMessage: 'Item has been removed from your cart',
      errorMessage: 'Failed to remove item. Please try again.',
      showSuccessToast: true,
      showErrorToast: true,
      showLoadingBar: true
    });
    if (error || data.error) return;
    setCartItems(items => items.filter(item => item.id !== itemId));
  };

  const handleProceedToCheckout = async () => {
    const { data, error } = await apiRequest('/api/user/checkout', {
      method: 'POST',
      showLoadingBar: true,
      showErrorToast: true,
      errorMessage: 'Failed to create checkout, Please try again'
    });
    if (error || data.error) return;
    if (data.data.checkoutId) router.push('/user/checkout');
  };

  const handleContinueShopping = () => router.push('/');
  const handleGoBack = () => router.back();

  // Computed values
  const selectedItems = cartItems.filter(item => item.isSelected);
  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDiscount = selectedItems.reduce((sum, item) => {
    if (item.originalPrice) return sum + (item.originalPrice - item.price) * item.quantity;
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
    handleGoBack
  };
};
