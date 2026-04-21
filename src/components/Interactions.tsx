import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '../lib/utils';

interface SortableItemProps {
  id: string;
  text: string;
  key?: string;
}

function SortableItem({ id, text }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white p-3 rounded-lg border border-border shadow-sm flex items-center justify-between group hover:bg-primary-container transition-colors cursor-grab",
        isDragging && "opacity-50 shadow-md"
      )}
    >
      <code className="text-primary font-bold text-xs">{text}</code>
      <div {...listeners} {...attributes} className="text-on-surface-variant group-hover:text-primary">
        <GripVertical size={16} />
      </div>
    </div>
  );
}

interface Level3Props {
  algorithm: string;
  onSuccess: () => void;
  onFailure: () => void;
}

export function Level3Interaction({ algorithm, onSuccess, onFailure }: Level3Props) {
  const bubbleSortBlocks = [
    { id: '1', text: 'for (int i = 0; i < n-1; i++) {' },
    { id: '2', text: '  for (int j = 0; j < n-i-1; j++) {' },
    { id: '3', text: '    if (arr[j] > arr[j+1]) {' },
    { id: '4', text: '      swap(arr[j], arr[j+1]);' },
    { id: '5', text: '    }' },
    { id: '6', text: '  }' },
    { id: '7', text: '}' },
  ];

  const selectionSortBlocks = [
    { id: '1', text: 'for (int i = 0; i < n-1; i++) {' },
    { id: '2', text: '  int min_idx = i;' },
    { id: '3', text: '  for (int j = i+1; j < n; j++) {' },
    { id: '4', text: '    if (arr[j] < arr[min_idx]) min_idx = j;' },
    { id: '5', text: '  }' },
    { id: '6', text: '  swap(arr[min_idx], arr[i]);' },
    { id: '7', text: '}' },
  ];

  const initialBlocks = algorithm === 'bubble_sort' ? bubbleSortBlocks : selectionSortBlocks;
  const [items, setItems] = useState(() => [...initialBlocks].sort(() => Math.random() - 0.5));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const checkSolution = () => {
    const isCorrect = items.every((item, idx) => item.id === initialBlocks[idx].id);
    if (isCorrect) {
      onSuccess();
    } else {
      onFailure();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#1e293b] rounded-xl p-4 shadow-inner min-h-[300px]">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={items.map(i => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {items.map((item) => (
                <SortableItem key={item.id} id={item.id} text={item.text} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <button 
        onClick={checkSolution}
        className="btn btn-primary w-full bg-secondary hover:bg-secondary/90"
      >
        Run Validation
      </button>
    </div>
  );
}

export function Level2Interaction({ algorithm, onSuccess, onFailure }: Level3Props) {
  const [operator, setOperator] = useState('');

  const check = () => {
    const correct = algorithm === 'bubble_sort' ? '>' : '<';
    if (operator === correct) {
      onSuccess();
    } else {
      onFailure();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#1e293b] p-6 rounded-xl font-mono text-sm leading-relaxed">
        <span className="text-zinc-400">if (arr[j] </span>
        <select 
          value={operator} 
          onChange={(e) => setOperator(e.target.value)}
          className="bg-zinc-800 text-white border-none rounded px-2 py-0.5 focus:ring-1 ring-primary outline-none"
        >
          <option value="">?</option>
          <option value=">">&gt;</option>
          <option value="<">&lt;</option>
          <option value="==">==</option>
        </select>
        <span className="text-zinc-400"> {algorithm === 'bubble_sort' ? 'arr[j+1]' : 'arr[min_idx]'})</span>
      </div>

      <button 
        onClick={check}
        className="btn btn-primary w-full"
      >
        Verify Logic
      </button>
    </div>
  );
}
