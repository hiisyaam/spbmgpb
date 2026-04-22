import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Rocket, Award, ArrowRight } from 'lucide-react';
import { User, Progress, AlgorithmInfo } from '../types';
import { playSound, SOUNDS } from '../lib/audio';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [algorithms, setAlgorithms] = useState<AlgorithmInfo[]>([
    {
      id: 'bubble_sort',
      name: 'Bubble Sort',
      description: 'A simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
      stars: 5,
      progress: 0
    },
    {
      id: 'selection_sort',
      name: 'Selection Sort',
      description: 'An in-place comparison sorting algorithm that divides the input list into two parts: the sublist of items already sorted and the sublist of items remaining to be sorted.',
      stars: 5,
      progress: 0
    }
  ]);

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(setUser);

    fetch('/api/progress')
      .then(res => res.json())
      .then((data: Progress[]) => {
        setAlgorithms(prev => prev.map(algo => {
          const p = data.find(d => d.algorithm === algo.id);
          return p ? { ...algo, progress: p.completionPercentage } : algo;
        }));
      });
  }, []);

  const handleAction = () => {
    playSound(SOUNDS.CLICK);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 md:py-16">
      <div className="mb-10 md:mb-20">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-on-surface mb-4 md:mb-6">
          Algorithm <span className="text-primary">Learning System.</span>
        </h1>
        <p className="text-on-surface-variant text-base md:text-xl max-w-2xl leading-relaxed">
          Master sorting algorithms through a structured learning path and interactive visual simulations.
        </p>
      </div>
      {user && (
        <div className="my-10 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
          <div className="bg-white border border-border p-4 md:p-6 rounded-xl flex items-center gap-4 md:gap-5 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Heart fill="currentColor" size={18} className="md:w-5 md:h-5" />
            </div>
            <div>
              <div className="text-[8px] md:text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Hearts</div>
              <div className="text-base md:text-lg font-extrabold">{user.lives} Remaining</div>
            </div>
          </div>

          <div className="bg-white border border-border p-4 md:p-6 rounded-xl flex items-center gap-4 md:gap-5 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
              <Rocket fill="currentColor" size={18} className="md:w-5 md:h-5" />
            </div>
            <div>
              <div className="text-[8px] md:text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Streak</div>
              <div className="text-base md:text-lg font-extrabold">{user.streak} Day Run</div>
            </div>
          </div>

          <div className="bg-white border border-border p-4 md:p-6 rounded-xl flex items-center gap-4 md:gap-5 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
              <Award fill="currentColor" size={18} className="md:w-5 md:h-5" />
            </div>
            <div>
              <div className="text-[8px] md:text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Rank</div>
              <div className="text-base md:text-lg font-extrabold">{user.level}</div>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        {algorithms.map((algo) => (
          <div key={algo.id} className="card group">
            <div className="flex justify-between items-start mb-6 md:mb-8">
              <div>
                <span className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-1 md:mb-2 block">Module 0{algo.id === 'bubble_sort' ? '1' : '2'}</span>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">{algo.name}</h2>
              </div>
              <div className="flex items-center gap-1 md:gap-1.5 bg-surface px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-accent">
                <Star size={12} className="md:w-3.5 md:h-3.5" fill="currentColor" />
                <span className="text-xs md:text-sm font-bold">{algo.stars}</span>
              </div>
            </div>

            <p className="text-on-surface-variant leading-relaxed mb-6 md:mb-10 text-sm md:text-base">{algo.description}</p>

            <div className="space-y-3 md:space-y-4 mb-6 md:mb-10">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Completion</span>
                <span className="text-xs md:text-sm font-extrabold text-primary">{algo.progress}%</span>
              </div>
              <div className="w-full bg-border h-1.5 md:h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-1000"
                  style={{ width: `${algo.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-border">
              <div className="hidden sm:flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-border overflow-hidden">
                    <img
                      src={`https://picsum.photos/seed/user${i}/100/100`}
                      alt="Student"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
              <Link
                to={`/learn/${algo.id}`}
                onClick={handleAction}
                className="btn btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
              >
                {algo.progress > 0 ? 'Continue Path' : 'Start Learning'}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
