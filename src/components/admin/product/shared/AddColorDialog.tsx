import React, { useEffect } from 'react';
import { colors } from './colors';

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
  onAddColor
}) => {
  const handleColorSelect = (color: { name: string; hex: string }) => {
    setNewImageColor(color.hex);
    setNewImageColorName(color.name);
  };

  const isValid = newImageColor && newImageColorName.trim();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && isValid) onAddColor();
    };

    if (show) document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [show, onClose, onAddColor, isValid]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-3 py-4 sm:p-6 max-w-lg w-full relative">
        <h3 className="luxury-heading text-xl text-luxury-black mb-4">Add New Color</h3>

        <div className="mb-4">
          <p className="text-sm text-luxury-gray mb-3">Select a color from the predefined list.</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-1">
            {colors.map(color => (
              <div
                key={color.hex}
                onClick={() => handleColorSelect(color)}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                  newImageColor === color.hex
                    ? 'border-luxury-gold ring-2 ring-luxury-gold/50 bg-luxury-cream'
                    : 'border-transparent hover:bg-luxury-cream/50'
                }`}
              >
                <div
                  className="min-w-6 h-6 rounded-full border border-luxury-gray/20"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-xs font-medium text-luxury-black">{color.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
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
