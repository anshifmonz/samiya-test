/**
 * Validation result interface for product image validation
 */
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
  // First validate the basic structure
  const withoutImagesResult = validateProductWithoutImages(images);
  if (!withoutImagesResult.isValid) {
    return withoutImagesResult;
  }

  // Then validate color requirements if colors exist
  const colorRequirementsResult = validateColorImageRequirements(images);

  return {
    isValid: colorRequirementsResult.isValid,
    errors: [...withoutImagesResult.errors, ...colorRequirementsResult.errors],
    warnings: [...(withoutImagesResult.warnings || []), ...(colorRequirementsResult.warnings || [])]
  };
}

/**
 * Checks if a product submission should be prevented due to validation errors
 * Returns user-friendly error messages for form display
 *
 * @param images - Product images object
 * @returns Object containing validation status and user-friendly messages
 */
export function checkSubmissionErrors(images: Record<string, any>): {
  canSubmit: boolean;
  errorMessage?: string;
  detailedErrors: string[];
} {
  const validation = validateProductImages(images);

  if (validation.isValid) {
    return {
      canSubmit: true,
      detailedErrors: []
    };
  }

  // Create user-friendly error message
  const colorCount = Object.keys(images || {}).length;
  let errorMessage = '';

  if (colorCount === 1) {
    errorMessage = 'Your color variant is missing images. Please add at least one image before saving.';
  } else if (colorCount > 1) {
    const colorsWithoutImages = Object.keys(images || {}).filter(color => {
      const colorData = images[color];
      if (!colorData?.images || !Array.isArray(colorData.images)) return true;
      const validImages = colorData.images.filter((img: any) => {
        const imageUrl = typeof img === 'string' ? img : img?.url;
        return imageUrl && imageUrl.trim() !== '';
      });
      return validImages.length === 0;
    });

    if (colorsWithoutImages.length === 1) {
      errorMessage = `The "${colorsWithoutImages[0]}" color variant is missing images. Please add at least one image before saving.`;
    } else if (colorsWithoutImages.length > 1) {
      errorMessage = `Multiple color variants are missing images: ${colorsWithoutImages.join(', ')}. Please add images to all color variants before saving.`;
    } else {
      errorMessage = 'Some color variants have validation errors. Please check all colors have valid hex codes and images.';
    }
  }

  return {
    canSubmit: false,
    errorMessage,
    detailedErrors: validation.errors
  };
}

/**
 * Provides real-time validation feedback for color image requirements
 * Useful for displaying warnings or validation states in the UI as user edits
 *
 * @param images - Product images object
 * @returns Object containing validation status and user-friendly feedback
 */
export function getColorValidationStatus(images: Record<string, any>): {
  hasColors: boolean;
  colorsWithoutImages: string[];
  allColorsValid: boolean;
  warningMessage?: string;
} {
  const hasColors = images && Object.keys(images).length > 0;

  if (!hasColors) {
    return {
      hasColors: false,
      colorsWithoutImages: [],
      allColorsValid: true // No colors means no validation needed
    };
  }

  const colorsWithoutImages = Object.keys(images).filter(color => {
    const colorData = images[color];
    if (!colorData?.images || !Array.isArray(colorData.images)) return true;
    const validImages = colorData.images.filter((img: any) => {
      const imageUrl = typeof img === 'string' ? img : img?.url;
      return imageUrl && imageUrl.trim() !== '';
    });
    return validImages.length === 0;
  });

  const allColorsValid = colorsWithoutImages.length === 0;
  let warningMessage: string | undefined;

  if (colorsWithoutImages.length === 1) {
    warningMessage = `The "${colorsWithoutImages[0]}" color needs at least one image.`;
  } else if (colorsWithoutImages.length > 1) {
    warningMessage = `${colorsWithoutImages.length} colors need images: ${colorsWithoutImages.join(', ')}.`;
  }

  return {
    hasColors,
    colorsWithoutImages,
    allColorsValid,
    warningMessage
  };
}
