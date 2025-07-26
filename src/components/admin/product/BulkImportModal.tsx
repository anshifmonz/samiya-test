import React, { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Info, X } from 'lucide-react';
import { type CreateProductData } from 'types/product';
import { type Size } from 'types/product';
import { Textarea } from 'ui/textarea';
import { Alert, AlertDescription } from 'ui/alert';
import { Button } from 'ui/button';
import {
  Instructions,
  DynamicColumnHeaders,
  DataPreviewTable,
  ValidationResults,
  ModalActionButtons,
  TextareaCategorySuggestions,
  BulkImportImageDialog,
  BulkImportModalHeader
} from './bulk/components';
import { BulkImportProvider, useBulkImportState, useBulkImportRefs, useBulkImportActions } from './bulk/context';
import { useProductsTab } from 'contexts/admin/ProductsTabContext';

interface BulkImportModalProps {
  sizes: Size[];
  onImport: (products: CreateProductData[]) => void;
  onCancel: () => void;
  persistentData: string;
  onDataChange: (data: string) => void;
  onClearData: () => void;
}

const expectedHeaders = ['Title', 'Description', 'Price', 'Original Price', 'Category', 'Tags', 'Sizes', 'Images', 'Active'];
const sampleData = `Casual T-Shirt\tComfortable cotton t-shirt for daily wear\t299\t399\tMen's Wear > Shirts\tcasual,cotton,comfortable\tS,M,L,XL\tred:#FF0000|https://tinyurl.com/2s4xucnk,https://tinyurl.com/snzrbdrk;blue:#0066CC|https://tinyurl.com/2yhwb4au\tfalse
Elegant Silk Saree\tBeautiful traditional silk saree with golden border\t1499\t1999\tLadies Wear > Saree\tsilk,traditional,wedding\tS,M,L\t\tfalse`;

const BulkImportModalContent: React.FC = () => {
  const { pastedData } = useBulkImportState();
  const { textarea: textareaRef } = useBulkImportRefs();
  const { handleInputChange, handleKeyDown, handleCursorChange, handleClearData } = useBulkImportActions();

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <Alert>
        <Info className="h-4 w-4 flex-shrink-0" />
        <AlertDescription className="text-sm">
          <div className="space-y-2">
            <p>Paste tab-separated data from a spreadsheet. Headers are optional - data will be mapped to columns in the order shown below. Use Tab key or 4 consecutive spaces to separate columns.</p>
            <p><strong className="text-luxury-gold">✨ Enhanced:</strong> Now supports optional image data grouped by color and category suggestions with smart navigation.</p>
            <div className="space-y-1">
              <p><strong>Image Format:</strong></p>
              <code className="text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded block overflow-x-auto">colorName:#hexCode|url1,url2;anotherColor:#hex2|url3</code>
              <p className="text-xs text-gray-600"><em>Example: red:#FF0000|img1.jpg,img2.jpg;blue:#0066CC|img3.jpg</em></p>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      <Instructions />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-medium text-luxury-black">Paste your data here:</label>
          {pastedData.trim() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearData}
              className="text-luxury-gray hover:text-red-600 hover:bg-red-50 h-8 px-3 transition-colors duration-200"
              title="Clear all data"
            >
              <span className="inline xs:hidden">Clear</span>
              <X className="h-4 w-4 mr-1 xs:mr-0" />
            </Button>
          )}
        </div>

        <DynamicColumnHeaders />

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
            className="min-h-[150px] sm:min-h-[200px] font-mono text-xs sm:text-sm w-full"
          />

          <TextareaCategorySuggestions />
        </div>

        <DataPreviewTable />
      </div>

      <ValidationResults />
      <ModalActionButtons />
    </div>
  );
};

const BulkImportModal: React.FC<BulkImportModalProps> = ({
  sizes,
  onImport,
  onCancel,
  persistentData,
  onDataChange,
  onClearData
}) => {
  const { categories } = useProductsTab();

  const modalContent = (
    <BulkImportProvider
      categories={categories}
      sizes={sizes}
      expectedHeaders={expectedHeaders}
      sampleData={sampleData}
      onImport={onImport}
      onCancel={onCancel}
      persistentData={persistentData}
      onDataChange={onDataChange}
      onClearData={onClearData}
    >
      <ModalPortal>
        <div
          className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <BulkImportModalHeader />
            <BulkImportModalContent />
          </div>
          <BulkImportImageDialog />
        </div>
      </ModalPortal>
    </BulkImportProvider>
  );

  return modalContent;
};

// Component to handle portal and mounting logic
const ModalPortal: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { mounted } = useBulkImportState();
  return mounted ? createPortal(children, document.body) : null;
};

export default BulkImportModal;
