import { WishlistWithProduct } from 'types/wishlist';

export function transformWishlistsToWishlistItems(wishlists: WishlistWithProduct[]) {
  return wishlists.map((wishlist) => ({
    id: `${wishlist.product_id}-${wishlist.color_id}-${wishlist.size_id}`, // Composite ID
    title: wishlist.product.title,
    description: wishlist.product.description || '',
    price: wishlist.product.price,
    originalPrice: wishlist.product.original_price || wishlist.product.price,
    image: wishlist.product.primary_image_url || '/placeholder.svg',
    selectedSize: wishlist.size.name,
    selectedColor: wishlist.color.color_name,
    productId: wishlist.product_id,
    colorId: wishlist.color_id,
    sizeId: wishlist.size_id,
    createdAt: wishlist.created_at,
  }));
}
