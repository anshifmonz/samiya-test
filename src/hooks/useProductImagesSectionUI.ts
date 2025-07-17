import { useMemo, useCallback } from 'react';
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { uploadImagesToCloudinary } from 'lib/upload/cloudinary';
import optimizeFile from 'utils/optimizeFile';
import { type ProductColorData } from 'types/product';

interface UseProductImagesSectionUIProps {
  images: { [color: string]: ProductColorData };
  showAddColorDialog: boolean;
  setShowAddColorDialog: (show: boolean) => void;
  showAddImageDialog: boolean;
  setShowAddImageDialog: (show: boolean) => void;
  newImageColor: string;
  setNewImageColor: (color: string) => void;
  newImageColorName: string;
  setNewImageColorName: (color: string) => void;
  newImageUrl: string;
  setNewImageUrl: (url: string) => void;
  selectedColorForImage: string;
  setSelectedColorForImage: (color: string) => void;
  addImageTab: 'url' | 'device';
  setAddImageTab: (tab: 'url' | 'device') => void;
  selectedFiles: File[];
  setSelectedFiles: (files: File[] | ((prev: File[]) => File[])) => void;
  setUploading: (uploading: boolean) => void;
  setUploadError: (error: string | null) => void;
  setUploadProgress: React.Dispatch<React.SetStateAction<{ [filename: string]: number }>>;
  setUploadStatus: React.Dispatch<React.SetStateAction<{ [filename: string]: 'pending' | 'uploading' | 'success' | 'error' }>>;
  setUploadErrors: React.Dispatch<React.SetStateAction<{ [filename: string]: string }>>;
  addColor: () => void;
  addImage: () => void;
  onImagesChange: (images: { [color: string]: ProductColorData }) => void;
}

export const useProductImagesSectionUI = (props: UseProductImagesSectionUIProps) => {
  const {
    images,
    showAddColorDialog,
    setShowAddColorDialog,
    showAddImageDialog,
    setShowAddImageDialog,
    newImageColor,
    setNewImageColor,
    newImageColorName,
    setNewImageColorName,
    newImageUrl,
    setNewImageUrl,
    selectedColorForImage,
    setSelectedColorForImage,
    addImageTab,
    setAddImageTab,
    selectedFiles,
    setSelectedFiles,
    setUploading,
    setUploadError,
    setUploadProgress,
    setUploadStatus,
    setUploadErrors,
    addColor,
    addImage,
    onImagesChange
  } = props;

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const colorVariants = useMemo(() => Object.keys(images), [images]);

  const getColorBackground = useCallback((color: string): string => {
    if (images[color]?.hex && images[color].hex !== '######') {
      return images[color].hex;
    }

    // legacy support
    const colorMap: { [key: string]: string } = {
      cream: '#F5F5DC',
      navy: '#000080',
      red: '#DC2626',
      green: '#059669',
      blue: '#2563EB',
      purple: '#7C3AED',
      pink: '#EC4899',
      yellow: '#EAB308',
      orange: '#EA580C',
      brown: '#92400E',
      gray: '#6B7280',
      black: '#000000',
      white: '#FFFFFF'
    };
    return colorMap[color] || color;
  }, [images]);

  const handleAddColorDialogClose = useCallback(() => {
    setShowAddColorDialog(false);
    setNewImageColor('');
    setNewImageColorName('');
  }, [setShowAddColorDialog, setNewImageColor, setNewImageColorName]);

  const handleAddImageDialogClose = useCallback(() => {
    setShowAddImageDialog(false);
    setNewImageColorName('');
    setNewImageUrl('');
    setSelectedFiles([]);
    setSelectedColorForImage('');
    setUploadError(null);
    setUploadProgress({});
    setUploadStatus({});
    setUploadErrors({});
  }, [
    setShowAddImageDialog,
    setNewImageColorName,
    setNewImageUrl,
    setSelectedFiles,
    setSelectedColorForImage,
    setUploadError,
    setUploadProgress,
    setUploadStatus,
    setUploadErrors
  ]);

  const handleAddImageClick = useCallback((color: string) => {
    setSelectedColorForImage(color);
    setAddImageTab('device');
    setShowAddImageDialog(true);
  }, [setSelectedColorForImage, setAddImageTab, setShowAddImageDialog]);

  const handleAddColorClick = useCallback(() => {
    setShowAddColorDialog(true);
  }, [setShowAddColorDialog]);

  const handleDragStart = useCallback((event: any) => {
    if (event.active.data.current?.type === 'pointer') {
      event.active.data.current.point = event.active.data.current.point;
    }
  }, []);

  const handleImageUpload = useCallback(async () => {
    setUploadError(null);

    if (addImageTab === 'url') {
      addImage();
      return;
    }

    if (addImageTab === 'device') {
      if (!selectedFiles.length) {
        setUploadError('Please select image file(s).');
        return;
      }

      setUploading(true);
      setUploadProgress({});
      setUploadStatus(Object.fromEntries(selectedFiles.map(f => [f.name, 'uploading'])));
      setUploadErrors({});

      try {
        setUploadStatus(Object.fromEntries(selectedFiles.map(f => [f.name, 'uploading'])));
        setUploadProgress(Object.fromEntries(selectedFiles.map(f => [f.name, 0])));

        const optimizedFiles = await Promise.all(
          selectedFiles.map(async (file, index) => {
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: Math.round((index / selectedFiles.length) * 30) // First 30% for optimization
            }));
            return await optimizeFile(file);
          })
        );

        const results = await uploadImagesToCloudinary(optimizedFiles, (file, percent) => {
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: 30 + Math.round((percent / 100) * 70) // Remaining 70% for upload
          }));
        });

        results.forEach(({ file, url, publicId, error }) => {
          if (url && publicId) {
            setUploadStatus(prev => ({ ...prev, [file.name]: 'success' }));
          } else {
            setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }));
            setUploadErrors(prev => ({ ...prev, [file.name]: error || 'Upload failed.' }));
          }
        });

        const uploadedImages = results
          .filter(r => r.url && r.publicId)
          .map(r => ({ url: r.url!, publicId: r.publicId! }));

        if (uploadedImages.length > 0) {
          const currentColorData = images[selectedColorForImage];
          onImagesChange({
            ...images,
            [selectedColorForImage]: {
              hex: currentColorData?.hex || '#000000',
              images: currentColorData?.images
                ? [...currentColorData.images, ...uploadedImages]
                : [...uploadedImages]
            }
          });
          handleAddImageDialogClose();
        } else {
          setUploadError('All uploads failed.');
        }
      } finally {
        setUploading(false);
      }
    }
  }, [
    addImageTab,
    addImage,
    selectedFiles,
    setUploadError,
    setUploading,
    setUploadProgress,
    setUploadStatus,
    setUploadErrors,
    onImagesChange,
    images,
    selectedColorForImage,
    handleAddImageDialogClose
  ]);

  const getImageCount = useCallback((color: string): number => {
    return images[color]?.images?.length || 0;
  }, [images]);

  const isPrimaryColor = useCallback((index: number): boolean => {
    return index === 0;
  }, []);

  return {
    // Sensors and drag/drop
    sensors,
    handleDragStart,

    // Color variants and utilities
    colorVariants,
    getColorBackground,
    getImageCount,
    isPrimaryColor,

    // Dialog handlers
    handleAddColorDialogClose,
    handleAddImageDialogClose,
    handleAddImageClick,
    handleAddColorClick,

    // Image upload
    handleImageUpload,
  };
};
