import { extractPublicIdFromUrl } from 'lib/upload/cloudinary';
import { type ProductImage } from 'types/product';

export function generateImagePublicId(url: string, serverPublicId?: string): string {
  if (serverPublicId && serverPublicId.trim() !== '') {
    return serverPublicId;
  }

  const extractedPublicId = extractPublicIdFromUrl(url);
  if (extractedPublicId) {
    return extractedPublicId;
  }

  return `url-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Creates a ProductImage object with consistent publicId assignment
 * Prioritizes server-provided publicId over URL extraction.
 *
 * @param url - The image URL
 * @param serverPublicId - The publicId returned from cloudinary-server.ts (preferred)
 * @returns ProductImage object with consistent publicId
 */
export function createProductImageWithId(url: string, serverPublicId?: string): ProductImage {
  return {
    url: url.trim(),
    publicId: generateImagePublicId(url.trim(), serverPublicId)
  };
}

/**
 * Creates a ProductImage object from server upload response
 * Uses the server-provided publicId for accurate tracking.
 *
 * @param url - The secure_url from cloudinary server response
 * @param publicId - The public_id from cloudinary server response
 * @returns ProductImage object with server-provided publicId
 */
export function createProductImageFromServerResponse(url: string, publicId: string): ProductImage {
  return {
    url: url.trim(),
    publicId: publicId
  };
}

/**
 * Processes an array of image URLs and returns ProductImage objects
 * with consistent publicId assignment
 *
 * @param urls - Array of image URLs
 * @returns Array of ProductImage objects
 */
export function createProductImagesWithIds(urls: string[]): ProductImage[] {
  return urls
    .filter(url => url && url.trim() !== '')
    .map(url => createProductImageWithId(url));
}
