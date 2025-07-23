// validation result interface for product image validation
export interface ProductImageValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * Validates that a product can be saved without any images
 * This is allowed for products that don't have color variants
 *
 * @param images - Product images object
 * @returns Validation result
 */
export function validateProductWithoutImages(images: Record<string, any>): ProductImageValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // If no images at all, that's allowed
  if (!images || Object.keys(images).length === 0) {
    return { isValid: true, errors, warnings };
  }

  return { isValid: true, errors, warnings };
}

/**
 * Validates that if color variants exist, each color must have at least one image
 * Provides meaningful error messages for missing images per color
 *
 * @param images - Product images object
 * @returns Validation result with detailed error messages
 */
export function validateColorImageRequirements(images: Record<string, any>): ProductImageValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // If no images at all, that's allowed (product without variants)
  if (!images || Object.keys(images).length === 0) {
    return { isValid: true, errors, warnings };
  }

  const colorKeys = Object.keys(images);
  const colorsWithoutImages: string[] = [];

  for (const color of colorKeys) {
    const colorData = images[color];

    // Check if color data exists
    if (!colorData) {
      errors.push(`Color "${color}" is missing color data. Please remove this color or add the required information.`);
      continue;
    }

    // Check if hex code exists
    if (!colorData.hex || colorData.hex.trim() === '') {
      errors.push(`Color "${color}" is missing a hex color code. Please provide a valid hex code.`);
    }

    // Check if images array exists and has content
    if (!colorData.images || !Array.isArray(colorData.images)) {
      errors.push(`Color "${color}" is missing an images array. Please add at least one image for this color.`);
      colorsWithoutImages.push(color);
      continue;
    }

    // Filter out empty or invalid image URLs
    const validImages = colorData.images.filter((img: any) => {
      const imageUrl = typeof img === 'string' ? img : img?.url;
      return imageUrl && imageUrl.trim() !== '';
    });

    if (validImages.length === 0) {
      errors.push(`Color "${color}" does not have any valid images. Please add at least one image for this color variant.`);
      colorsWithoutImages.push(color);
    }
  }

  // Add summary error if multiple colors are missing images
  if (colorsWithoutImages.length > 1) {
    errors.push(`Multiple colors are missing images: ${colorsWithoutImages.join(', ')}. Each color variant must have at least one image.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Comprehensive validation for product images that allows products without images
 * but requires images for any color variants that are defined
 *
 * @param images - Product images object
 * @returns Validation result with detailed feedback
 */
export function validateProductImages(images: Record<string, any>): ProductImageValidationResult {
  const withoutImagesResult = validateProductWithoutImages(images);
  if (!withoutImagesResult.isValid) {
    return withoutImagesResult;
  }

  // validate color requirements if colors exist
  const colorRequirementsResult = validateColorImageRequirements(images);

  return {
    isValid: colorRequirementsResult.isValid,
    errors: [...withoutImagesResult.errors, ...colorRequirementsResult.errors],
    warnings: [...(withoutImagesResult.warnings || []), ...(colorRequirementsResult.warnings || [])]
  };
}

