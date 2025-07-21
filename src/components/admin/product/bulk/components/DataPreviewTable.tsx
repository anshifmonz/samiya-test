import React from 'react';
import { type Category } from 'types/category';
import BulkImportCellEditor from '../BulkImportCellEditor';
import { Edit2 } from 'lucide-react';

interface ParsedProduct {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  tags: string[];
  sizes: string[];
  images: Record<string, { hex: string; images: string[] }>;
  active: boolean;
  errors: string[];
  warnings: string[];
}

interface DataPreviewTableProps {
  pastedData: string;
  expectedHeaders: string[];
  rawTableData: string[][];
  parsedProducts: ParsedProduct[];
  categories: Category[];
  updateCellValue: (rowIndex: number, colIndex: number, newValue: string) => void;
  onEditImages?: (rowIndex: number, productTitle: string, imageData: Record<string, { hex: string; images: string[] }>) => void;
}

/**
 * Data preview table with editable cells
 */
export const DataPreviewTable: React.FC<DataPreviewTableProps> = ({
  pastedData,
  expectedHeaders,
  rawTableData,
  parsedProducts,
  categories,
  updateCellValue,
  onEditImages
}) => {
  if (!pastedData.trim()) return null;

  const lines = pastedData.trim().split('\n');
  if (lines.length < 1) return null;

  // Check if first line contains headers
  const firstLineFields = lines[0].split('\t');
  const hasCustomHeaders = expectedHeaders.some((header, index) =>
    firstLineFields[index]?.toLowerCase().includes(header.toLowerCase())
  );

  const headers = hasCustomHeaders ? lines[0].split('\t') : expectedHeaders;
  const dataRows = (hasCustomHeaders ? lines.slice(1) : lines).filter(line => line.trim());

  return (
    <div className="mt-4">
      <h4 className="font-medium text-luxury-black mb-2">Data Preview</h4>
      <div className="border border-luxury-gray/20 rounded-lg overflow-hidden">
        <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-luxury-gray/10 sticky top-0">
              <tr>
                {headers.map((header, index) => (
                  <th key={index} className="px-3 py-2 text-left font-medium text-luxury-black border-b border-luxury-gray/20 whitespace-nowrap">
                    {header.trim()}
                    {header.toLowerCase() === 'category' && (
                      <span className="text-xs text-luxury-gold ml-2" title="Enhanced with smart suggestions">✨</span>
                    )}
                    {header.toLowerCase() === 'images' && (
                      <span className="text-xs text-purple-600 ml-2" title="Supports color-grouped image data">🎨</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rawTableData.length > 0 ? (
                rawTableData.map((row, rowIndex) => {
                  const hasErrors = parsedProducts[rowIndex]?.errors.length > 0;
                  const hasWarnings = parsedProducts[rowIndex]?.warnings.length > 0;

                  return (
                    <tr
                      key={rowIndex}
                      className={`hover:bg-luxury-gray/5 ${
                        hasErrors ? 'bg-red-50' : hasWarnings ? 'bg-yellow-50' : ''
                      }`}
                    >
                      {headers.map((header, cellIndex) => {
                        const headerLower = header.toLowerCase();
                        const cellValue = row[cellIndex]?.trim() || '';
                        const isCategory = headerLower === 'category';
                        const isTags = headerLower === 'tags';
                        const isImages = headerLower === 'images';
                        const isPrice = headerLower === 'price' || headerLower === 'original price';

                        let cellType: 'text' | 'category' | 'number' | 'tags' = 'text';
                        if (isCategory) cellType = 'category';
                        else if (isTags) cellType = 'tags';
                        else if (isPrice) cellType = 'number';

                        // For images column, use special display logic
                        if (isImages) {
                          const product = parsedProducts[rowIndex];
                          const hasImageData = cellValue && cellValue.trim();

                          return (
                            <td key={cellIndex} className="px-1 py-1 border-b border-luxury-gray/10">
                              <div
                                className={`max-w-[200px] min-h-[32px] px-2 py-1 text-xs rounded border relative group ${
                                  hasImageData ? 'bg-purple-50 cursor-pointer hover:bg-purple-100' : 'bg-gray-50 cursor-pointer hover:bg-gray-100'
                                } transition-colors duration-200`}
                                onClick={() => onEditImages?.(rowIndex, product?.title || `Product ${rowIndex + 1}`, product?.images || {})}
                              >
                                {hasImageData ? (
                                  <>
                                    <div className="font-medium text-purple-700 mb-1 flex items-center justify-between">
                                      <span>Image Data</span>
                                      <Edit2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                    </div>
                                    <div className="space-y-1">
                                      {cellValue.split(';').slice(0, 2).map((colorGroup, idx) => {
                                        const [colorInfo, urls] = colorGroup.split('|');
                                        const [colorName, hex] = colorInfo?.split(':') || [];
                                        const urlCount = urls?.split(',').length || 0;
                                        return (
                                          <div key={idx} className="flex items-center gap-2">
                                            {hex && (
                                              <div
                                                className="w-3 h-3 rounded border border-gray-300"
                                                style={{ backgroundColor: hex }}
                                              />
                                            )}
                                            <span className="capitalize text-gray-700">
                                              {colorName} ({urlCount} {urlCount === 1 ? 'image' : 'images'})
                                            </span>
                                          </div>
                                        );
                                      })}
                                      {cellValue.split(';').length > 2 && (
                                        <div className="text-gray-500">+{cellValue.split(';').length - 2} more colors</div>
                                      )}
                                    </div>
                                  </>
                                ) : (
                                  <div className="font-medium text-gray-500 flex items-center justify-between">
                                    <span>No Images</span>
                                    <Edit2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-luxury-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded pointer-events-none" />
                              </div>
                            </td>
                          );
                        }

                        return (
                          <td key={cellIndex} className="px-1 py-1 border-b border-luxury-gray/10">
                            <BulkImportCellEditor
                              value={cellValue}
                              onChange={(newValue) => updateCellValue(rowIndex, cellIndex, newValue)}
                              categories={isCategory ? categories : undefined}
                              type={cellType}
                              placeholder={`Enter ${header.toLowerCase()}...`}
                              className="text-sm"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              ) : (
                // Fallback to read-only cells when raw data isn't available
                dataRows.map((row, rowIndex) => {
                  const cells = row.split('\t');
                  const hasErrors = parsedProducts[rowIndex]?.errors.length > 0;
                  const hasWarnings = parsedProducts[rowIndex]?.warnings.length > 0;

                  return (
                    <tr
                      key={rowIndex}
                      className={`hover:bg-luxury-gray/5 ${
                        hasErrors ? 'bg-red-50' : hasWarnings ? 'bg-yellow-50' : ''
                      }`}
                    >
                      {headers.map((_, cellIndex) => (
                        <td key={cellIndex} className="px-3 py-2 border-b border-luxury-gray/10 whitespace-nowrap">
                          <div className="max-w-[150px] overflow-hidden text-ellipsis" title={cells[cellIndex]?.trim() || ''}>
                            {cells[cellIndex]?.trim() || '-'}
                          </div>
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data summary */}
      <div className="mt-2 flex items-center justify-between text-sm text-luxury-gray">
        <span>
          {(() => {
            const firstLineFields = lines[0].split('\t');
            const hasCustomHeaders = expectedHeaders.some((header, index) =>
              firstLineFields[index]?.toLowerCase().includes(header.toLowerCase())
            );
            const dataRows = (hasCustomHeaders ? lines.slice(1) : lines).filter(line => line.trim()).length;
            return `${dataRows} rows • ${lines[0]?.split('\t').length || 0} columns${hasCustomHeaders ? ' (with headers)' : ''}`;
          })()}
        </span>
        <span className="text-xs">
          Hover over cells to see full content
        </span>
      </div>
    </div>
  );
};
