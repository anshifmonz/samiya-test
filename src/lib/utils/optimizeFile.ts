import imageCompression from 'browser-image-compression';

interface OptimizationOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker: boolean;
  initialQuality: number;
  alwaysKeepResolution: boolean;
}

async function optimizeFile(file: File): Promise<File> {
  const getOptimizationOptions = (fileSize: number): OptimizationOptions => {
    const sizeInMB = fileSize / (1024 * 1024);

    return {
      maxSizeMB: Math.max(sizeInMB * 0.8, 8),
      maxWidthOrHeight: 4000,
      useWebWorker: true,
      initialQuality: 0.95,
      alwaysKeepResolution: true,
    };
  };

  const options = getOptimizationOptions(file.size);

  try {
    const optimizedFile = await imageCompression(file, options);
    return optimizedFile;
  } catch (error) {
    console.warn('Image optimization failed, using original file:', error);
    return file; // fallback to original file if optimization fails
  }
}

export default optimizeFile;
