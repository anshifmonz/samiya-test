import { useState, useEffect, FC } from 'react';
import { Input } from 'ui/input';
import { Label } from 'ui/label';
import { type Size } from 'types/product';
import { Package, TrendingDown } from 'lucide-react';
import { useProductsTab } from 'contexts/admin/ProductsTabContext';
import { useAdminProductFormColorSizes } from './AdminProductFormContext';

interface ColorSizeSelectProps {
  color: string;
}

const ColorSizeSelect: FC<ColorSizeSelectProps> = ({ color }) => {
  const { handleColorSizesChange, getColorSizes } = useAdminProductFormColorSizes();
  const sizes = getColorSizes(color);
  const { sizes: availableSizes } = useProductsTab();
  const [expandedSizes, setExpandedSizes] = useState<Set<string>>(new Set());

  // New state for local input values
  const [localInputValues, setLocalInputValues] = useState<
    Record<string, { stock_quantity: string; low_stock_threshold: string }>
  >({});

  // Effect to sync local state with sizes from context
  useEffect(() => {
    const newValues: Record<string, { stock_quantity: string; low_stock_threshold: string }> = {};
    sizes.forEach(size => {
      newValues[size.id] = {
        stock_quantity: size.stock_quantity?.toString() ?? '',
        low_stock_threshold: size.low_stock_threshold?.toString() ?? ''
      };
    });
    setLocalInputValues(newValues);
  }, [sizes]);

  const handleSizeToggle = (size: Size) => {
    const isSelected = sizes.some(s => s.id === size.id || s.name === size.name);
    if (isSelected) {
      const updatedSizes = sizes.filter(s => s.id !== size.id && s.name !== size.name);
      handleColorSizesChange(color, updatedSizes);
      // remove from expanded when deselected
      const newExpanded = new Set(expandedSizes);
      newExpanded.delete(size.id);
      setExpandedSizes(newExpanded);
    } else {
      const newSize: Size = {
        ...size,
        stock_quantity: undefined,
        low_stock_threshold: undefined,
        is_in_stock: false,
        is_low_stock: false
      };
      const updatedSizes = [...sizes, newSize];
      handleColorSizesChange(color, updatedSizes);
    }
  };

  const handleStockUpdate = (
    sizeId: string,
    field: 'stock_quantity' | 'low_stock_threshold',
    value: number
  ) => {
    const updatedSizes = sizes.map(size => {
      if (size.id === sizeId) {
        const updatedSize = { ...size, [field]: value };
        // auto-calculate stock status
        if (field === 'stock_quantity') {
          updatedSize.is_in_stock = value > 0;
          updatedSize.is_low_stock = value > 0 && value <= (updatedSize.low_stock_threshold || 1);
        } else if (field === 'low_stock_threshold') {
          updatedSize.is_low_stock =
            (updatedSize.stock_quantity || 0) > 0 && (updatedSize.stock_quantity || 0) <= value;
        }
        return updatedSize;
      }
      return size;
    });
    handleColorSizesChange(color, updatedSizes);
  };

  // New handlers for local input state
  const handleLocalInputChange = (
    sizeId: string,
    field: 'stock_quantity' | 'low_stock_threshold',
    value: string
  ) => {
    setLocalInputValues(prev => ({
      ...prev,
      [sizeId]: {
        ...(prev[sizeId] || { stock_quantity: '', low_stock_threshold: '' }),
        [field]: value
      }
    }));
  };

  const handleInputBlur = (sizeId: string, field: 'stock_quantity' | 'low_stock_threshold') => {
    const stringValue = localInputValues[sizeId]?.[field];
    const defaultValue = field === 'stock_quantity' ? 0 : 1;
    let valueToUpdate = parseInt(stringValue, 10);
    if (isNaN(valueToUpdate)) {
      valueToUpdate = defaultValue;
    }
    handleStockUpdate(sizeId, field, valueToUpdate);
  };

  const toggleSizeExpansion = (sizeId: string) => {
    const newExpanded = new Set(expandedSizes);
    if (newExpanded.has(sizeId)) {
      newExpanded.delete(sizeId);
    } else {
      newExpanded.add(sizeId);
    }
    setExpandedSizes(newExpanded);
  };

  const isSizeSelected = (size: Size) => {
    return sizes.some(s => s.id === size.id || s.name === size.name);
  };

  return (
    <div className="mt-4">
      <Label className="block luxury-subheading text-sm text-luxury-black mb-2">
        Available Sizes for {color.charAt(0).toUpperCase() + color.slice(1)}
      </Label>
      <div className="flex gap-2 flex-wrap">
        {availableSizes.map(size => {
          const isSelected = isSizeSelected(size);
          return (
            <button
              key={size.id}
              type="button"
              onClick={() => handleSizeToggle(size)}
              className={`
                w-12 h-12 rounded-lg border-2 font-medium text-sm transition-all duration-200
                hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50
                ${
                  isSelected
                    ? 'bg-luxury-gold text-white border-luxury-gold shadow-md'
                    : 'bg-luxury-cream/50 text-luxury-black border-luxury-gray/20 hover:bg-luxury-cream hover:border-luxury-gray/30'
                }
              `}
            >
              {size.name}
            </button>
          );
        })}
      </div>

      {/* Stock Management Section */}
      {sizes.length > 0 && (
        <div className="mt-4 space-y-3">
          <h5 className="luxury-subheading text-sm text-luxury-black mb-2 flex items-center gap-2">
            <Package size={16} />
            Stock Management for {color.charAt(0).toUpperCase() + color.slice(1)}
          </h5>

          {sizes.map(size => {
            const isExpanded = expandedSizes.has(size.id);
            const stockStatus = size.is_in_stock ? 'In Stock' : 'Out of Stock';
            const isLowStock = size.is_low_stock && size.is_in_stock;

            return (
              <div key={size.id} className="border border-luxury-gray/20 rounded-lg p-3">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSizeExpansion(size.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-luxury-black">{size.name}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        size.is_in_stock
                          ? isLowStock
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {isLowStock ? 'Low Stock' : stockStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-luxury-gray">
                      Stock: {size.stock_quantity || 0}
                    </span>
                    <span
                      className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    >
                      ▼
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <Label className="block text-xs text-luxury-gray mb-1">Stock Quantity</Label>
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="Enter available stock"
                        value={localInputValues[size.id]?.stock_quantity ?? ''}
                        onChange={e =>
                          handleLocalInputChange(size.id, 'stock_quantity', e.target.value)
                        }
                        onBlur={() => handleInputBlur(size.id, 'stock_quantity')}
                        className="w-full px-2 py-1 border border-luxury-gray/30 rounded text-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold/50"
                      />
                    </div>
                    <div>
                      <Label className="block text-xs text-luxury-gray mb-1 flex items-center gap-1">
                        <TrendingDown size={12} />
                        Low Stock Threshold
                      </Label>
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="Enter low stock threshold"
                        value={localInputValues[size.id]?.low_stock_threshold ?? ''}
                        onChange={e =>
                          handleLocalInputChange(size.id, 'low_stock_threshold', e.target.value)
                        }
                        onBlur={() => handleInputBlur(size.id, 'low_stock_threshold')}
                        className="w-full px-2 py-1 border border-luxury-gray/30 rounded text-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold/50"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {sizes.length > 0 && (
        <div className="mt-2 text-xs text-luxury-gray">
          Selected: {sizes.map(s => s.name).join(', ')}
        </div>
      )}
    </div>
  );
};

export default ColorSizeSelect;
