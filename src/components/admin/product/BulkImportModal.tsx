import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Info } from 'lucide-react';
import { type CreateProductData } from 'types/product';
import { type Category } from 'types/category';
import { type Size } from 'types/product';
import { Textarea } from 'ui/textarea';
import { Alert, AlertDescription } from 'ui/alert';
import { useCursorTracking, useDataProcessing } from './bulk/hooks';
import { createProductImagesWithIds } from 'utils/imageIdUtils';
import {
  Instructions,
  DynamicColumnHeaders,
  DataPreviewTable,
  ValidationResults,
  ModalActionButtons,
  TextareaCategorySuggestions,
  BulkImportImageDialog
} from './bulk/components';

interface BulkImportModalProps {
  categories: Category[];
  sizes: Size[];
  onImport: (products: CreateProductData[]) => void;
  onCancel: () => void;
}

interface ParsedProduct {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  tags: string[];
  sizes: string[];
  images: Record<string, { hex: string; images: string[] }>; // Color name -> hex + image URLs
  active: boolean;
  errors: string[];
  warnings: string[];
}

const BulkImportModal: React.FC<BulkImportModalProps> = ({
  categories,
  sizes,
  onImport,
  onCancel
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Image dialog state
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [currentImageRowIndex, setCurrentImageRowIndex] = useState<number>(-1);
  const [currentImageProductTitle, setCurrentImageProductTitle] = useState('');
  const [currentImageData, setCurrentImageData] = useState<Record<string, { hex: string; images: string[] }>>({});

  const expectedHeaders = ['Title', 'Description', 'Price', 'Original Price', 'Category', 'Tags', 'Sizes', 'Images', 'Active'];
  const sampleData = `Casual T-Shirt\tComfortable cotton t-shirt for daily wear\t299\t399\tMen's Wear > Shirts\tcasual,cotton,comfortable\tS,M,L,XL\tred:#FF0000|https://tinyurl.com/2s4xucnk,https://tinyurl.com/snzrbdrk;blue:#0066CC|https://tinyurl.com/2yhwb4au\tfalse
Elegant Silk Saree\tBeautiful traditional silk saree with golden border\t1499\t1999\tLadies Wear > Saree\tsilk,traditional,wedding\tS,M,L\t\tfalse`;

  const {
    pastedData,
    setPastedData,
    parsedProducts,
    rawTableData,
    categoryMap,
    sizeMap,
    processAndUpdateData,
    updateCellValue
  } = useDataProcessing(categories, sizes, expectedHeaders);

  const {
    cursorPosition,
    setCursorPosition,
    activeColumnIndex,
    handleCursorChange
  } = useCursorTracking(pastedData, expectedHeaders);

  React.useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const processedValue = processAndUpdateData(e.target.value);
    setPastedData(processedValue);
    setCursorPosition(e.target.selectionStart);
  };

  const handleLoadSample = () => {
    const processedValue = processAndUpdateData(sampleData);
    setPastedData(processedValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();

      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newValue = pastedData.substring(0, start) + '    ' + pastedData.substring(end);

      const processedValue = processAndUpdateData(newValue);
      setPastedData(processedValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
        setCursorPosition(start + 4);
      }, 0);
    }
  };

  const handleSuggestionSelect = (suggestion: string, startPos: number, endPos: number) => {
    const newValue = pastedData.substring(0, startPos) + suggestion + pastedData.substring(endPos);
    const processedValue = processAndUpdateData(newValue);
    setPastedData(processedValue);

    // Update cursor position to end of inserted suggestion
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = startPos + suggestion.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        setCursorPosition(newCursorPos);
      }
    }, 0);
  };

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

      // update the current image data state to reflect changes
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

  const handleImport = () => {
    setIsValidating(true);

    const validProducts = parsedProducts.filter(product => product.errors.length === 0);

    if (validProducts.length === 0) {
      setIsValidating(false);
      return;
    }

    const duplicateImageWarnings = validateDuplicateImages(validProducts);
    if (duplicateImageWarnings.length > 0) {
      console.warn('Duplicate image warnings:', duplicateImageWarnings);
      // You could show these warnings to the user if needed
    }

    const productsToImport: CreateProductData[] = validProducts.map(product => {
      const processedImages: Record<string, { hex: string; images: { url: string; publicId: string }[] }> = {};

      Object.entries(product.images).forEach(([colorName, colorData]) => {
        const uniqueImageUrls = Array.from(new Set(colorData.images));

        const validImageUrls = uniqueImageUrls.filter(url => url && url.trim() !== '');

        if (validImageUrls.length > 0) {
          processedImages[colorName] = {
            hex: colorData.hex,
            images: createProductImagesWithIds(validImageUrls)
          };
        }
      });

      return {
        title: product.title,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        categoryId: product.categoryId,
        tags: product.tags,
        sizes: product.sizes
          .map(sizeName => {
            const sizeId = sizeMap.get(sizeName.toLowerCase());
            return sizeId ? sizes.find(s => s.id === sizeId) : null;
          })
          .filter(Boolean) as Size[],
        active: product.active,
        images: processedImages
      };
    });

    onImport(productsToImport);
  };

  const validateDuplicateImages = (products: ParsedProduct[]): string[] => {
    const warnings: string[] = [];
    const imageUrlMap = new Map<string, { productTitle: string; colorName: string }[]>();

    products.forEach((product, productIndex) => {
      Object.entries(product.images).forEach(([colorName, colorData]) => {
        colorData.images.forEach(imageUrl => {
          if (!imageUrlMap.has(imageUrl)) {
            imageUrlMap.set(imageUrl, []);
          }
          imageUrlMap.get(imageUrl)!.push({
            productTitle: product.title,
            colorName: colorName
          });
        });
      });
    });

    imageUrlMap.forEach((usages, imageUrl) => {
      if (usages.length > 1) {
        const usageList = usages.map(usage => `${usage.productTitle} (${usage.colorName})`).join(', ');
        warnings.push(`Image URL "${imageUrl}" is used in multiple products/colors: ${usageList}`);
      }
    });

    return warnings;
  };

  const validProductsCount = parsedProducts.filter(p => p.errors.length === 0).length;
  const totalProductsCount = parsedProducts.length;
  const hasErrors = parsedProducts.some(p => p.errors.length > 0);
  const hasWarnings = parsedProducts.some(p => p.warnings.length > 0);

  const modalContent = (
    <div className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-luxury-gray/20 p-6 flex items-center justify-between z-[9999]">
          <h2 className="luxury-heading text-2xl text-luxury-black">
            Bulk Import Products
          </h2>
          <button
            onClick={onCancel}
            className="text-luxury-gray hover:text-luxury-black transition-colors duration-200"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* instructions */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Paste tab-separated data from a spreadsheet. Headers are optional - data will be mapped to columns in the order shown below. Use Tab key or 4 consecutive spaces to separate columns.
              <br />
              <strong className="text-luxury-gold">✨ Enhanced:</strong> Now supports optional image data grouped by color and category suggestions with smart navigation.
              <br />
              <strong>Image Format:</strong> <code className="text-sm bg-gray-100 px-1 rounded">colorName:#hexCode|url1,url2;anotherColor:#hex2|url3</code>
              <br />
              <em className="text-sm text-gray-600">Example: red:#FF0000|img1.jpg,img2.jpg;blue:#0066CC|img3.jpg</em>
            </AlertDescription>
          </Alert>

          <Instructions
            sampleData={sampleData}
            onLoadSample={handleLoadSample}
          />

          <div className="space-y-2">
            <label className="font-medium text-luxury-black">Paste your data here:</label>

            <DynamicColumnHeaders
              expectedHeaders={expectedHeaders}
              activeColumnIndex={activeColumnIndex}
            />

            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={pastedData}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onSelect={handleCursorChange}
                onClick={handleCursorChange}
                onKeyUp={handleCursorChange}
                placeholder="Paste tab-separated data here (headers optional). Use Tab key or 4 spaces for columns..."
                className="min-h-[200px] font-mono text-sm"
              />

              {/* Inline category suggestions */}
              <TextareaCategorySuggestions
                value={pastedData}
                categories={categories}
                cursorPosition={cursorPosition}
                textareaRef={textareaRef}
                onSuggestionSelect={handleSuggestionSelect}
                expectedHeaders={expectedHeaders}
              />
            </div>

            <DataPreviewTable
              pastedData={pastedData}
              expectedHeaders={expectedHeaders}
              rawTableData={rawTableData}
              parsedProducts={parsedProducts}
              categories={categories}
              updateCellValue={updateCellValue}
              onEditImages={handleEditImages}
              textareaRef={textareaRef}
            />
          </div>

          <ValidationResults
            parsedProducts={parsedProducts}
            validProductsCount={validProductsCount}
            totalProductsCount={totalProductsCount}
            hasErrors={hasErrors}
            hasWarnings={hasWarnings}
            categories={categories}
          />

          <ModalActionButtons
            validProductsCount={validProductsCount}
            isValidating={isValidating}
            onImport={handleImport}
            onCancel={onCancel}
          />
        </div>
      </div>

      {/* Image Editor Dialog */}
      <BulkImportImageDialog
        show={showImageDialog}
        onClose={handleCloseImageDialog}
        productTitle={currentImageProductTitle}
        imageData={currentImageData}
        onSave={handleSaveImageChanges}
        onRealTimeUpdate={handleRealTimeImageUpdate}
      />
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
};

export default BulkImportModal;
