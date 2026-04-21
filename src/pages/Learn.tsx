import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Info, Lightbulb, Heart, Star, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import Visualizer from '../components/Visualizer';
import { Level2Interaction, Level3Interaction } from '../components/Interactions';
import { generateBubbleSortSteps, generateSelectionSortSteps, Step } from '../lib/algorithms';
import { cn } from '../lib/utils';
import { playSound, SOUNDS } from '../lib/audio';

type Level = 1 | 2 | 3;

export default function Learn() {
  const { algorithm } = useParams<{ algorithm: string }>();
  const navigate = useNavigate();
  const [level, setLevel] = useState<Level>(1);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [lives, setLives] = useState(3);
  const [isComplete, setIsComplete] = useState(false);
  const [showInteraction, setShowInteraction] = useState(false);

  const initialArray = useMemo(() => [40, 85, 25, 60, 95, 15, 50], []);
  
  const steps = useMemo(() => {
    if (algorithm === 'bubble_sort') return generateBubbleSortSteps(initialArray);
    if (algorithm === 'selection_sort') return generateSelectionSortSteps(initialArray);
    return [];
  }, [algorithm, initialArray]);

  const currentStep = steps[currentStepIdx];

  useEffect(() => {
    if (currentStep?.swapping) {
      playSound(SOUNDS.SWAP);
    }
  }, [currentStepIdx]);

  const handleNextStep = () => {
    playSound(SOUNDS.CLICK);
    if (level === 1) {
      if (currentStepIdx < steps.length - 1) {
        setCurrentStepIdx(prev => prev + 1);
      } else {
        setLevel(2);
        setCurrentStepIdx(0);
      }
    } else if (level === 2) {
      if (currentStepIdx < 5) {
        setCurrentStepIdx(prev => prev + 1);
      } else {
        setShowInteraction(true);
      }
    } else if (level === 3) {
      setShowInteraction(true);
    }
  };

  const onSuccess = () => {
    playSound(SOUNDS.SUCCESS);
    toast.success('Bagus! Logika kamu benar.');
    if (level < 3) {
      setLevel(prev => (prev + 1) as Level);
      setCurrentStepIdx(0);
      setShowInteraction(false);
    } else {
      playSound(SOUNDS.COMPLETE);
      setIsComplete(true);
      updateProgress();
    }
  };

  const onFailure = () => {
    playSound(SOUNDS.ERROR);
    setLives(prev => {
      const next = prev - 1;
      if (next <= 0) {
        toast.error('Kesempatan habis! Mengulang level...');
        setCurrentStepIdx(0);
        setShowInteraction(false);
        return 3;
      }
      toast.error('Logika salah. Coba lagi!');
      return next;
    });
  };

  const updateProgress = async () => {
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        algorithm,
        levelReached: level,
        completionPercentage: 100,
        stars: 5
      })
    });
  };

  if (isComplete) {
    return (
      <div className="min-h-[calc(100vh-144px)] flex flex-col items-center justify-center px-6 py-12 text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="relative w-64 h-64 bg-surface-container-lowest rounded-full p-6 flex items-center justify-center shadow-xl mb-12"
        >
          <div className="absolute inset-2 border-2 border-secondary/30 rounded-full border-dashed" />
          <div className="w-full h-full rounded-full signature-gradient flex flex-col items-center justify-center text-white">
            <CheckCircle2 size={80} className="text-secondary-container" />
            <div className="absolute -bottom-4 bg-white text-secondary font-headline font-extrabold px-6 py-2 rounded-full shadow-lg">
              RANK UP
            </div>
          </div>
        </motion.div>

        <h1 className="text-5xl font-extrabold mb-4">Kompetensi Tercapai!</h1>
        <p className="text-xl text-on-surface-variant mb-12 max-w-md">
          Kamu telah menguasai konsep {algorithm?.replace('_', ' ')} secara mendalam.
        </p>

        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/')}
            className="signature-gradient text-white font-bold px-10 py-5 rounded-full shadow-lg hover:scale-105 transition-all"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-6 md:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_300px] gap-6 md:gap-8">
        {/* Sidebar - Hidden on mobile, shown in a different way or at bottom */}
        <aside className="hidden lg:block space-y-8">
          <div className="card">
            <h3 className="card-title">Learning Path</h3>
            <ul className="space-y-3">
              {[
                { name: 'Introduction', level: 0 },
                { name: 'Visual Observation', level: 1 },
                { name: 'Logic Interaction', level: 2 },
                { name: 'Full Evaluation', level: 3 }
              ].map((item, idx) => (
                <li 
                  key={idx}
                  className={cn(
                    "p-3 rounded-lg text-sm transition-all border-l-4",
                    level === item.level
                      ? "bg-primary-container border-primary font-bold text-primary"
                      : level > item.level
                        ? "text-on-surface-variant line-through border-transparent"
                        : "text-on-surface-variant border-transparent"
                  )}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3 className="card-title">Guide</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {algorithm === 'bubble_sort' 
                ? 'Observe how the largest values "bubble up" to the end of the array. Focus on the golden bars currently being compared.'
                : 'Selection sort divides the list into a sorted and unsorted part. It repeatedly finds the minimum element from the unsorted part.'}
            </p>
          </div>
        </aside>

        {/* Main Stage */}
        <section className="space-y-6 md:space-y-8">
          <div className="flex lg:hidden justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
              Level {level}: {level === 1 ? 'Observation' : level === 2 ? 'Interaction' : 'Evaluation'}
            </span>
            <div className="flex items-center gap-2 text-tertiary">
              <Heart size={14} fill="currentColor" />
              <span className="text-sm font-bold">{lives}</span>
            </div>
          </div>

          <div className="relative">
            <Visualizer 
              array={currentStep.array}
              comparingIndices={currentStep.comparing}
              swappingIndices={currentStep.swapping}
              sortedIndices={currentStep.sorted}
            />
            <div className="absolute top-3 left-3 md:top-5 md:left-5 max-w-[180px] md:max-w-[250px] bg-white/90 backdrop-blur p-3 md:p-4 rounded-lg border border-border shadow-sm text-[10px] md:text-sm text-on-surface-variant leading-relaxed">
              <strong>Active Task:</strong> {level === 1 ? 'Observe the algorithm steps.' : 'Complete the logic challenge to proceed.'}
            </div>
          </div>

          {/* Mobile Analysis - Shown below visualizer on mobile */}
          <div className="lg:hidden card">
            <h3 className="card-title text-base mb-2">Live Analysis</h3>
            <p className="text-xs text-on-surface leading-relaxed mb-4">
              {currentStep.description}
            </p>
            {!showInteraction && (
              <div className="code-block text-[10px]">
                <pre className="whitespace-pre-wrap">
                  {algorithm === 'bubble_sort' 
                    ? `if (arr[j] > arr[j+1]) {\n  swap(arr, j, j+1);\n}`
                    : `if (arr[j] < arr[min_idx]) {\n  min_idx = j;\n}`}
                </pre>
              </div>
            )}
            {showInteraction && (
              <div className="mt-4">
                {level === 2 ? (
                  <Level2Interaction 
                    algorithm={algorithm!} 
                    onSuccess={onSuccess} 
                    onFailure={onFailure} 
                  />
                ) : (
                  <Level3Interaction 
                    algorithm={algorithm!} 
                    onSuccess={onSuccess} 
                    onFailure={onFailure} 
                  />
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3 md:gap-4">
            <button 
              onClick={() => { playSound(SOUNDS.CLICK); setCurrentStepIdx(Math.max(0, currentStepIdx - 1)); }}
              className="btn btn-outline flex-1 text-xs md:text-sm py-3 h-auto"
              disabled={currentStepIdx === 0}
            >
              Previous
            </button>
            {!showInteraction && (
              <button 
                onClick={handleNextStep}
                className="btn btn-primary flex-1 text-xs md:text-sm py-3 h-auto"
              >
                {level === 1 && currentStepIdx === steps.length - 1 ? 'Start Challenge' : 'Next Step'}
              </button>
            )}
          </div>
        </section>

        {/* Inspector - Hidden on mobile, shown in Main Stage on mobile */}
        <aside className="hidden lg:block space-y-8">
          <div className="card">
            <h3 className="card-title">Live Analysis</h3>
            <AnimatePresence mode="wait">
              {!showInteraction ? (
                <motion.div 
                  key="analysis"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-on-surface leading-relaxed">
                    {currentStep.description}
                  </p>
                  <div className="code-block">
                    <pre className="whitespace-pre-wrap">
                      {algorithm === 'bubble_sort' 
                        ? `if (arr[j] > arr[j+1]) {\n  swap(arr, j, j+1);\n}`
                        : `if (arr[j] < arr[min_idx]) {\n  min_idx = j;\n}`}
                    </pre>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="interaction"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {level === 2 ? (
                    <Level2Interaction 
                      algorithm={algorithm!} 
                      onSuccess={onSuccess} 
                      onFailure={onFailure} 
                    />
                  ) : (
                    <Level3Interaction 
                      algorithm={algorithm!} 
                      onSuccess={onSuccess} 
                      onFailure={onFailure} 
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="card">
            <h3 className="card-title">Session Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface p-3 rounded-lg text-center">
                <span className="block text-[10px] text-on-surface-variant font-bold uppercase">Hearts</span>
                <span className="block text-xl font-extrabold text-tertiary">{lives}</span>
              </div>
              <div className="bg-surface p-3 rounded-lg text-center">
                <span className="block text-[10px] text-on-surface-variant font-bold uppercase">Step</span>
                <span className="block text-xl font-extrabold">{currentStepIdx + 1}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => { playSound(SOUNDS.CLICK); navigate('/'); }}
            className="btn btn-primary w-full bg-secondary hover:bg-secondary/90"
          >
            Exit to Dashboard
          </button>
        </aside>
      </div>
    </div>
  );
}

