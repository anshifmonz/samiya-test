import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from 'ui/badge';
import { Separator } from 'ui/separator';
import { useBulkImportValidation } from '../context';

export const ValidationResults: React.FC = () => {
  const {
    parsedProducts,
    validProductsCount,
    totalProductsCount,
    hasErrors,
    hasWarnings,
    categories
  } = useBulkImportValidation();
  // Helper function to get category name from ID
  const getCategoryDisplay = (categoryId: string): string => {
    if (!categoryId) return 'No Category';

    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return categoryId;
    return category.path.join(' → ');
  };

  if (parsedProducts.length === 0) return null;

  return (
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
                  Price: ₹{product.price} | Category: {getCategoryDisplay(product.categoryId)}
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
  );
};
