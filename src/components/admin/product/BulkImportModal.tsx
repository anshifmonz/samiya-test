import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Download, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { type Product } from 'types/product';
import { type Category } from 'types/category';
import { type Size } from 'types/product';
import { Button } from 'ui/button';
import { Textarea } from 'ui/textarea';
import { Badge } from 'ui/badge';
import { Alert, AlertDescription } from 'ui/alert';
import { Separator } from 'ui/separator';

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
  category: string;
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
  const [pastedData, setPastedData] = useState('');
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // category name to ID mapping
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach(category => {
      // add category name
      map.set(category.name.toLowerCase(), category.id);
      map.set(category.name, category.id);

      // add category path (e.g., "Women > Sarees")
      if (category.path && category.path.length > 0) {
        const pathString = category.path.join(' > ');
        map.set(pathString.toLowerCase(), category.id);
        map.set(pathString, category.id);
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

  const sampleData = `Title	Description	Price	Original Price	Category	Tags	Sizes	Active
Elegant Silk Saree	Beautiful traditional silk saree with golden border	1499	1999	Sarees	silk,traditional,wedding	S,M,L	true
Designer Kurta Set	Premium cotton kurta with matching pajama	899	1299	Kurtas	cotton,formal,office	S,M,L,XL	true
Kids Party Dress	Adorable dress for special occasions	599	799	Girls	kids,party,festive	2T,3T,4T,5T	true`;

  const parsePastedData = (data: string): ParsedProduct[] => {
    const lines = data.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split('\t');
    const products: ParsedProduct[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split('\t');
      const product: ParsedProduct = {
        title: '',
        description: '',
        price: 0,
        originalPrice: undefined,
        category: '',
        tags: [],
        sizes: [],
        active: true,
        errors: [],
        warnings: []
      };

      headers.forEach((header, index) => {
        const value = values[index]?.trim() || '';
        const headerLower = header.toLowerCase();

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
            product.category = value;
            if (!value) {
              product.errors.push('Category is required');
            } else if (!categoryMap.has(value.toLowerCase())) {
              product.errors.push(`Category "${value}" not found`);
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
          case 'active':
            product.active = value.toLowerCase() === 'true' || value === '1' || value === '';
            break;
        }
      });

      products.push(product);
    }

    return products;
  };

  const handlePasteChange = (value: string) => {
    setPastedData(value);
    if (value.trim()) {
      const parsed = parsePastedData(value);
      setParsedProducts(parsed);
    } else {
      setParsedProducts([]);
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
      category: categoryMap.get(product.category.toLowerCase()) || product.category,
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
              Paste tab-separated data from a spreadsheet. The first row should contain headers: Title, Description, Price, Original Price, Category, Tags, Sizes, Active
            </AlertDescription>
          </Alert>

          {/* sample data */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-luxury-black">Sample Format</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPastedData(sampleData)}
                className="text-xs"
              >
                <Download className="h-3 w-3 mr-1" />
                Load Sample
              </Button>
            </div>
            <div className="bg-luxury-gray/10 p-3 rounded-lg text-xs font-mono overflow-x-auto">
              <pre className="whitespace-pre-wrap">{sampleData}</pre>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-medium text-luxury-black">Paste your data here:</label>
            <Textarea
              value={pastedData}
              onChange={(e) => handlePasteChange(e.target.value)}
              placeholder="Paste tab-separated data here..."
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          {/* validation results */}
          {parsedProducts.length > 0 && (
            <div className="space-y-4">
              <Separator />

              <div className="flex items-center justify-between">
                <h3 className="font-medium text-luxury-black">Validation Results</h3>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-luxury-gray">
                    {validProductsCount} of {totalProductsCount} products valid
                  </span>
                  {hasErrors && (
                    <Badge variant="destructive" className="text-xs">
                      {parsedProducts.filter(p => p.errors.length > 0).length} with errors
                    </Badge>
                  )}
                  {hasWarnings && (
                    <Badge variant="secondary" className="text-xs">
                      {parsedProducts.filter(p => p.warnings.length > 0).length} with warnings
                    </Badge>
                  )}
                </div>
              </div>

              {/* product list */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {parsedProducts.map((product, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      product.errors.length > 0
                        ? 'border-red-200 bg-red-50'
                        : product.warnings.length > 0
                        ? 'border-yellow-200 bg-yellow-50'
                        : 'border-green-200 bg-green-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-luxury-black">
                          {product.title || `Row ${index + 2}`}
                        </h4>
                        <p className="text-sm text-luxury-gray mt-1">
                          Price: ₹{product.price} | Category: {product.category}
                        </p>
                      </div>
                      <div className="ml-4">
                        {product.errors.length === 0 && product.warnings.length === 0 ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    </div>

                    {/* errors */}
                    {product.errors.length > 0 && (
                      <div className="mt-2">
                        {product.errors.map((error, errorIndex) => (
                          <p key={errorIndex} className="text-sm text-red-600">
                            • {error}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* warnings */}
                    {product.warnings.length > 0 && (
                      <div className="mt-2">
                        {product.warnings.map((warning, warningIndex) => (
                          <p key={warningIndex} className="text-sm text-yellow-600">
                            • {warning}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={validProductsCount === 0 || isValidating}
              className="bg-luxury-gold hover:bg-luxury-gold/90 text-white"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isValidating ? 'Importing...' : `Import ${validProductsCount} Products`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
};

export default BulkImportModal;
