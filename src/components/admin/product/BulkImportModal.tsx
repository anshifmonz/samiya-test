import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Info } from 'lucide-react';
import { type Product } from 'types/product';
import { type Category } from 'types/category';
import { type Size } from 'types/product';
import { Textarea } from 'ui/textarea';
import { Alert, AlertDescription } from 'ui/alert';
import { useCursorTracking, useDataProcessing } from './bulk/hooks';
import {
  Instructions,
  DynamicColumnHeaders,
  DataPreviewTable,
  ValidationResults,
  ModalActionButtons
} from './bulk/components';

interface BulkImportModalProps {
  categories: Category[];
  sizes: Size[];
  onImport: (products: Omit<Product, 'id'>[]) => void;
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

  // Expected column order for reference
  const expectedHeaders = ['Title', 'Description', 'Price', 'Original Price', 'Category', 'Tags', 'Sizes', 'Active'];
  const sampleData = `Elegant Silk Saree\tBeautiful traditional silk saree with golden border\t1499\t1999\tLadies Wear > Saree\tsilk,traditional,wedding\tS,M,L\ttrue
Traditional Kurti\tBeautiful kurti for special occasions\t599\t799\tLadies Wear > Kurtis\tkurti,traditional,festive\tM,L,XL,2XL\ttrue`;

  // Use custom hooks
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

  // Handle input changes with cursor tracking
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const processedValue = processAndUpdateData(e.target.value);
    setPastedData(processedValue);
    setCursorPosition(e.target.selectionStart);
  };

  // Handle loading sample data
  const handleLoadSample = () => {
    const processedValue = processAndUpdateData(sampleData);
    setPastedData(processedValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault(); // Prevent default tab behavior (focus change)

      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Insert four spaces at cursor position
      const newValue = pastedData.substring(0, start) + '    ' + pastedData.substring(end);

      // Process the updated value and update state
      const processedValue = processAndUpdateData(newValue);
      setPastedData(processedValue);

      // Set cursor position after the inserted spaces
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
        setCursorPosition(start + 4);
      }, 0);
    }
  };

    const handleImport = () => {
    setIsValidating(true);

    // filter out products with errors
    const validProducts = parsedProducts.filter(product => product.errors.length === 0);

    if (validProducts.length === 0) {
      setIsValidating(false);
      return;
    }

    // convert to Product format
    const productsToImport: Omit<Product, 'id'>[] = validProducts.map(product => ({
      title: product.title,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      categoryId: categoryMap.get(product.categoryId.toLowerCase()) || product.categoryId,
      tags: product.tags,
      sizes: product.sizes
        .map(sizeName => {
          const sizeId = sizeMap.get(sizeName.toLowerCase());
          return sizeId ? sizes.find(s => s.id === sizeId) : null;
        })
        .filter(Boolean) as Size[],
      active: product.active,
      images: {}, // empty for bulk imports
      short_code: `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));

    onImport(productsToImport);
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
              <strong className="text-luxury-gold">✨ Enhanced:</strong> The active column highlights dynamically as you type, and category cells feature smart suggestions with hierarchical navigation.
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

            <Textarea
              value={pastedData}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onSelect={handleCursorChange}
              onClick={handleCursorChange}
              onKeyUp={handleCursorChange}
              placeholder="Paste tab-separated data here (headers optional). Use Tab key or 4 spaces for columns..."
              className="min-h-[200px] font-mono text-sm"
            />

            <DataPreviewTable
              pastedData={pastedData}
              expectedHeaders={expectedHeaders}
              rawTableData={rawTableData}
              parsedProducts={parsedProducts}
              categories={categories}
              updateCellValue={updateCellValue}
            />
          </div>

          <ValidationResults
            parsedProducts={parsedProducts}
            validProductsCount={validProductsCount}
            totalProductsCount={totalProductsCount}
            hasErrors={hasErrors}
            hasWarnings={hasWarnings}
          />

          <ModalActionButtons
            validProductsCount={validProductsCount}
            isValidating={isValidating}
            onImport={handleImport}
            onCancel={onCancel}
          />
        </div>
      </div>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
};

export default BulkImportModal;
