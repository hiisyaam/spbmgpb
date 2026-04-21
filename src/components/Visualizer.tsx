import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface VisualizerProps {
  array: number[];
  comparingIndices: [number, number] | null;
  swappingIndices: [number, number] | null;
  sortedIndices: number[];
  pivotIndex?: number | null;
}

export default function Visualizer({ 
  array, 
  comparingIndices, 
  swappingIndices, 
  sortedIndices,
  pivotIndex 
}: VisualizerProps) {
  const maxVal = Math.max(...array, 1);

  return (
    <div className="bg-surface-container border border-border rounded-2xl p-10 min-h-[400px] flex flex-col justify-end relative overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <div className="flex items-end justify-around gap-3 h-64 mb-8 relative z-10">
        {array.map((val, idx) => {
          const isComparing = comparingIndices?.includes(idx);
          const isSwapping = swappingIndices?.includes(idx);
          const isSorted = sortedIndices.includes(idx);

          return (
            <motion.div
              key={`${idx}-${val}`}
              layout
              initial={{ height: 0 }}
              animate={{ height: `${(val / maxVal) * 100}%` }}
              className={cn(
                "w-full rounded-t-lg transition-colors duration-300 relative",
                isSorted ? "bg-secondary" : 
                isSwapping ? "bg-secondary" :
                isComparing ? "bg-accent" :
                "bg-[#cbd5e1]"
              )}
            >
              <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[12px] font-bold text-on-surface-variant">
                {val}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
