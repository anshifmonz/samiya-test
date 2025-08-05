'use client';

import { createContext, useContext, ReactNode } from 'react';
import { type Product, type Size } from 'types/product';
import { useProductLogic } from 'hooks/public/useProductLogic';

interface ProductContextType {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  selectedSizeData: Size | undefined;
  quantity: number;
  isWishlist: boolean;
  isLoadingWishlist: boolean;
  isAddingToCart: boolean;
  handleColorChange: (color: string) => void;
  handleSizeChange: (sizeName: string, sizeData?: Size) => void;
  setQuantity: (quantity: number) => void;
  handleWhatsApp: () => void;
  handleWishlistToggle: () => Promise<void>;
  handleAddToCart: () => Promise<void>;
  getColorStyle: (color: string) => string;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children, product }: { children: ReactNode; product: Product }) => {
  const productLogic = useProductLogic(product);
  return <ProductContext.Provider value={{ product, ...productLogic }}>{children}</ProductContext.Provider>;
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) throw new Error('useProductContext must be used within a ProductProvider');
  return context;
};

