import { type ProductImage, type ProductColorData, type LegacyProduct, type Product, type LegacyProductWithImages } from 'types/product';
import { extractPublicIdFromUrl } from 'lib/upload/cloudinary';

// Function to get fallback hex color for legacy color names
function getDefaultHexColor(colorName: string): string {
  const colorMap: { [key: string]: string } = {
    cream: '#F5F5DC',
    navy: '#000080',
    red: '#DC2626',
    green: '#059669',
    blue: '#2563EB',
    purple: '#7C3AED',
    pink: '#EC4899',
    yellow: '#EAB308',
    orange: '#EA580C',
    brown: '#92400E',
    gray: '#6B7280',
    black: '#000000',
    white: '#FFFFFF'
  };
  return colorMap[colorName] || '#000000';
}

export function migrateProductImages(legacyProduct: LegacyProduct): Product {
  const migratedImages: Record<string, ProductColorData> = {};

  Object.entries(legacyProduct.images).forEach(([color, urls]) => {
    migratedImages[color] = {
      hex: getDefaultHexColor(color),
      images: urls.map(url => ({
        url,
        publicId: extractPublicIdFromUrl(url) || `legacy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }))
    };
  });

  return {
    ...legacyProduct,
    short_code: `LEGACY-${Date.now()}`,
    images: migratedImages,
    sizes: legacyProduct.sizes || []
  };
}

export function ensureProductImageFormat(product: Product | LegacyProduct | LegacyProductWithImages): Product {
  const firstColor = Object.keys(product.images)[0];
  if (firstColor && Array.isArray(product.images[firstColor])) {
    const firstImage = product.images[firstColor][0];

    if (typeof firstImage === 'string') {
      return migrateProductImages(product as LegacyProduct);
    } else if (firstImage && typeof firstImage === 'object' && 'url' in firstImage && !('hex' in product.images[firstColor] as any)) {
      // This is a LegacyProductWithImages format, convert to new format
      const migratedImages: Record<string, ProductColorData> = {};

      Object.entries(product.images).forEach(([color, images]) => {
        migratedImages[color] = {
          hex: getDefaultHexColor(color),
          images: (images as ProductImage[]).map((img: any) => {
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
                  // Extract public ID from Cloudinary URL
                }
              }

              return {
                url: img.url,
                publicId: publicId || extractPublicIdFromUrl(img.url) || `legacy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
              };
            }
            return img;
          })
        };
      });

      return {
        ...product,
        short_code: (product as Product).short_code || `LEGACY-${Date.now()}`,
        images: migratedImages,
        sizes: (product as Product).sizes || []
      };
    }
  }

  return product as Product;
}

export function convertToLegacyFormat(product: Product): LegacyProduct {
  const legacyImages: Record<string, string[]> = {};

  Object.entries(product.images).forEach(([color, colorData]) => {
    legacyImages[color] = colorData.images.map(img => img.url);
  });

  return {
    ...product,
    images: legacyImages,
    sizes: product.sizes || []
  };
}
