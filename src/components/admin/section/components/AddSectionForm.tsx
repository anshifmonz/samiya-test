import React from 'react';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';

interface AddSectionFormProps {
  showAddSection: boolean;
  newSectionTitle: string;
  onNewSectionTitleChange: (title: string) => void;
  onAddSection: () => void;
  onCancel: () => void;
}

const AddSectionForm: React.FC<AddSectionFormProps> = ({
  showAddSection,
  newSectionTitle,
  onNewSectionTitleChange,
  onAddSection,
  onCancel
}) => {
  if (!showAddSection) return null;

  return (
    <div className="bg-luxury-cream/50 border border-luxury-gray/20 rounded-lg p-4 space-y-3">
      <Input
        placeholder="Enter section title..."
        value={newSectionTitle}
        onChange={(e) => onNewSectionTitleChange(e.target.value)}
        className="border-luxury-gray/30 focus:border-luxury-gold"
        onKeyDown={(e) => {
          if (e.key === 'Enter') onAddSection();
          if (e.key === 'Escape') onCancel();
        }}
      />
      <div className="flex gap-2">
        <Button
          onClick={onAddSection}
          disabled={!newSectionTitle.trim()}
          className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-black px-4 py-2 rounded-lg"
        >
          Add Section
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="border-luxury-gray/30 text-luxury-gray hover:text-luxury-black"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AddSectionForm;
