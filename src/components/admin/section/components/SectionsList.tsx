import React from 'react';
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
import { type SectionWithProducts } from 'types/section';
import DraggableSectionItem from './DraggableSectionItem';
import EmptySectionsState from './EmptySectionsState';

interface SectionsListProps {
  sections: SectionWithProducts[];
  onDragEnd: (event: any) => void;
  children: React.ReactNode;
}

const SectionsList: React.FC<SectionsListProps> = ({
  sections,
  onDragEnd,
  children
}) => {
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

  if (sections.length === 0) {
    return <EmptySectionsState />;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={sections.map(section => section.id)}
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
