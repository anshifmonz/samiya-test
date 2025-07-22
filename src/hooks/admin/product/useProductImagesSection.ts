import { useState, useCallback } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { type ProductImage, type ProductColorData } from 'types/product';
import { deleteImageFromCloudinary, deleteMultipleImagesFromCloudinary } from 'lib/upload/cloudinary';
import { createProductImageWithId } from 'utils/imageIdUtils';
import isValidPublicId from 'utils/isValidPublicId';
import isCloudinaryUrl from 'utils/isCloudinaryUrls';

export interface ProductImagesSectionProps {
  images: Record<string, ProductColorData>;
  onImagesChange: (images: Record<string, ProductColorData>) => void;
  activeColorTab: string;
  onActiveColorTabChange: (color: string) => void;
}

export function useProductImagesSection({ images, onImagesChange, activeColorTab, onActiveColorTabChange }: ProductImagesSectionProps) {
  const [showAddColorDialog, setShowAddColorDialog] = useState(false);
  const [showAddImageDialog, setShowAddImageDialog] = useState(false);
  const [newImageColor, setNewImageColor] = useState('');
  const [newImageColorName, setNewImageColorName] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [selectedColorForImage, setSelectedColorForImage] = useState('');
  const [addImageTab, setAddImageTab] = useState<'url' | 'device'>('url');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ [filename: string]: number }>({});
  const [uploadStatus, setUploadStatus] = useState<{ [filename: string]: 'pending' | 'uploading' | 'success' | 'error' }>({});
  const [uploadErrors, setUploadErrors] = useState<{ [filename: string]: string }>({});
  const [deletingImages, setDeletingImages] = useState<Set<string>>(new Set());

  const addColor = () => {
    if (newImageColor && newImageColorName && !images[newImageColorName]) {
      onImagesChange({
        ...images,
        [newImageColorName]: {
          hex: newImageColor,
          images: []
        }
      });
      setNewImageColor('');
      setNewImageColorName('');
      setShowAddColorDialog(false);
      onActiveColorTabChange(newImageColorName);
    }
  };

  const addImage = () => {
    if (selectedColorForImage && newImageUrl) {
      const newImage: ProductImage = createProductImageWithId(newImageUrl);

      const currentColorData = images[selectedColorForImage];
      const existingImages = currentColorData?.images || [];

      const imageExists = existingImages.some(img =>
        img.publicId === newImage.publicId && img.url === newImage.url
      );

      if (imageExists) {
        console.warn('Image with same publicId and URL already exists, skipping duplicate.');
        setNewImageUrl('');
        setShowAddImageDialog(false);
        setSelectedColorForImage('');
        return;
      }

      onImagesChange({
        ...images,
        [selectedColorForImage]: {
          hex: currentColorData?.hex || '######',
          images: [...existingImages, newImage]
        }
      });
      setNewImageUrl('');
      setShowAddImageDialog(false);
      setSelectedColorForImage('');
    }
  };

  const reorderColors = useCallback((newColors: string[]) => {
    const newImages: Record<string, ProductColorData> = {};
    newColors.forEach(color => {
      if (images[color]) {
        newImages[color] = images[color];
      }
    });
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  const reorderImages = useCallback((color: string, newImages: ProductImage[]) => {
    const currentColorData = images[color];
    onImagesChange({
      ...images,
      [color]: {
        hex: currentColorData?.hex || '######',
        images: newImages
      }
    });
  }, [images, onImagesChange]);

  const removeImage = useCallback(async (color: string, imageIndex: number) => {
    const colorData = images[color];
    const imageToRemove = colorData?.images[imageIndex];

    if (!imageToRemove) return;

    setDeletingImages(prev => new Set(prev).add(imageToRemove.publicId));

    try {
      if (imageToRemove.publicId && !imageToRemove.publicId.startsWith('url-'))
        await deleteImageFromCloudinary(imageToRemove.publicId);

      const updatedImages = { ...images };
      const updatedColorImages = colorData.images.filter((_, index) => index !== imageIndex);

      if (updatedColorImages.length === 0) {
        delete updatedImages[color];
      } else {
        updatedImages[color] = {
          hex: colorData.hex,
          images: updatedColorImages
        };
      }
      onImagesChange(updatedImages);
    } catch (error) {
      const updatedImages = { ...images };
      const updatedColorImages = colorData.images.filter((_, index) => index !== imageIndex);

      if (updatedColorImages.length === 0) {
        delete updatedImages[color];
      } else {
        updatedImages[color] = {
          hex: colorData.hex,
          images: updatedColorImages
        };
      }
      onImagesChange(updatedImages);
    } finally {
      setDeletingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(imageToRemove.publicId);
        return newSet;
      });
    }
  }, [images, onImagesChange]);

  const removeColor = useCallback(async (colorToRemove: string) => {
    if (window.confirm(`Remove all images for ${colorToRemove}?`)) {
      const colorData = images[colorToRemove];
      const imagesToRemove = colorData?.images || [];

      const publicIds = imagesToRemove.map(img => img.publicId).filter(isValidPublicId);
      setDeletingImages(prev => new Set([...Array.from(prev), ...publicIds]));

      try {
        const cloudinaryImages = imagesToRemove.filter(img =>
          isCloudinaryUrl(img.publicId)
        );

        if (cloudinaryImages.length > 0) {
          const publicIdsToDelete = cloudinaryImages.map(img => img.publicId);
          await deleteMultipleImagesFromCloudinary(publicIdsToDelete);
        }

        const updatedImages = { ...images };
        delete updatedImages[colorToRemove];
        onImagesChange(updatedImages);
      } catch (error) {
        const updatedImages = { ...images };
        delete updatedImages[colorToRemove];
        onImagesChange(updatedImages);
      } finally {
        setDeletingImages(prev => {
          const newSet = new Set(prev);
          publicIds.forEach(id => newSet.delete(id));
          return newSet;
        });
      }
    }
  }, [images, onImagesChange]);

  const handleColorDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const colors = Object.keys(images);
      const oldIndex = colors.indexOf(active.id as string);
      const newIndex = colors.indexOf(over?.id as string);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newColors = arrayMove(colors, oldIndex, newIndex);
        reorderColors(newColors);
      }
    }
  };

  return {
    showAddColorDialog, setShowAddColorDialog,
    showAddImageDialog, setShowAddImageDialog,
    newImageColor, setNewImageColor,
    newImageColorName, setNewImageColorName,
    newImageUrl, setNewImageUrl,
    selectedColorForImage, setSelectedColorForImage,
    addImageTab, setAddImageTab,
    selectedFiles, setSelectedFiles,
    uploading, setUploading,
    uploadError, setUploadError,
    uploadProgress, setUploadProgress,
    uploadStatus, setUploadStatus,
    uploadErrors, setUploadErrors,
    deletingImages,
    addColor, addImage, reorderColors, reorderImages, removeImage, removeColor, handleColorDragEnd,
    onImagesChange, images, activeColorTab, onActiveColorTabChange
  };
}

// helper for arrayMove (from dnd-kit)
function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const arr = array.slice();
  const startIndex = from < 0 ? arr.length + from : from;
  if (startIndex >= 0 && startIndex < arr.length) {
    const endIndex = to < 0 ? arr.length + to : to;
    const [item] = arr.splice(from, 1);
    arr.splice(endIndex, 0, item);
  }
  return arr;
}
