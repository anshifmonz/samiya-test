export interface CloudinaryUploadResult {
  url: string | null;
  publicId: string | null;
  file: File;
  error?: string;
}

export interface CloudinaryImageInfo {
  url: string;
  publicId: string;
}

export async function uploadImagesToCloudinary(
  files: File[],
  onProgress?: (file: File, percent: number) => void
): Promise<CloudinaryUploadResult[]> {
  const uploadPromises = files.map((file) => {
    return new Promise<CloudinaryUploadResult>((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/admin/upload');
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress(file, Math.round((event.loaded / event.total) * 100));
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          resolve({
            url: data.secure_url,
            publicId: data.public_id,
            file
          });
        } else {
          const data = JSON.parse(xhr.responseText);
          resolve({
            url: null,
            publicId: null,
            file,
            error: data.error || 'Upload failed.'
          });
        }
      };
      xhr.onerror = () => {
        resolve({
          url: null,
          publicId: null,
          file,
          error: 'Upload failed.'
        });
      };
      const formData = new FormData();
      formData.append('file', file);
      xhr.send(formData);
    });
  });
  return Promise.all(uploadPromises);
}

export async function deleteImageFromCloudinary(publicId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `/api/admin/upload/delete?publicId=${encodeURIComponent(publicId)}`;

    const response = await fetch(url, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return { success: true };
    } else {
      return { success: false, error: data.error || 'Failed to delete image' };
    }
  } catch (error: any) {
    console.error('Error deleting image from Cloudinary:', error);
    return { success: false, error: error.message || 'Failed to delete image from Cloudinary' };
  }
}

export async function deleteMultipleImagesFromCloudinary(publicIds: string[]): Promise<{ success: boolean; errors: string[] }> {
  try {
    const response = await fetch(`/api/admin/upload/delete?publicIds=${encodeURIComponent(JSON.stringify(publicIds))}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return { success: true, errors: [] };
    } else {
      return { success: false, errors: data.errors || [data.error || 'Failed to delete images'] };
    }
  } catch (error: any) {
    console.error('Error deleting images from Cloudinary:', error);
    return { success: false, errors: [error.message || 'Failed to delete images from Cloudinary'] };
  }
}

export function extractPublicIdFromUrl(url: string): string | null {
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
