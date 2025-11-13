// src/algorithms/sorting.ts
import type { Step } from '../types';

// generates all the steps for merge sort
export function getMergeSortSteps(input: number[]): Step[] {
  const arr = input.slice();
  const steps: Step[] = [];

  function mergeSort(l: number, r: number) {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    mergeSort(l, m);
    mergeSort(m + 1, r);
    merge(l, m, r);
  }

  function merge(l: number, m: number, r: number) {
    const left = arr.slice(l, m + 1);
    const right = arr.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      steps.push({ type: 'compare', indices: [l + i, m + 1 + j] });
      if (left[i] <= right[j]) {
        steps.push({ type: 'overwrite', index: k, value: left[i] });
        arr[k++] = left[i++];
      } else {
        steps.push({ type: 'overwrite', index: k, value: right[j] });
        arr[k++] = right[j++];
      }
    }
    while (i < left.length) {
      steps.push({ type: 'overwrite', index: k, value: left[i] });
      arr[k++] = left[i++];
    }
    while (j < right.length) {
      steps.push({ type: 'overwrite', index: k, value: right[j] });
      arr[k++] = right[j++];
    }
  }

  mergeSort(0, arr.length - 1);
  steps.push({ type: 'done' });
  return steps;
}

// generates all the steps for quick sort
// Example usage:
//   const steps = getQuickSortSteps([64, 34, 25, 12, 22, 11, 90]);
//   // steps will contain compare, swap, overwrite, and done steps
//   // First few steps might be:
//   //   { type: 'compare', indices: [0, 6] }
//   //   { type: 'swap', indices: [0, 1] }
//   //   { type: 'overwrite', index: 0, value: 34 }
//   //   { type: 'overwrite', index: 1, value: 64 }
//   //   { type: 'compare', indices: [1, 6] }
//   //   ...
//   //   { type: 'done' }
export function getQuickSortSteps(input: number[]): Step[] {
  const arr = input.slice();
  const steps: Step[] = [];

  function quickSort(low: number, high: number) {
    if (low < high) {
      const pivotIndex = partition(low, high);
      quickSort(low, pivotIndex - 1);
      quickSort(pivotIndex + 1, high);
    }
  }

  function partition(low: number, high: number): number {
    // use last element as pivot
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      // compare current element with pivot
      steps.push({ type: 'compare', indices: [j, high] });
      if (arr[j] <= pivot) {
        i++;
        if (i !== j) {
          // swap elements - record as both swap and overwrite steps
          steps.push({ type: 'swap', indices: [i, j] });
          steps.push({ type: 'overwrite', index: i, value: arr[j] });
          steps.push({ type: 'overwrite', index: j, value: arr[i] });
          const tmp = arr[i];
          arr[i] = arr[j];
          arr[j] = tmp;
        }
      }
    }

    // place pivot in correct position
    if (i + 1 !== high) {
      steps.push({ type: 'swap', indices: [i + 1, high] });
      steps.push({ type: 'overwrite', index: i + 1, value: arr[high] });
      steps.push({ type: 'overwrite', index: high, value: arr[i + 1] });
      const tmp = arr[i + 1];
      arr[i + 1] = arr[high];
      arr[high] = tmp;
    }

    return i + 1;
  }

  if (arr.length > 0) {
    quickSort(0, arr.length - 1);
  }
  steps.push({ type: 'done' });
  return steps;
}

// actually performs a step on the array (modifies it in place)
export function applyStep(array: number[], step: Step) {
  if (step.type === 'swap') {
    const [i, j] = step.indices;
    const tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  } else if (step.type === 'overwrite') {
    array[step.index] = step.value;
  }
  // compare and done steps are just for visualization, they don't actually change anything
}
