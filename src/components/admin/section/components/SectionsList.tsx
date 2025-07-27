import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSectionsTab } from 'contexts/admin/SectionsTabContext';
import EmptySectionsState from './EmptySectionsState';

interface SectionsListProps {
  children: React.ReactNode;
}

const SectionsList: React.FC<SectionsListProps> = ({ children }) => {
  const { sectionList, handleSectionDragEnd } = useSectionsTab();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (sectionList.length === 0) {
    return <EmptySectionsState />;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleSectionDragEnd}
    >
      <SortableContext
        items={sectionList.map(section => section.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {children}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default SectionsList;
