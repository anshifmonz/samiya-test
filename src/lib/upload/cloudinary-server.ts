import { v2 as cloudinary } from 'cloudinary';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function uploadFileToCloudinary(file: File): Promise<{ secure_url: string, public_id: string }> {
  let tempPath: string | null = null;
  if (!(file instanceof File)) {
    throw new Error('No file uploaded.');
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type.');
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large.');
  }
  try {
    // write file to temporary directory
    const buffer = Buffer.from(await file.arrayBuffer());
    tempPath = path.join(
      tmpdir(),
      `${randomUUID()}-${file.name}`
    );
    await writeFile(tempPath, buffer);

    // upload to cloudinary
    const result = await cloudinary.uploader.upload(tempPath, {
      folder: 'product-images',
      resource_type: 'image',
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' },
      ],
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
    if (!publicId) {
      throw new Error('Public ID is required');
    }

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
    publicIds.map(publicId => deleteImageFromCloudinary(publicId))
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
