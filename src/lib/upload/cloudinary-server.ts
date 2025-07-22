import { v2 as cloudinary } from 'cloudinary';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import isValidPublicId from 'utils/isValidPublicId';

const requiredEnvVars = {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(`Missing required Cloudinary environment variables: ${missingVars.join(', ')}`);
}

cloudinary.config({
  cloud_name: requiredEnvVars.CLOUDINARY_CLOUD_NAME,
  api_key: requiredEnvVars.CLOUDINARY_API_KEY,
  api_secret: requiredEnvVars.CLOUDINARY_API_SECRET,
});

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const FOLDER = 'product-images';
const TRANSFORMATION = [
  { width: 1200, height: 1500, crop: 'fill', gravity: 'auto', dpr: 'auto' }, // 4:5
  { quality: 100 },
  { effect: 'sharpen' },
  { flags: 'progressive' },
  { fetch_format: 'auto' }
];
const EAGER = [
  { width: 64, height: 64, crop: 'fill', gravity: 'auto', quality: 95, dpr: 'auto', effect: 'sharpen', flags: 'progressive' },
  { width: 400, height: 500, crop: 'fill', gravity: 'auto', quality: 95, dpr: 'auto', effect: 'sharpen', flags: 'progressive' },
  { width: 800, height: 1000, crop: 'fill', gravity: 'auto', quality: 98, dpr: 'auto', effect: 'sharpen', flags: 'progressive' }
];

export async function uploadFileToCloudinary(file: File): Promise<{ secure_url: string, public_id: string }> {
  let tempPath: string | null = null;
  if (!(file instanceof File)) throw new Error('No file uploaded.');
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error('Invalid file type.');

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    tempPath = path.join(
      tmpdir(),
      `${randomUUID()}-${file.name}`
    );
    await writeFile(tempPath, buffer);

    const result = await cloudinary.uploader.upload(tempPath, {
      folder: FOLDER,
      resource_type: 'image',
      transformation: TRANSFORMATION,
      eager: EAGER,
      eager_async: true,
      eager_notification_url: null,
    });
    return { secure_url: result.secure_url, public_id: result.public_id };
  } finally {
    if (tempPath) {
      try {
        await unlink(tempPath);
      } catch {}
    }
  }
}

export async function deleteImageFromCloudinary(publicId: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!publicId) throw new Error('Public ID is required');

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
    });

    if (result.result === 'ok' || result.result === 'not found') {
      return { success: true };
    } else {
      return { success: false, error: `Failed to delete image: ${result.result}` };
    }
  } catch (error: any) {
    console.error('Error deleting image from Cloudinary:', error);
    return { success: false, error: error.message || 'Failed to delete image from Cloudinary' };
  }
}

export async function deleteMultipleImagesFromCloudinary(publicIds: string[]): Promise<{ success: boolean; errors: string[] }> {
  const errors: string[] = [];
  const results = await Promise.allSettled(
    publicIds.map(publicId => isValidPublicId(publicId) && deleteImageFromCloudinary(publicId))
  );

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      errors.push(`Failed to delete image ${publicIds[index]}: ${result.reason}`);
    } else if (!result.value.success) {
      errors.push(`Failed to delete image ${publicIds[index]}: ${result.value.error}`);
    }
  });

  return {
    success: errors.length === 0,
    errors
  };
}
