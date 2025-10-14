'use client';

import { createContext, useContext, ReactNode } from 'react';
import { type Product, type Size } from 'types/product';
import { useProductLogic } from 'hooks/public/useProductLogic';

type ProductContextType = ReturnType<typeof useProductLogic>;

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({
  children,
  product
}: {
  children: ReactNode;
  product: Product;
}) => {
  const productLogic = useProductLogic(product);
  return (
    <ProductContext.Provider value={{ product, ...productLogic }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined)
    throw new Error('useProductContext must be used within a ProductProvider');
  return context;
};
