import { useState } from 'react';

export function useBulkImportImageDialog({
  expectedHeaders,
  rawTableData,
  updateCellValue
}: {
  expectedHeaders: string[];
  rawTableData: string[][];
  updateCellValue: (rowIndex: number, colIndex: number, newValue: string) => void;
}) {
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [currentImageRowIndex, setCurrentImageRowIndex] = useState<number>(-1);
  const [currentImageProductTitle, setCurrentImageProductTitle] = useState('');
  const [currentImageData, setCurrentImageData] = useState<Record<string, { hex: string; images: string[] }>>({});

  const handleEditImages = (rowIndex: number, productTitle: string, imageData: Record<string, { hex: string; images: string[] }>) => {
    setCurrentImageRowIndex(rowIndex);
    setCurrentImageProductTitle(productTitle);
    setCurrentImageData(imageData);
    setShowImageDialog(true);
  };

  const handleSaveImageChanges = (newImageData: Record<string, { hex: string; images: string[] }>) => {
    if (currentImageRowIndex >= 0 && currentImageRowIndex < rawTableData.length) {
      const imageString = Object.entries(newImageData)
        .filter(([colorName, colorData]) => {
          return colorData.images.length > 0 || (Object.keys(newImageData).length === 1 && colorName);
        })
        .map(([colorName, colorData]) => {
          const urls = colorData.images.join(',');
          return `${colorName}:${colorData.hex}|${urls}`;
        })
        .join(';');
      const imagesColumnIndex = expectedHeaders.findIndex(header => header.toLowerCase() === 'images');
      if (imagesColumnIndex >= 0) {
        updateCellValue(currentImageRowIndex, imagesColumnIndex, imageString);
      }
      setCurrentImageData(newImageData);
      if (Object.keys(newImageData).length === 0) {
        setShowImageDialog(false);
      }
    }
  };

  const handleRealTimeImageUpdate = (newImageData: Record<string, { hex: string; images: string[] }>) => {
    handleSaveImageChanges(newImageData);
  };

  const handleCloseImageDialog = () => {
    setShowImageDialog(false);
  };

  return {
    showImageDialog,
    currentImageRowIndex,
    currentImageProductTitle,
    currentImageData,
    handleEditImages,
    handleSaveImageChanges,
    handleRealTimeImageUpdate,
    handleCloseImageDialog
  };
}
