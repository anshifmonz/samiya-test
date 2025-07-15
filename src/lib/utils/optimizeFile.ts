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

    if (sizeInMB > 20) {
      return {
        maxSizeMB: 8,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
        initialQuality: 0.7,
        alwaysKeepResolution: false,
      };
    } else if (sizeInMB > 10) {
      return {
        maxSizeMB: 6,
        maxWidthOrHeight: 1800,
        useWebWorker: true,
        initialQuality: 0.8,
        alwaysKeepResolution: false,
      };
    } else if (sizeInMB > 5) {
      return {
        maxSizeMB: 4,
        maxWidthOrHeight: 2000,
        useWebWorker: true,
        initialQuality: 0.85,
        alwaysKeepResolution: false,
      };
    } else {
      return {
        maxSizeMB: 3,
        maxWidthOrHeight: 2000,
        useWebWorker: true,
        initialQuality: 0.9,
        alwaysKeepResolution: false,
      };
    }
  };

  const options = getOptimizationOptions(file.size);

  try {
    const optimizedFile = await imageCompression(file, options);

    if (optimizedFile.size > 5 * 1024 * 1024) { // Still larger than 5MB
      const additionalOptions = {
        ...options,
        maxSizeMB: 3,
        initialQuality: 0.6,
        maxWidthOrHeight: 1200,
      };
      return await imageCompression(optimizedFile, additionalOptions);
    }

    return optimizedFile;
  } catch (error) {
    console.warn('Image optimization failed, using original file:', error);
    return file; // fallback to original file if optimization fails
  }
}

export default optimizeFile;
