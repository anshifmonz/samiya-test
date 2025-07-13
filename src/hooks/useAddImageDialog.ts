import { useCallback } from 'react';

interface UseAddImageDialogProps {
  setSelectedFiles: (f: File[] | ((prev: File[]) => File[])) => void;
  setUploadStatus: React.Dispatch<React.SetStateAction<{ [filename: string]: 'pending' | 'uploading' | 'success' | 'error' }>>;
  setUploadErrors: React.Dispatch<React.SetStateAction<{ [filename: string]: string }>>;
  setUploadProgress: React.Dispatch<React.SetStateAction<{ [filename: string]: number }>>;
  uploading: boolean;
  uploadStatus: { [filename: string]: 'pending' | 'uploading' | 'success' | 'error' };
}

export const useAddImageDialog = ({
  setSelectedFiles,
  setUploadStatus,
  setUploadErrors,
  setUploadProgress,
  uploading,
  uploadStatus
}: UseAddImageDialogProps) => {

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files]);
    }
  }, [setSelectedFiles]);

  const handleFileInputClick = useCallback(() => {
    document.getElementById('product-image-file-input')?.click();
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
  }, [setSelectedFiles]);

  const handleRemoveFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, [setSelectedFiles]);

  const handleRetryUpload = useCallback(async (file: File) => {
    setUploadStatus(prev => ({ ...prev, [file.name]: 'uploading' }));
    setUploadErrors(prev => ({ ...prev, [file.name]: '' }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadPromise = new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/admin/upload');

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: Math.round((event.loaded / event.total) * 100)
            }));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            resolve(data.secure_url);
          } else {
            const data = JSON.parse(xhr.responseText);
            reject(new Error(data.error || 'Upload failed'));
          }
        };

        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.send(formData);
      });

      await uploadPromise;
      setUploadStatus(prev => ({ ...prev, [file.name]: 'success' }));
    } catch (err: any) {
      setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }));
      setUploadErrors(prev => ({
        ...prev,
        [file.name]: err.message || 'Upload failed.'
      }));
    }
  }, [setUploadStatus, setUploadErrors, setUploadProgress]);

  const isFileUploading = useCallback((fileName: string) => {
    return uploading && uploadStatus[fileName] === 'uploading';
  }, [uploading, uploadStatus]);

  return {
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleFileInputClick,
    handleFileInputChange,
    handleRemoveFile,
    handleRetryUpload,
    isFileUploading
  };
};
