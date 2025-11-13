// src/App.tsx
import { useState, useRef, useEffect } from 'react';
import ArrayVisualizer from './components/ArrayVisualizer.tsx';
import Controls from './components/Controls.tsx';
import { getMergeSortSteps, applyStep, getQuickSortSteps } from './algorithms/sorting.ts';
import type { Step } from './types.ts';
import './index.css';

function generateRandomArray(n: number) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 100) + 5);
}

export default function App() {
  const [size, setSize] = useState<number>(40);
  const [array, setArray] = useState<number[]>(() => generateRandomArray(40));
  const stepsRef = useRef<Step[]>([]);
  const stepIndexRef = useRef<number>(0);
  const playingRef = useRef<boolean>(false);
  const [playing, setPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [speed, setSpeed] = useState<number>(1);
  const [algorithm, setAlgorithm] = useState<'merge' | 'quick'>('merge');
  const originalArrayRef = useRef<number[] | null>(null);
  
  // reset everything when array size changes
  useEffect(() => {
    const a = generateRandomArray(size);
    setArray(a);
    stepsRef.current = [];
    stepIndexRef.current = 0;
    setCurrentStepIndex(-1);
    setPlaying(false);
    playingRef.current = false;
  }, [size]);

  // reset steps when algorithm changes
  useEffect(() => {
    stepsRef.current = [];
    stepIndexRef.current = 0;
    setCurrentStepIndex(-1);
    originalArrayRef.current = null;
    setPlaying(false);
    playingRef.current = false;
  }, [algorithm]);

  function onGenerate() {
    const a = generateRandomArray(size);
    setArray(a);
    stepsRef.current = [];
    stepIndexRef.current = 0;
    setCurrentStepIndex(-1);
    setPlaying(false);
    playingRef.current = false;
  }

  function loadAlgorithm() {
    if (algorithm === 'merge') {
      stepsRef.current = getMergeSortSteps(array.slice()); // make a copy so we don't mess with the original
    } else {
      stepsRef.current = getQuickSortSteps(array.slice());
    }
    stepIndexRef.current = 0;
    setCurrentStepIndex(0);
  }

  useEffect(() => {
    // lazy load the steps when play is clicked
    if (playing && stepsRef.current.length === 0) {
      loadAlgorithm();
    }
  }, [playing]); // eslint-disable-line

  function playPause() {
    if (!playing) {
      setPlaying(true);
      playingRef.current = true;
      requestAnimationFrame(runStep);
    } else {
      setPlaying(false);
      playingRef.current = false;
    }
  }

  function runStep() {
    if (!playingRef.current) return;
    const steps = stepsRef.current;
    if (stepIndexRef.current >= steps.length) {
      setPlaying(false);
      playingRef.current = false;
      return;
    }
    const step = steps[stepIndexRef.current++];
    // actually do the step
    setArray(prev => {
      const copy = prev.slice();
      applyStep(copy, step);
      return copy;
    });
    setCurrentStepIndex(stepIndexRef.current - 1);

    // queue up the next step
    const delay = Math.max(10, 300 / speed);
    setTimeout(() => {
      if (playingRef.current) requestAnimationFrame(runStep);
    }, delay);
  }

  function stepForward() {
    if (stepsRef.current.length === 0) loadAlgorithm();
    const step = stepsRef.current[stepIndexRef.current++];
    if (!step) return;
    setArray(prev => {
      const copy = prev.slice();
      applyStep(copy, step);
      return copy;
    });
    setCurrentStepIndex(stepIndexRef.current - 1);
  }

  // keep a copy of the original array so we can step backwards properly
  function loadAlgorithmWithSnapshot() {
    originalArrayRef.current = array.slice();
    if (algorithm === 'merge') {
      stepsRef.current = getMergeSortSteps(originalArrayRef.current.slice());
    } else {
      stepsRef.current = getQuickSortSteps(originalArrayRef.current.slice());
    }
    stepIndexRef.current = 0;
    setCurrentStepIndex(0);
  }
  

  // make sure we save the snapshot when play starts or algorithm changes
  useEffect(() => {
    if (playing && originalArrayRef.current === null) {
      loadAlgorithmWithSnapshot();
    }
  }, [playing, algorithm]); // eslint-disable-line

  // step backwards by going back to the original and replaying up to the target
  function stepBackFixed() {
    if (!originalArrayRef.current) return;
    const target = Math.max(0, stepIndexRef.current - 2);
    // start fresh from the original
    const base = originalArrayRef.current.slice();
    // replay all steps until we get to where we want
    for (let i = 0; i <= target; i++) {
      const s = stepsRef.current[i];
      if (!s) break;
      applyStep(base, s);
    }
    stepIndexRef.current = target + 1;
    setArray(base);
    setCurrentStepIndex(stepIndexRef.current - 1);
  }

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>
      <h2>Algorithm Visualizer — {algorithm === 'merge' ? 'Merge' : 'Quick'} Sort (TypeScript + D3)</h2>
      <Controls
        onGenerate={onGenerate}
        onPlayPause={playPause}
        onStepForward={stepForward}
        onStepBack={stepBackFixed}
        playing={playing}
        speed={speed}
        setSpeed={setSpeed}
        size={size}
        setSize={setSize}
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
      />
      <div style={{ marginTop: 18 }}>
        <ArrayVisualizer array={array} currentStepIndex={currentStepIndex} steps={stepsRef.current} />
      </div>

      <div style={{ marginTop: 12 }}>
        <small>
          Tips: click <b>Generate</b> to create a new array. <b>Play</b> runs {algorithm === 'merge' ? 'Merge' : 'Quick'} Sort.
        </small>
      </div>
    </div>
  );
}
