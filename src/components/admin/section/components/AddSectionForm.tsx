import { Button } from 'ui/button';
import { Input } from 'ui/input';
import { useSectionsTab } from 'contexts/admin/SectionsTabContext';

const AddSectionForm: React.FC = () => {
  const { showAddSection, newSectionTitle, setNewSectionTitle, handleAddSection, closeAddSection } = useSectionsTab();
  if (!showAddSection) return null;

  return (
    <div className="bg-luxury-cream/50 border border-luxury-gray/20 rounded-lg p-4 space-y-3">
      <Input
        placeholder="Enter section title..."
        value={newSectionTitle}
        onChange={(e) => setNewSectionTitle(e.target.value)}
        className="border-luxury-gray/30 focus:border-luxury-gold"
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleAddSection();
          if (e.key === 'Escape') closeAddSection();
        }}
      />
      <div className="flex gap-2">
        <Button
          onClick={handleAddSection}
          disabled={!newSectionTitle.trim()}
          className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-black px-4 py-2 rounded-lg"
        >
          Add Section
        </Button>
        <Button
          onClick={closeAddSection}
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
