import React from 'react';
import BulkImportCellEditor from '../BulkImportCellEditor';
import { Edit2 } from 'lucide-react';
import { useBulkImportTableData } from './BulkImportContext';

interface DataPreviewTableProps {
  onRowClick?: (rowIndex: number) => void;
}

export const DataPreviewTable: React.FC<DataPreviewTableProps> = ({
  onRowClick
}) => {
  const { 
    pastedData,
    expectedHeaders,
    rawTableData,
    parsedProducts,
    categories, 
    updateCellValue, 
    handleEditImages, 
    textareaRef 
  } = useBulkImportTableData();
  if (!pastedData.trim()) return null;

  const lines = pastedData.trim().split('\n');
  if (lines.length < 1) return null;

  const firstLineFields = lines[0].split('\t');
  const hasCustomHeaders = expectedHeaders.some((header, index) =>
    firstLineFields[index]?.toLowerCase().includes(header.toLowerCase())
  );

  const headers = hasCustomHeaders ? lines[0].split('\t') : expectedHeaders;
  const dataRows = (hasCustomHeaders ? lines.slice(1) : lines).filter(line => line.trim());

  const jumpToLine = (rowIndex: number) => {
    if (!textareaRef?.current) return;
    const targetLineNumber = hasCustomHeaders ? rowIndex + 2 : rowIndex + 1;
    const allLines = pastedData.split('\n');

    let charPosition = 0;
    for (let i = 0; i < Math.min(targetLineNumber - 1, allLines.length); i++) {
      charPosition += allLines[i].length + 1;
    }

    textareaRef.current.focus();
    textareaRef.current.setSelectionRange(charPosition, charPosition);

    const textarea = textareaRef.current;
    const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
    const currentLine = targetLineNumber - 1;
    textarea.scrollTop = Math.max(0, currentLine * lineHeight - textarea.clientHeight / 2);

    onRowClick?.(rowIndex);
  };

  return (
    <div className="mt-4">
      <h4 className="font-medium text-luxury-black mb-2 text-sm sm:text-base">Data Preview</h4>
      <div className="border border-luxury-gray/20 rounded-lg overflow-hidden">
        <div className="overflow-x-auto max-h-[250px] sm:max-h-[300px] overflow-y-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-luxury-gray/10 sticky top-0">
              <tr>
                <th className="px-2 sm:px-3 py-2 text-center font-medium text-luxury-black border-b border-luxury-gray/20 whitespace-nowrap w-8 sm:w-12">
                  <span className="hidden sm:inline">No</span>
                  <span className="sm:hidden">#</span>
                </th>
                {headers.map((header, index) => (
                  <th key={index} className="px-2 sm:px-3 py-2 text-left font-medium text-luxury-black border-b border-luxury-gray/20 whitespace-nowrap min-w-[100px]">
                    <div className="flex items-center">
                      <span className="block sm:hidden text-xs" title={header.trim()}>
                        {header.trim().length > 6 ? `${header.trim().substring(0, 6)}...` : header.trim()}
                      </span>
                      <span className="hidden sm:block">{header.trim()}</span>
                      {header.toLowerCase() === 'category' && (
                        <span className="text-xs text-luxury-gold ml-2" title="Enhanced with smart suggestions">✨</span>
                      )}
                      {header.toLowerCase() === 'images' && (
                        <span className="text-xs text-purple-600 ml-2" title="Supports color-grouped image data">🎨</span>
                      )}
                    </div>
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
                      <td className="px-2 sm:px-3 py-2 border-b border-luxury-gray/10 text-center">
                        <button
                          onClick={() => jumpToLine(rowIndex)}
                          className="text-luxury-gray hover:text-luxury-gold hover:bg-luxury-gold/10 px-1 sm:px-2 py-1 rounded transition-colors duration-200 text-xs font-medium cursor-pointer"
                          title={`Click to jump to line ${hasCustomHeaders ? rowIndex + 2 : rowIndex + 1} in textarea`}
                        >
                          {rowIndex + 1}
                        </button>
                      </td>
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
                                className={`max-w-[150px] sm:max-w-[200px] min-h-[32px] px-2 py-1 text-xs rounded border relative group ${
                                  hasImageData ? 'bg-purple-50 cursor-pointer hover:bg-purple-100' : 'bg-gray-50 cursor-pointer hover:bg-gray-100'
                                } transition-colors duration-200`}
                                onClick={() => handleEditImages(rowIndex, product?.title || `Product ${rowIndex + 1}`, product?.images || {})}
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
                            <div className="max-w-[120px] sm:max-w-[200px]">
                              <BulkImportCellEditor
                                value={cellValue}
                                onChange={(newValue) => updateCellValue(rowIndex, cellIndex, newValue)}
                                categories={isCategory ? categories : undefined}
                                type={cellType}
                                placeholder={`Enter ${header.toLowerCase()}...`}
                                className="text-xs sm:text-sm w-full"
                              />
                            </div>
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
                      <td className="px-2 sm:px-3 py-2 border-b border-luxury-gray/10 text-center">
                        <button
                          onClick={() => jumpToLine(rowIndex)}
                          className="text-luxury-gray hover:text-luxury-gold hover:bg-luxury-gold/10 px-1 sm:px-2 py-1 rounded transition-colors duration-200 text-xs font-medium cursor-pointer"
                          title={`Click to jump to line ${hasCustomHeaders ? rowIndex + 2 : rowIndex + 1} in textarea`}
                        >
                          {rowIndex + 1}
                        </button>
                      </td>
                      {headers.map((_, cellIndex) => (
                        <td key={cellIndex} className="px-2 sm:px-3 py-2 border-b border-luxury-gray/10">
                          <div className="max-w-[100px] sm:max-w-[150px] overflow-hidden text-ellipsis text-xs sm:text-sm" title={cells[cellIndex]?.trim() || ''}>
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
      <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-luxury-gray">
        <span className="text-xs sm:text-sm">
          {(() => {
            const firstLineFields = lines[0].split('\t');
            const hasCustomHeaders = expectedHeaders.some((header, index) =>
              firstLineFields[index]?.toLowerCase().includes(header.toLowerCase())
            );
            const dataRows = (hasCustomHeaders ? lines.slice(1) : lines).filter(line => line.trim()).length;
            return `${dataRows} rows • ${lines[0]?.split('\t').length || 0} columns${hasCustomHeaders ? ' (with headers)' : ''}`;
          })()}
        </span>
        <span className="text-xs text-luxury-gray/70">
          Hover over cells to see full content
        </span>
      </div>
    </div>
  );
};
