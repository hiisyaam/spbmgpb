export interface User {
  id: number;
  email: string;
  name: string;
  lives: number;
  streak: number;
  level: string;
}

export interface Progress {
  id: number;
  userId: number;
  algorithm: string;
  levelReached: number;
  completionPercentage: number;
  stars: number;
}

export type AlgorithmType = 'bubble_sort' | 'selection_sort';

export interface AlgorithmInfo {
  id: AlgorithmType;
  name: string;
  description: string;
  stars: number;
  progress: number;
}
