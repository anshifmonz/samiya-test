import React from 'react';

interface AddColorDialogProps {
  show: boolean;
  onClose: () => void;
  newImageColor: string;
  setNewImageColor: (v: string) => void;
  onAddColor: () => void;
}

const AddColorDialog: React.FC<AddColorDialogProps> = ({ show, onClose, newImageColor, setNewImageColor, onAddColor }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm z-60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
        <h3 className="luxury-heading text-xl text-luxury-black mb-4">Add New Color</h3>
        <input
          type="text"
          placeholder="Color name (e.g., red, navy, cream)"
          value={newImageColor}
          onChange={e => setNewImageColor(e.target.value)}
          className="w-full px-4 py-3 luxury-body text-sm rounded-xl bg-luxury-cream/50 text-luxury-black border border-luxury-gray/20 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:border-luxury-gold/30 transition-all duration-300 mb-4"
          autoFocus
        />
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
