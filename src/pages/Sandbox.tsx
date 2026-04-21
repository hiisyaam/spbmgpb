import { useState, useEffect } from 'react';
import { Play, RotateCcw, Plus, Minus } from 'lucide-react';
import Visualizer from '../components/Visualizer';
import { generateBubbleSortSteps, generateSelectionSortSteps, Step } from '../lib/algorithms';
import { playSound, SOUNDS } from '../lib/audio';

export default function Sandbox() {
  const [array, setArray] = useState<number[]>([50, 20, 80, 40, 10, 90, 30]);
  const [algorithm, setAlgorithm] = useState<'bubble' | 'selection'>('bubble');
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);

  useEffect(() => {
    const newSteps = algorithm === 'bubble' 
      ? generateBubbleSortSteps(array) 
      : generateSelectionSortSteps(array);
    setSteps(newSteps);
    setCurrentStepIdx(0);
  }, [array, algorithm]);

  useEffect(() => {
    let timer: any;
    if (isPlaying && currentStepIdx < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStepIdx(prev => prev + 1);
      }, speed);
    } else if (currentStepIdx === steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIdx, steps, speed]);

  useEffect(() => {
    if (steps[currentStepIdx]?.swapping) {
      playSound(SOUNDS.SWAP);
    }
  }, [currentStepIdx]);

  const randomize = () => {
    playSound(SOUNDS.CLICK);
    const newArr = Array.from({ length: 7 }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArr);
    setIsPlaying(false);
  };

  const handlePlayToggle = () => {
    playSound(SOUNDS.CLICK);
    setIsPlaying(!isPlaying);
  };

  const currentStep = steps[currentStepIdx] || { array, comparing: null, swapping: null, sorted: [] };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 md:py-16">
      <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-2 md:mb-4">Algorithm Sandbox</h1>
          <p className="text-on-surface-variant text-base md:text-lg">Experiment with different data sets and observe the behavior in real-time.</p>
        </div>
        
        <div className="flex bg-border p-1 rounded-xl self-start">
          <button 
            onClick={() => { playSound(SOUNDS.CLICK); setAlgorithm('bubble'); }}
            className={`px-4 md:px-6 py-2 rounded-lg font-bold transition-all text-xs md:text-sm ${algorithm === 'bubble' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant'}`}
          >
            Bubble Sort
          </button>
          <button 
            onClick={() => { playSound(SOUNDS.CLICK); setAlgorithm('selection'); }}
            className={`px-4 md:px-6 py-2 rounded-lg font-bold transition-all text-xs md:text-sm ${algorithm === 'selection' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant'}`}
          >
            Selection Sort
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        <div className="lg:col-span-8 space-y-6 md:space-y-8">
          <Visualizer 
            array={currentStep.array}
            comparingIndices={currentStep.comparing}
            swappingIndices={currentStep.swapping}
            sortedIndices={currentStep.sorted}
          />
          
          <div className="card flex flex-wrap items-center justify-between gap-4 md:gap-6">
            <div className="flex items-center gap-3 md:gap-4">
              <button 
                onClick={handlePlayToggle}
                className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary text-white flex items-center justify-center shadow-md hover:bg-primary/90 transition-all"
              >
                {isPlaying ? <RotateCcw size={18} /> : <Play fill="currentColor" size={18} />}
              </button>
              <button 
                onClick={randomize}
                className="btn btn-outline text-xs md:text-sm px-4 py-2 h-auto"
              >
                Randomize Data
              </button>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              <span className="text-[8px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Speed</span>
              <div className="flex items-center bg-surface rounded-lg p-1 border border-border">
                <button onClick={() => { playSound(SOUNDS.CLICK); setSpeed(s => Math.min(s + 100, 2000)); }} className="p-1.5 md:p-2 hover:bg-border rounded-md"><Plus size={12} /></button>
                <span className="px-2 md:px-4 font-mono font-bold text-xs md:text-sm">{(2000 - speed) / 100}x</span>
                <button onClick={() => { playSound(SOUNDS.CLICK); setSpeed(s => Math.max(s - 100, 100)); }} className="p-1.5 md:p-2 hover:bg-border rounded-md"><Minus size={12} /></button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="card h-full">
            <h3 className="card-title text-lg md:text-xl mb-4">Live Trace</h3>
            <div className="space-y-2 md:space-y-3 max-h-[300px] md:max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {steps.slice(0, currentStepIdx + 1).map((step, i) => (
                <div key={i} className={`p-3 md:p-4 rounded-lg border-l-4 transition-all text-xs md:text-sm ${i === currentStepIdx ? 'bg-primary-container border-primary' : 'bg-surface border-transparent opacity-50'}`}>
                  <p className="font-medium leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
