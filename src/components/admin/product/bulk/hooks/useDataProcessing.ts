import { useState, useMemo } from 'react';
import { type Category } from 'types/category';
import { type Size } from 'types/product';

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

/**
 * Hook for handling data processing, parsing, and validation
 */
export const useDataProcessing = (categories: Category[], sizes: Size[], expectedHeaders: string[]) => {
  const [pastedData, setPastedData] = useState('');
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([]);
  const [rawTableData, setRawTableData] = useState<string[][]>([]);
  const [tableHeaders, setTableHeaders] = useState<string[]>([]);

  // category name to ID mapping
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach(category => {
      // add category name (both cases)
      map.set(category.name.toLowerCase(), category.id);
      map.set(category.name, category.id);

      // add category path (e.g., "Women > Sarees")
      if (category.path && category.path.length > 0) {
        const pathString = category.path.join(' > ');
        map.set(pathString.toLowerCase(), category.id);
        map.set(pathString, category.id);
        
        // Also add normalized path (trim spaces and normalize separators)
        const normalizedPath = category.path.join('>').toLowerCase().replace(/\s+/g, '');
        const displayNormalizedPath = category.path.join('>');
        map.set(normalizedPath, category.id);
        map.set(displayNormalizedPath, category.id);
      }
    });
    return map;
  }, [categories]);

  // size name to ID mapping
  const sizeMap = useMemo(() => {
    const map = new Map<string, string>();
    sizes.forEach(size => {
      map.set(size.name.toLowerCase(), size.id);
      map.set(size.name, size.id);
    });
    return map;
  }, [sizes]);

  // Helper function to parse image data
  const parseImageData = (imageString: string): { data: Record<string, { hex: string; images: string[] }>; errors: string[] } => {
    const result: Record<string, { hex: string; images: string[] }> = {};
    const errors: string[] = [];
    
    if (!imageString.trim()) {
      return { data: result, errors };
    }
    
    try {
      // Format: colorName:#hexCode|url1,url2,url3;anotherColor:#anotherHex|url4,url5
      const colorGroups = imageString.split(';');
      
      for (const colorGroup of colorGroups) {
        const trimmedGroup = colorGroup.trim();
        if (!trimmedGroup) continue;
        
        // Split by first '|' to separate color info from URLs
        const pipeIndex = trimmedGroup.indexOf('|');
        if (pipeIndex === -1) {
          errors.push(`Invalid image format: "${trimmedGroup}". Expected format: colorName:#hexCode|url1,url2`);
          continue;
        }
        
        const colorInfo = trimmedGroup.substring(0, pipeIndex).trim();
        const urlsString = trimmedGroup.substring(pipeIndex + 1).trim();
        
        // Parse color name and hex code
        const colonIndex = colorInfo.indexOf(':');
        if (colonIndex === -1) {
          errors.push(`Invalid color format: "${colorInfo}". Expected format: colorName:#hexCode`);
          continue;
        }
        
        const colorName = colorInfo.substring(0, colonIndex).trim().toLowerCase();
        const hexCode = colorInfo.substring(colonIndex + 1).trim();
        
        // Validate hex code format
        if (!/^#[0-9A-Fa-f]{6}$/.test(hexCode)) {
          errors.push(`Invalid hex color code: "${hexCode}". Expected format: #RRGGBB`);
          continue;
        }
        
        // Parse URLs
        const urls = urlsString.split(',').map(url => url.trim()).filter(Boolean);
        if (urls.length === 0) {
          errors.push(`No image URLs provided for color: "${colorName}"`);
          continue;
        }
        
        // Validate URLs (basic check)
        const validUrls = urls.filter(url => {
          try {
            new URL(url);
            return true;
          } catch {
            errors.push(`Invalid URL for color "${colorName}": "${url}"`);
            return false;
          }
        });
        
        if (validUrls.length > 0) {
          result[colorName] = {
            hex: hexCode.toUpperCase(),
            images: validUrls
          };
        }
      }
    } catch (error) {
      errors.push(`Error parsing image data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    return { data: result, errors };
  };

  const parsePastedData = (data: string): ParsedProduct[] => {
    const lines = data.trim().split('\n');
    if (lines.length < 1) return [];

    // Check if first line contains headers by comparing with expected headers
    const firstLineFields = lines[0].split('\t');
    const hasCustomHeaders = expectedHeaders.some((header, index) =>
      firstLineFields[index]?.toLowerCase().includes(header.toLowerCase())
    );

    const headers = hasCustomHeaders ? lines[0].split('\t') : expectedHeaders;
    const dataLines = hasCustomHeaders ? lines.slice(1) : lines;
    const products: ParsedProduct[] = [];

    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i].trim();
      if (!line) continue;

      const values = line.split('\t');
      const product: ParsedProduct = {
        title: '',
        description: '',
        price: 0,
        originalPrice: undefined,
        categoryId: '',
        tags: [],
        sizes: [],
        images: {},
        active: true,
        errors: [],
        warnings: []
      };

      headers.forEach((header, index) => {
        const value = values[index]?.trim() || '';
        const headerLower = hasCustomHeaders ? header.toLowerCase() : expectedHeaders[index]?.toLowerCase();

        switch (headerLower) {
          case 'title':
            product.title = value;
            if (!value) product.errors.push('Title is required');
            break;
          case 'description':
            product.description = value;
            if (!value) product.errors.push('Description is required');
            break;
          case 'price':
            const price = parseFloat(value);
            if (isNaN(price) || price < 0) {
              product.errors.push('Price must be a valid positive number');
            } else {
              product.price = price;
            }
            break;
          case 'original price':
            if (value) {
              const originalPrice = parseFloat(value);
              if (isNaN(originalPrice) || originalPrice < 0) {
                product.errors.push('Original price must be a valid positive number');
              } else {
                product.originalPrice = originalPrice;
              }
            }
            break;
          case 'category':
            product.categoryId = value;
            if (!value) {
              product.errors.push('Category is required');
            } else {
              // Try multiple matching strategies
              let categoryFound = false;
              
              // Strategy 1: Direct case-insensitive match
              if (categoryMap.has(value.toLowerCase())) {
                categoryFound = true;
              }
              // Strategy 2: Normalized path match (remove extra spaces around >)
              else {
                const normalizedValue = value.replace(/\s*>\s*/g, '>').toLowerCase().replace(/\s+/g, '');
                if (categoryMap.has(normalizedValue)) {
                  categoryFound = true;
                }
              }
              
              if (!categoryFound) {
                // Provide better error message with suggestions
                const availablePaths = Array.from(categoryMap.keys())
                  .filter(key => key.includes(' > '))
                  .slice(0, 5); // Show first 5 as examples
                
                product.errors.push(
                  `Category "${value}" not found. Available category paths include: ${availablePaths.slice(0, 3).join(', ')}...`
                );
              }
            }
            break;
          case 'tags':
            product.tags = value ? value.split(',').map(tag => tag.trim()).filter(Boolean) : [];
            break;
          case 'sizes':
            product.sizes = value ? value.split(',').map(size => size.trim()).filter(Boolean) : [];
            // validate sizes
            product.sizes.forEach(size => {
              if (!sizeMap.has(size.toLowerCase())) {
                product.warnings.push(`Size "${size}" not found - will be skipped`);
              }
            });
            break;
          case 'images':
            const imageResult = parseImageData(value);
            product.images = imageResult.data;
            // Add any image parsing errors
            product.errors.push(...imageResult.errors);
            break;
          case 'active':
            product.active = value.toLowerCase() === 'true' || value === '1' || value === '';
            break;
        }
      });

      products.push(product);
    }

    return products;
  };

  const processAndUpdateData = (value: string) => {
    // Convert four consecutive spaces to tab characters for column separation
    const processedValue = value.replace(/    /g, '\t');
    if (processedValue.trim()) {
      const lines = processedValue.trim().split('\n');
      if (lines.length > 0) {
        const firstLineFields = lines[0].split('\t');
        const hasCustomHeaders = expectedHeaders.some((header, index) =>
          firstLineFields[index]?.toLowerCase().includes(header.toLowerCase())
        );

        const headers = hasCustomHeaders ? lines[0].split('\t') : expectedHeaders;
        const dataLines = hasCustomHeaders ? lines.slice(1) : lines;
        const rawData = dataLines.filter(line => line.trim()).map(line => line.split('\t'));

        setTableHeaders(headers);
        setRawTableData(rawData);
      }

      const parsed = parsePastedData(processedValue);
      setParsedProducts(parsed);
    } else {
      setParsedProducts([]);
      setRawTableData([]);
      setTableHeaders([]);
    }
    return processedValue;
  };

  // Update cell value in raw table data
  const updateCellValue = (rowIndex: number, colIndex: number, newValue: string) => {
    const updatedRawData = [...rawTableData];
    if (updatedRawData[rowIndex]) {
      const updatedRow = [...updatedRawData[rowIndex]];
      updatedRow[colIndex] = newValue;
      updatedRawData[rowIndex] = updatedRow;
      setRawTableData(updatedRawData);

      // Regenerate pastedData from rawTableData
      const hasCustomHeaders = tableHeaders.length > 0 &&
        expectedHeaders.some((header, index) =>
          tableHeaders[index]?.toLowerCase().includes(header.toLowerCase())
        );

      const lines = hasCustomHeaders
        ? [tableHeaders.join('\t'), ...updatedRawData.map(row => row.join('\t'))]
        : updatedRawData.map(row => row.join('\t'));

      const newPastedData = lines.join('\n');
      setPastedData(newPastedData);

      // Reparse data
      const parsed = parsePastedData(newPastedData);
      setParsedProducts(parsed);
    }
  };

  return {
    pastedData,
    setPastedData,
    parsedProducts,
    rawTableData,
    tableHeaders,
    categoryMap,
    sizeMap,
    processAndUpdateData,
    updateCellValue
  };
};
