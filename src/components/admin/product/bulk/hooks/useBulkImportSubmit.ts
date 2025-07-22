import { type CreateProductData } from 'types/product';
import { type Size } from 'types/product';
import { createProductImagesWithIds } from 'utils/imageIdUtils';

export function useBulkImportSubmit({
  parsedProducts,
  sizeMap,
  sizes,
  onImport,
  setIsValidating
}: {
  parsedProducts: any[];
  sizeMap: Map<string, string>;
  sizes: Size[];
  onImport: (products: CreateProductData[]) => void;
  setIsValidating: (v: boolean) => void;
}) {
  const validateDuplicateImages = (products: any[]): string[] => {
    const warnings: string[] = [];
    const imageUrlMap = new Map<string, { productTitle: string; colorName: string }[]>();
    products.forEach((product) => {
      Object.entries(product.images).forEach(([colorName, colorData]: any) => {
        colorData.images.forEach((imageUrl: string) => {
          if (!imageUrlMap.has(imageUrl)) {
            imageUrlMap.set(imageUrl, []);
          }
          imageUrlMap.get(imageUrl)!.push({
            productTitle: product.title,
            colorName: colorName
          });
        });
      });
    });
    imageUrlMap.forEach((usages, imageUrl) => {
      if (usages.length > 1) {
        const usageList = usages.map(usage => `${usage.productTitle} (${usage.colorName})`).join(', ');
        warnings.push(`Image URL "${imageUrl}" is used in multiple products/colors: ${usageList}`);
      }
    });
    return warnings;
  };

  const handleImport = () => {
    setIsValidating(true);
    const validProducts = parsedProducts.filter(product => product.errors.length === 0);
    if (validProducts.length === 0) {
      setIsValidating(false);
      return;
    }
    const duplicateImageWarnings = validateDuplicateImages(validProducts);
    if (duplicateImageWarnings.length > 0) {
      console.warn('Duplicate image warnings:', duplicateImageWarnings);
    }
    const productsToImport: CreateProductData[] = validProducts.map(product => {
      const processedImages: Record<string, { hex: string; images: { url: string; publicId: string }[] }> = {};
      Object.entries(product.images).forEach(([colorName, colorData]: any) => {
        const uniqueImageUrls = Array.from(new Set(colorData.images));
        const validImageUrls = uniqueImageUrls.filter((url: string) => url && url.trim() !== '');
        if (validImageUrls.length > 0) {
          processedImages[colorName] = {
            hex: colorData.hex,
            images: createProductImagesWithIds(validImageUrls as string[])
          };
        }
      });
      return {
        title: product.title,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        categoryId: product.categoryId,
        tags: product.tags,
        sizes: product.sizes
          .map((sizeName: string) => {
            const sizeId = sizeMap.get(sizeName.toLowerCase());
            return sizeId ? sizes.find((s: Size) => s.id === sizeId) : null;
          })
          .filter(Boolean) as Size[],
        active: product.active,
        images: processedImages
      };
    });
    onImport(productsToImport);
  };

  return {
    handleImport,
    validateDuplicateImages
  };
}
