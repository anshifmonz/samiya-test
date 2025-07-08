import { useState, useCallback } from 'react';
import { DragEndEvent } from '@dnd-kit/core';

export interface ProductImagesSectionProps {
  images: Record<string, string[]>;
  onImagesChange: (images: Record<string, string[]>) => void;
  activeColorTab: string;
  onActiveColorTabChange: (color: string) => void;
}

export function useProductImagesSection({ images, onImagesChange, activeColorTab, onActiveColorTabChange }: ProductImagesSectionProps) {
  const [showAddColorDialog, setShowAddColorDialog] = useState(false);
  const [showAddImageDialog, setShowAddImageDialog] = useState(false);
  const [newImageColor, setNewImageColor] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [selectedColorForImage, setSelectedColorForImage] = useState('');
  const [addImageTab, setAddImageTab] = useState<'url' | 'device'>('url');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ [filename: string]: number }>({});
  const [uploadStatus, setUploadStatus] = useState<{ [filename: string]: 'pending' | 'uploading' | 'success' | 'error' }>({});
  const [uploadErrors, setUploadErrors] = useState<{ [filename: string]: string }>({});

  const addColor = () => {
    if (newImageColor && !images[newImageColor]) {
      onImagesChange({
        ...images,
        [newImageColor]: []
      });
      setNewImageColor('');
      setShowAddColorDialog(false);
      onActiveColorTabChange(newImageColor);
    }
  };

  const addImage = () => {
    if (selectedColorForImage && newImageUrl) {
      onImagesChange({
        ...images,
        [selectedColorForImage]: images[selectedColorForImage]
          ? [...images[selectedColorForImage], newImageUrl]
          : [newImageUrl]
      });
      setNewImageUrl('');
      setShowAddImageDialog(false);
      setSelectedColorForImage('');
    }
  };

  const reorderColors = useCallback((newColors: string[]) => {
    const newImages: Record<string, string[]> = {};
    newColors.forEach(color => {
      if (images[color]) {
        newImages[color] = images[color];
      }
    });
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  const reorderImages = useCallback((color: string, newImages: string[]) => {
    onImagesChange({
      ...images,
      [color]: newImages
    });
  }, [images, onImagesChange]);

  const removeImage = useCallback((color: string, imageIndex: number) => {
    const updatedImages = { ...images };
    updatedImages[color] = updatedImages[color].filter((_, index) => index !== imageIndex);
    if (updatedImages[color].length === 0) {
      delete updatedImages[color];
    }
    onImagesChange(updatedImages);
  }, [images, onImagesChange]);

  const removeColor = (colorToRemove: string) => {
    if (window.confirm(`Remove all images for ${colorToRemove}?`)) {
      const updatedImages = { ...images };
      delete updatedImages[colorToRemove];
      onImagesChange(updatedImages);
    }
  };

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
    newImageUrl, setNewImageUrl,
    selectedColorForImage, setSelectedColorForImage,
    addImageTab, setAddImageTab,
    selectedFiles, setSelectedFiles,
    uploading, setUploading,
    uploadError, setUploadError,
    uploadProgress, setUploadProgress,
    uploadStatus, setUploadStatus,
    uploadErrors, setUploadErrors,
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
