import ProductSearchModal from './ProductSearchModal';
import {
  AddSectionForm,
  SectionsHeader,
  SectionsList,
  DraggableSectionItem
} from './components';
import { useSectionsTab } from 'contexts/admin/SectionsTabContext';

const AdminSectionsTab: React.FC = () => {
  const { sectionList, searchModalOpen } = useSectionsTab();

  return (
    <div className="space-y-6">
      <SectionsHeader />
      <AddSectionForm />

      <div className="space-y-4">
        <SectionsList>
          {sectionList.map((section) => (
            <DraggableSectionItem
              key={section.id}
              section={section}
            />
          ))}
        </SectionsList>
      </div>

      {searchModalOpen && (
        <ProductSearchModal />
      )}
    </div>
  );
};

export default AdminSectionsTab;
