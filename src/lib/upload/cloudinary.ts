export interface CloudinaryUploadResult {
  url: string | null;
  file: File;
  error?: string;
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
          resolve({ url: data.secure_url, file });
        } else {
          const data = JSON.parse(xhr.responseText);
          resolve({ url: null, file, error: data.error || 'Upload failed.' });
        }
      };
      xhr.onerror = () => {
        resolve({ url: null, file, error: 'Upload failed.' });
      };
      const formData = new FormData();
      formData.append('file', file);
      xhr.send(formData);
    });
  });
  return Promise.all(uploadPromises);
}
