import { motion } from 'motion/react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[200] bg-surface flex flex-col items-center justify-center p-6">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mb-6"
      />
      <h2 className="text-2xl font-extrabold tracking-tighter text-primary animate-pulse">
        SORTIFY
      </h2>
      <p className="text-on-surface-variant text-sm mt-2">Preparing your logic lab...</p>
    </div>
  );
}
