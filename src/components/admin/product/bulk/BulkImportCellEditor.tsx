import React, { useState, useRef, useEffect } from 'react';
import { type Category } from 'types/category';
import CategoryAutocomplete from './CategoryAutocomplete';

interface BulkImportCellEditorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  categories?: Category[];
  type: 'text' | 'category' | 'number' | 'tags';
  className?: string;
  placeholder?: string;
}

const BulkImportCellEditor: React.FC<BulkImportCellEditorProps> = ({
  value,
  onChange,
  onBlur,
  onKeyDown,
  categories = [],
  type,
  className = "",
  placeholder
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditValue(value);
  };

  const handleSave = () => {
    onChange(editValue);
    setIsEditing(false);
    onBlur?.();
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
    onBlur?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    } else if (e.key === 'Tab' && type === 'category') {
      // For category fields, Tab should save and move to next field
      e.preventDefault();
      handleSave();
    } else {
      onKeyDown?.(e);
    }
  };

  const handleBlur = () => {
    // For category type, don't auto-save on blur to allow dropdown interaction
    if (type === 'category') {
      return;
    }

    // Small delay to allow for other interactions
    setTimeout(() => {
      if (isEditing) {
        handleSave();
      }
    }, 150);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (type !== 'category') {
        inputRef.current.select();
      }
    }
  }, [isEditing, type]);

  if (!isEditing) {
    return (
      <div
        onClick={handleStartEdit}
        className={`min-h-[32px] px-2 py-1 cursor-pointer hover:bg-luxury-gray/10 rounded transition-colors duration-200 ${className}`}
        title={`Click to edit. Current value: ${value || 'Empty'}`}
      >
        {value || (
          <span className="text-luxury-gray italic text-sm">
            {placeholder || 'Click to edit'}
          </span>
        )}
      </div>
    );
  }

  if (type === 'category' && categories.length > 0) {
    return (
      <div className={`min-w-[200px] ${className}`}>
        <CategoryAutocomplete
          categories={categories}
          value={editValue}
          onChange={(value) => {
            setEditValue(value);
            // Don't auto-save while typing, only save on final selection
          }}
          onSelect={(finalValue) => {
            // Only save and exit editing mode when a final selection is made
            onChange(finalValue);
            setIsEditing(false);
            onBlur?.();
          }}
          placeholder={placeholder || "Type to search categories..."}
          className="text-sm"
          autoCloseOnSelect={false} // Keep open for better UX while typing
        />
      </div>
    );
  }

  return (
    <input
      ref={inputRef}
      type={type === 'number' ? 'number' : 'text'}
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={`w-full px-2 py-1 text-sm border border-luxury-gold/30 rounded focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none ${className}`}
    />
  );
};

export default BulkImportCellEditor;
