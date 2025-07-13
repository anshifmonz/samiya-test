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

interface UseProductImagesSectionUIProps {
  images: { [color: string]: string[] };
  showAddColorDialog: boolean;
  setShowAddColorDialog: (show: boolean) => void;
  showAddImageDialog: boolean;
  setShowAddImageDialog: (show: boolean) => void;
  newImageColor: string;
  setNewImageColor: (color: string) => void;
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
  onImagesChange: (images: { [color: string]: string[] }) => void;
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

  // Color variants derived from images
  const colorVariants = useMemo(() => Object.keys(images), [images]);

  // Color mapping for visual representation
  const getColorBackground = useCallback((color: string): string => {
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
  }, []);

  // Handle add color dialog close
  const handleAddColorDialogClose = useCallback(() => {
    setShowAddColorDialog(false);
    setNewImageColor('');
  }, [setShowAddColorDialog, setNewImageColor]);

  // Handle add image dialog close
  const handleAddImageDialogClose = useCallback(() => {
    setShowAddImageDialog(false);
    setNewImageUrl('');
    setSelectedFiles([]);
    setSelectedColorForImage('');
    setUploadError(null);
    setUploadProgress({});
    setUploadStatus({});
    setUploadErrors({});
  }, [
    setShowAddImageDialog,
    setNewImageUrl,
    setSelectedFiles,
    setSelectedColorForImage,
    setUploadError,
    setUploadProgress,
    setUploadStatus,
    setUploadErrors
  ]);

  // Handle add image button click
  const handleAddImageClick = useCallback((color: string) => {
    setSelectedColorForImage(color);
    setAddImageTab('device');
    setShowAddImageDialog(true);
  }, [setSelectedColorForImage, setAddImageTab, setShowAddImageDialog]);

  // Handle add color button click
  const handleAddColorClick = useCallback(() => {
    setShowAddColorDialog(true);
  }, [setShowAddColorDialog]);

  // Handle drag start for mobile
  const handleDragStart = useCallback((event: any) => {
    if (event.active.data.current?.type === 'pointer') {
      event.active.data.current.point = event.active.data.current.point;
    }
  }, []);

  // File validation
  const validateFiles = useCallback((files: File[]): string | null => {
    for (const file of files) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        return 'Only JPG, PNG, or WebP images are allowed.';
      }
      if (file.size > 5 * 1024 * 1024) {
        return 'Each file must be 5MB or less.';
      }
    }
    return null;
  }, []);

  // Handle image upload
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

      const validationError = validateFiles(selectedFiles);
      if (validationError) {
        setUploadError(validationError);
        return;
      }

      setUploading(true);
      setUploadProgress({});
      setUploadStatus(Object.fromEntries(selectedFiles.map(f => [f.name, 'uploading'])));
      setUploadErrors({});

      try {
        const results = await uploadImagesToCloudinary(selectedFiles, (file, percent) => {
          setUploadProgress(prev => ({ ...prev, [file.name]: percent }));
        });

        results.forEach(({ file, url, error }) => {
          if (url) {
            setUploadStatus(prev => ({ ...prev, [file.name]: 'success' }));
          } else {
            setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }));
            setUploadErrors(prev => ({ ...prev, [file.name]: error || 'Upload failed.' }));
          }
        });

        const uploadedUrls = results.filter(r => r.url).map(r => r.url as string);

        if (uploadedUrls.length > 0) {
          onImagesChange({
            ...images,
            [selectedColorForImage]: images[selectedColorForImage]
              ? [...images[selectedColorForImage], ...uploadedUrls]
              : [...uploadedUrls]
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
    validateFiles,
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

  // Get image count for a color
  const getImageCount = useCallback((color: string): number => {
    return images[color]?.length || 0;
  }, [images]);

  // Check if color is primary (first in the list)
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
    validateFiles
  };
};
