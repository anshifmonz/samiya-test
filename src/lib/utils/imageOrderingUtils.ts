import { type Product } from 'types/product';
import { generateImagePublicId } from './imageIdUtils';
import { validateProductImages } from './isValidImageData';

export interface ProcessedImageRow {
  product_id: string;
  color_name: string;
  hex_code: string;
  image_url: string;
  public_id: string;
  is_primary: boolean;
  sort_order: number;
}

export interface ProcessedColorRow {
  product_id: string;
  color_name: string;
  hex_code: string;
  is_primary: boolean;
  sort_order: number;
}

// processes product images and colors with consistent ordering logic
export function processProductImagesWithOrder(product: Product): {
  imageRows: ProcessedImageRow[];
  colorRows: ProcessedColorRow[];
  primaryColor: string | null;
  primaryImageUrl: string | null;
} {
  if (!product.images || Object.keys(product.images).length === 0) {
    return {
      imageRows: [],
      colorRows: [],
      primaryColor: null,
      primaryImageUrl: null
    };
  }

  const colorKeys = Object.keys(product.images);
  const primaryColor = colorKeys[0] || null;
  const primaryImageUrl = primaryColor ? product.images[primaryColor]?.images[0]?.url || null : null;

  const imageRows: ProcessedImageRow[] = [];
  const colorRows: ProcessedColorRow[] = [];

  for (let colorIndex = 0; colorIndex < colorKeys.length; colorIndex++) {
    const color = colorKeys[colorIndex];
    const colorData = product.images[color];
    const images = colorData.images;

    // Process color row
    colorRows.push({
      product_id: product.id,
      color_name: color,
      hex_code: colorData.hex,
      is_primary: colorIndex === 0,
      sort_order: colorIndex,
    });

    // deduplication to prevent duplicate images with same product_id, color_name, image_url
    // prevents violations of CONSTRAINT unique_product_color_image UNIQUE (product_id, color_name, image_url)
    const uniqueImages = new Map<string, ProcessedImageRow>();

    images.forEach((img) => {
      const imageUrl = typeof img === 'string' ? img : img.url;
      let publicId = typeof img === 'string' ? null : img.publicId;

      if (!imageUrl || imageUrl.trim() === '') return;
      if (!publicId || publicId.trim() === '')
        publicId = generateImagePublicId(imageUrl);

      const uniqueKey = `${product.id}:${color}:${imageUrl}`;

      if (uniqueImages.has(uniqueKey)) return;

      const isPrimary = colorIndex === 0 && uniqueImages.size === 0;
      const imageRow: ProcessedImageRow = {
        product_id: product.id,
        color_name: color,
        hex_code: colorData.hex,
        image_url: imageUrl,
        public_id: publicId,
        is_primary: isPrimary,
        sort_order: uniqueImages.size,
      };

      uniqueImages.set(uniqueKey, imageRow);
    });

    imageRows.push(...Array.from(uniqueImages.values()));
  }

  return {
    imageRows,
    colorRows,
    primaryColor,
    primaryImageUrl,
  };
}

// validates that the product images structure is consistent for ordering
// now allows products without any images, but requires images for existing color variants
export function validateProductImagesOrder(product: Product): {
  isValid: boolean;
  errors: string[];
} {
  // Use the new validation functions that allow products without images
  const validation = validateProductImages(product.images);

  return {
    isValid: validation.isValid,
    errors: validation.errors
  };
}

// prepares images data for RPC calls with proper ordering information
export function prepareImagesForRPC(product: Product): any {
  const { isValid, errors } = validateProductImagesOrder(product);

  if (!isValid)
    console.warn('Product images validation failed:', errors);

  if (!product.images || Object.keys(product.images).length === 0) {
    return {
      ordered_colors: [],
      colors: {}
    };
  }

  // maintain the original order as intended by the product structure
  const originalColorKeys = Object.keys(product.images);

  const orderedColorsArray = originalColorKeys.map((color, colorIndex) => {
    const colorData = product.images[color];
    return {
      name: color,
      order: colorIndex, // explicit color order
      hex: colorData.hex,
      images: colorData.images.map((img, index) => {
        if (typeof img === 'string') {
          return {
            url: img,
            publicId: generateImagePublicId(img),
            order: index // explicit image order within color
          };
        } else {
          return {
            url: img.url,
            publicId: img.publicId || generateImagePublicId(img.url),
            order: index // explicit image order within color
          };
        }
      })
    };
  });

  return {
    ordered_colors: orderedColorsArray,
    // keep the original format as fallback for compatibility
    colors: originalColorKeys.reduce((acc, color) => {
      const colorData = product.images[color];
      acc[color] = {
        hex: colorData.hex,
        images: colorData.images.map((img, index) => {
          if (typeof img === 'string') {
            return {
              url: img,
              publicId: generateImagePublicId(img),
              order: index
            };
          } else {
            return {
              url: img.url,
              publicId: img.publicId || generateImagePublicId(img.url),
              order: index
            };
          }
        })
      };
      return acc;
    }, {} as Record<string, any>)
  };
}
