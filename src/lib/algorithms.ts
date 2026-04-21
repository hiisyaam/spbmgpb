export interface Step {
  array: number[];
  comparing: [number, number] | null;
  swapping: [number, number] | null;
  sorted: number[];
  description: string;
}

export function generateBubbleSortSteps(initialArray: number[]): Step[] {
  const steps: Step[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  const sorted: number[] = [];

  steps.push({
    array: [...arr],
    comparing: null,
    swapping: null,
    sorted: [],
    description: "Mulai Bubble Sort. Kita akan membandingkan elemen yang berdekatan."
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        swapping: null,
        sorted: [...sorted],
        description: `Bandingkan ${arr[j]} dan ${arr[j + 1]}.`
      });

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({
          array: [...arr],
          comparing: [j, j + 1],
          swapping: [j, j + 1],
          sorted: [...sorted],
          description: `${arr[j + 1]} lebih besar dari ${arr[j]}, tukar posisinya.`
        });
      }
    }
    sorted.push(n - i - 1);
    steps.push({
      array: [...arr],
      comparing: null,
      swapping: null,
      sorted: [...sorted],
      description: `Elemen di indeks ${n - i - 1} sekarang berada di posisi yang benar.`
    });
  }
  sorted.push(0);
  steps.push({
    array: [...arr],
    comparing: null,
    swapping: null,
    sorted: [...sorted],
    description: "Sorting selesai! Semua elemen sudah terurut."
  });

  return steps;
}

export function generateSelectionSortSteps(initialArray: number[]): Step[] {
  const steps: Step[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  const sorted: number[] = [];

  steps.push({
    array: [...arr],
    comparing: null,
    swapping: null,
    sorted: [],
    description: "Mulai Selection Sort. Kita akan mencari elemen terkecil di sisa array."
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    steps.push({
      array: [...arr],
      comparing: [i, i],
      swapping: null,
      sorted: [...sorted],
      description: `Asumsikan elemen di indeks ${i} (${arr[i]}) adalah yang terkecil.`
    });

    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: [...arr],
        comparing: [minIdx, j],
        swapping: null,
        sorted: [...sorted],
        description: `Bandingkan nilai terkecil saat ini (${arr[minIdx]}) dengan ${arr[j]}.`
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          array: [...arr],
          comparing: [minIdx, minIdx],
          swapping: null,
          sorted: [...sorted],
          description: `Ditemukan elemen yang lebih kecil: ${arr[minIdx]} di indeks ${minIdx}.`
        });
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      steps.push({
        array: [...arr],
        comparing: [i, minIdx],
        swapping: [i, minIdx],
        sorted: [...sorted],
        description: `Tukar ${arr[minIdx]} dengan ${arr[i]}.`
      });
    }
    sorted.push(i);
    steps.push({
      array: [...arr],
      comparing: null,
      swapping: null,
      sorted: [...sorted],
      description: `Elemen di indeks ${i} sekarang berada di posisi yang benar.`
    });
  }
  sorted.push(n - 1);
  steps.push({
    array: [...arr],
    comparing: null,
    swapping: null,
    sorted: [...sorted],
    description: "Sorting selesai! Semua elemen sudah terurut."
  });

  return steps;
}
