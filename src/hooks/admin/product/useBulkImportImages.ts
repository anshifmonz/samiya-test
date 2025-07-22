import { useState, useEffect } from 'react';
import { type ProductImage } from 'types/product';
import { createProductImageWithId } from 'utils/imageIdUtils';

interface BulkImportColorImageData {
  hex: string;
  images: string[];
}

interface ProductColorImageData {
  hex: string;
  images: ProductImage[];
}

export const useBulkImportImages = (
  initialData: Record<string, BulkImportColorImageData>,
  onRealTimeUpdate?: (data: Record<string, BulkImportColorImageData>) => void
) => {
  // convert bulk import format to ProductImagesSection format
  const convertToProductFormat = (data: Record<string, BulkImportColorImageData>): Record<string, ProductColorImageData> => {
    const result: Record<string, ProductColorImageData> = {};

    Object.entries(data).forEach(([color, colorData]) => {
      result[color] = {
        hex: colorData.hex,
        images: colorData.images.map(url => createProductImageWithId(url))
      };
    });

    return result;
  };

  // Convert ProductImagesSection format back to bulk import format
  const convertToBulkFormat = (data: Record<string, ProductColorImageData>): Record<string, BulkImportColorImageData> => {
    const result: Record<string, BulkImportColorImageData> = {};

    Object.entries(data).forEach(([color, colorData]) => {
      result[color] = {
        hex: colorData.hex,
        images: colorData.images.map(img => img.url)
      };
    });

    return result;
  };

  const [productFormatData, setProductFormatData] = useState<Record<string, ProductColorImageData>>(
    convertToProductFormat(initialData)
  );

  // Update product format data when initial data changes
  useEffect(() => {
    setProductFormatData(convertToProductFormat(initialData));
  }, [initialData]);

  const handleImagesChange = (newData: Record<string, ProductColorImageData>) => {
    setProductFormatData(newData);

    // Convert back to bulk format and trigger update
    const bulkFormatData = convertToBulkFormat(newData);
    if (onRealTimeUpdate) {
      onRealTimeUpdate(bulkFormatData);
    }
  };

  return {
    images: productFormatData,
    onImagesChange: handleImagesChange,
    convertToBulkFormat: () => convertToBulkFormat(productFormatData)
  };
};
