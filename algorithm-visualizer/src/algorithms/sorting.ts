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
