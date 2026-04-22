import { useState, useMemo } from 'react'
import {
  DndContext, closestCenter,
  KeyboardSensor, PointerSensor, TouchSensor,
  useSensor, useSensors, DragEndEvent
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface SortableItemProps {
  id: string;
  text: string;
  status?: 'correct' | 'incorrect' | 'idle';
}

function SortableItem({ id, text, status = 'idle' }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    WebkitUserSelect: 'none' as const,
    userSelect: 'none' as const,
    touchAction: 'none' as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "bg-white p-3 rounded-lg border shadow-sm flex items-center justify-between group transition-colors",
        isDragging ? "cursor-grabbing opacity-50 shadow-md border-border" : "cursor-grab",
        // Feedback warna per-item: hijau jika benar, merah jika salah, default jika belum divalidasi
        status === 'correct' && "border-green-400 bg-green-50",
        status === 'incorrect' && "border-red-400 bg-red-50",
        status === 'idle' && "border-border hover:bg-primary-container",
      )}
    >
      <code className={cn(
        "font-bold text-xs select-none",
        status === 'correct' ? "text-green-700" : status === 'incorrect' ? "text-red-700" : "text-primary"
      )}>
        {text}
      </code>
      <div className="flex items-center gap-2 pointer-events-none">
        {/* Ikon status validasi, hanya muncul setelah tombol Run Validation ditekan */}
        {status === 'correct' && <CheckCircle2 size={14} className="text-green-500" />}
        {status === 'incorrect' && <XCircle size={14} className="text-red-500" />}
        <div className="text-on-surface-variant group-hover:text-primary">
          <GripVertical size={16} />
        </div>
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

  // useMemo memastikan initialBlocks adalah referensi yang STABIL — tidak berubah
  // antar re-render. Ini penting agar validasi selalu membandingkan dengan
  // urutan yang benar yang sama, bukan objek baru yang kebetulan isinya sama.
  const initialBlocks = useMemo(
    () => algorithm === 'bubble_sort' ? bubbleSortBlocks : selectionSortBlocks,
    [algorithm] // hanya dibuat ulang jika algorithm berubah
  );

  const [items, setItems] = useState(() => {
    // Fisher-Yates shuffle — algoritma acak yang benar-benar uniform,
    // tidak seperti .sort(() => Math.random() - 0.5) yang biased.
    // Juga memastikan hasil tidak sama persis dengan urutan asli (sudah terjawab dari awal).
    const arr = [...initialBlocks];
    let shuffled;
    do {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      shuffled = [...arr];
      // Ulangi jika hasil shuffle kebetulan sama persis dengan jawaban benar
    } while (shuffled.every((item, idx) => item.id === initialBlocks[idx].id));
    return shuffled;
  });

  // State untuk menyimpan status validasi per item ('correct' | 'incorrect' | 'idle')
  // Ini memberi feedback visual yang jelas kepada pengguna baris mana yang salah posisi
  const [itemStatuses, setItemStatuses] = useState<Record<string, 'correct' | 'incorrect' | 'idle'>>(
    () => Object.fromEntries(initialBlocks.map(b => [b.id, 'idle']))
  );
  const [hasValidated, setHasValidated] = useState(false);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 200, tolerance: 8 },
  });

  const sensors = useSensors(
    pointerSensor,
    touchSensor,
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      // Reset status validasi setiap kali pengguna menggeser item —
      // agar feedback lama tidak menyesatkan setelah ada perubahan urutan
      setItemStatuses(Object.fromEntries(initialBlocks.map(b => [b.id, 'idle'])));
      setHasValidated(false);
    }
  };

  const checkSolution = () => {
    // Bandingkan urutan items saat ini dengan urutan jawaban yang benar (initialBlocks)
    const statuses: Record<string, 'correct' | 'incorrect'> = {};
    let allCorrect = true;

    items.forEach((item, idx) => {
      if (item.id === initialBlocks[idx].id) {
        statuses[item.id] = 'correct';
      } else {
        statuses[item.id] = 'incorrect';
        allCorrect = false;
      }
    });

    setItemStatuses(statuses);
    setHasValidated(true);

    // Beri delay singkat agar pengguna sempat melihat feedback visual
    // sebelum onSuccess/onFailure mengubah tampilan halaman
    setTimeout(() => {
      if (allCorrect) onSuccess();
      else onFailure();
    }, 600);
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
                <SortableItem
                  key={item.id}
                  id={item.id}
                  text={item.text}
                  status={itemStatuses[item.id] ?? 'idle'}
                />
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