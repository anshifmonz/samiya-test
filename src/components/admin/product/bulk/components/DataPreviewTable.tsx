import React from 'react';
import { type Category } from 'types/category';
import BulkImportCellEditor from '../BulkImportCellEditor';

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

interface DataPreviewTableProps {
  pastedData: string;
  expectedHeaders: string[];
  rawTableData: string[][];
  parsedProducts: ParsedProduct[];
  categories: Category[];
  updateCellValue: (rowIndex: number, colIndex: number, newValue: string) => void;
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
  updateCellValue
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
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Use inline editors if we have raw table data, otherwise show read-only cells */}
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
                        const isPrice = headerLower === 'price' || headerLower === 'original price';

                        let cellType: 'text' | 'category' | 'number' | 'tags' = 'text';
                        if (isCategory) cellType = 'category';
                        else if (isTags) cellType = 'tags';
                        else if (isPrice) cellType = 'number';

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
