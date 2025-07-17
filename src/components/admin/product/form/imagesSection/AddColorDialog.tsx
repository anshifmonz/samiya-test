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

  useEffect(() => {
    if (newImageColor && newImageColor.startsWith('#')) {
      try {
        const names = colorNamer(newImageColor);
        // Use the first available name from different color spaces
        const name = names.ntc?.[0]?.name || names.basic?.[0]?.name || names.html?.[0]?.name || 'Unknown';
        setNewImageColorName(name);
      } catch (error) {
        setNewImageColorName('Unknown');
      }
    } else {
      setNewImageColorName(newImageColor || '');
    }
  }, [newImageColor]);

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
                className="w-full px-4 py-3 luxury-body text-sm rounded-xl bg-luxury-cream/50 text-luxury-black border border-luxury-gray/20 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:border-luxury-gold/30 transition-all duration-300"
                autoFocus
              />
            </div>
          </div>
          {/* Color Name Display */}
            {newImageColorName && (
            <div className="text-sm text-luxury-gray mb-3">
              <span className="font-medium">Detected color:</span> {newImageColorName}
            </div>
          )}
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
            className="flex-1 bg-luxury-gold text-luxury-black px-4 py-2 rounded-xl hover:bg-luxury-gold-light transition-colors duration-200"
          >
            Add Color
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddColorDialog;
