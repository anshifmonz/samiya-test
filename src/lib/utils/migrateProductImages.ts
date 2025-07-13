import { type ProductImage, type LegacyProduct, type Product } from 'types/product';
import { extractPublicIdFromUrl } from 'lib/upload/cloudinary';

export function migrateProductImages(legacyProduct: LegacyProduct): Product {
  const migratedImages: Record<string, ProductImage[]> = {};

  Object.entries(legacyProduct.images).forEach(([color, urls]) => {
    migratedImages[color] = urls.map(url => ({
      url,
      publicId: extractPublicIdFromUrl(url) || `legacy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));
  });

  return {
    ...legacyProduct,
    short_code: `LEGACY-${Date.now()}`,
    images: migratedImages
  };
}

export function ensureProductImageFormat(product: Product | LegacyProduct): Product {
  const firstColor = Object.keys(product.images)[0];
  if (firstColor && Array.isArray(product.images[firstColor])) {
    const firstImage = product.images[firstColor][0];

    if (typeof firstImage === 'string') {
      return migrateProductImages(product as LegacyProduct);
    } else if (firstImage && typeof firstImage === 'object' && !firstImage.publicId) {
      const migratedImages: Record<string, ProductImage[]> = {};

      Object.entries(product.images).forEach(([color, images]) => {
        migratedImages[color] = images.map((img: any) => {
          if (typeof img === 'string') {
            return {
              url: img,
              publicId: extractPublicIdFromUrl(img) || `legacy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            };
          } else if (img && typeof img === 'object' && img.url) {
            let publicId = img.publicId;
            if (!publicId && img.url && img.url.includes('cloudinary.com')) {
              const urlParts = img.url.split('/');
              const uploadIndex = urlParts.findIndex(part => part === 'upload');
              if (uploadIndex !== -1 && urlParts[uploadIndex + 2]) {

              }
            }

            return {
              url: img.url,
              publicId: publicId || extractPublicIdFromUrl(img.url) || `legacy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            };
          }
          return img;
        });
      });

      return {
        ...product,
        short_code: (product as Product).short_code || `LEGACY-${Date.now()}`,
        images: migratedImages
      };
    }
  }

  return product as Product;
}

export function convertToLegacyFormat(product: Product): LegacyProduct {
  const legacyImages: Record<string, string[]> = {};

  Object.entries(product.images).forEach(([color, images]) => {
    legacyImages[color] = images.map(img => img.url);
  });

  return {
    ...product,
    images: legacyImages
  };
}
