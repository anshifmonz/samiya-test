import React, { useState, useEffect } from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import colorNamer from 'color-namer';

interface AddColorDialogProps {
  show: boolean;
  onClose: () => void;
  newImageColor: string;
  newImageColorName: string;
  setNewImageColor: (v: string) => void;
  setNewImageColorName: (v: string) => void;
  onAddColor: () => void;
}

const AddColorDialog: React.FC<AddColorDialogProps> = ({
  show,
  onClose,
  newImageColor,
  newImageColorName,
  setNewImageColorName,
  setNewImageColor,
  onAddColor,
}) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [detectedColorName, setDetectedColorName] = useState('');

  useEffect(() => {
    if (newImageColor && newImageColor.startsWith('#')) {
      try {
        const names = colorNamer(newImageColor);
        // set first available name from different color spaces
        const name = names.ntc?.[0]?.name || names.basic?.[0]?.name || names.html?.[0]?.name || 'Unknown';
        setDetectedColorName(name);
        setNewImageColorName(name);
      } catch (error) {
        setDetectedColorName('Unknown');
        setNewImageColorName('Unknown');
      }
    } else {
      setDetectedColorName('');
      setNewImageColorName(newImageColor || '');
    }
  }, [newImageColor, setNewImageColorName]);

  const handleColorChange = (color: ColorResult) => {
    setNewImageColor(color.hex);
  };

  const handleColorPickerClick = () => {
    setDisplayColorPicker((prev) => !prev);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newImageColor && newImageColorName.trim()) {
      onAddColor();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  const handleColorNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewImageColorName(e.target.value);
  };

  const handleUseDetectedName = () => {
    setNewImageColorName(detectedColorName);
  };

  const isValid = newImageColor && newImageColorName.trim();

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full relative">
        <h3 className="luxury-heading text-xl text-luxury-black mb-4">Add New Color</h3>
        {/* Color Picker Section */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-lg border-2 border-luxury-gray/20 cursor-pointer shadow-sm hover:border-luxury-gold/50 transition-colors duration-200"
              style={{ backgroundColor: newImageColor || '#ffffff' }}
              onClick={handleColorPickerClick}
            />
            <div className="flex-1">
              <input
                type="text"
                placeholder="Hex code (e.g., #ff0000)"
                value={newImageColor}
                onChange={e => setNewImageColor(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 luxury-body text-sm rounded-xl bg-luxury-cream/50 text-luxury-black border border-luxury-gray/20 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:border-luxury-gold/30 transition-all duration-300"
                autoFocus
              />
            </div>
          </div>

          {/* Color Name Input */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-luxury-black mb-2">
              Color Name
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter color name (e.g., Ruby Red)"
                value={newImageColorName}
                onChange={handleColorNameChange}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 luxury-body text-sm rounded-xl bg-luxury-cream/50 text-luxury-black border border-luxury-gray/20 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:border-luxury-gold/30 transition-all duration-300"
              />
              {detectedColorName && detectedColorName !== newImageColorName && (
                <button
                  type="button"
                  onClick={handleUseDetectedName}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-luxury-gold hover:text-luxury-gold-light transition-colors duration-200 px-2 py-1 rounded-md hover:bg-luxury-gold/10"
                >
                  Use "{detectedColorName}"
                </button>
              )}
            </div>
            {detectedColorName && (
              <div className="text-xs text-luxury-gray mt-1">
                <span className="font-medium">Detected:</span> {detectedColorName}
              </div>
            )}
          </div>
          {/* Color Picker Popup */}
          {displayColorPicker && (
            <div className="absolute z-10 mt-2 left-0 right-0 flex justify-center">
              <div
                className="fixed inset-0 z-0"
                onClick={() => setDisplayColorPicker(false)}
              />
              <div className="relative z-10">
                <ChromePicker
                  color={newImageColor || '#ffffff'}
                  onChange={handleColorChange}
                  disableAlpha
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 luxury-body text-sm font-medium text-luxury-gray bg-luxury-cream/50 rounded-xl hover:bg-luxury-cream transition-all duration-300 border border-luxury-gray/20"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onAddColor}
            disabled={!isValid}
            className={`flex-1 px-4 py-2 rounded-xl transition-all duration-200 luxury-body text-sm font-medium ${
              !isValid
                ? 'bg-luxury-gray/20 text-luxury-gray cursor-not-allowed'
                : 'bg-luxury-gold text-luxury-black hover:bg-luxury-gold-light'
            }`}
          >
            Add Color
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddColorDialog;
