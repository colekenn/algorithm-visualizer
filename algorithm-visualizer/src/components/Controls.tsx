// src/components/Controls.tsx
type Props = {
  onGenerate: () => void;
  onPlayPause: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  playing: boolean;
  speed: number;
  setSpeed: (s: number) => void;
  size: number;
  setSize: (n: number) => void;
  algorithm: 'merge' | 'quick';
  setAlgorithm: (a: 'merge' | 'quick') => void;
};

export default function Controls({
  onGenerate, onPlayPause, onStepForward, onStepBack,
  playing, speed, setSpeed, size, setSize,
  algorithm, setAlgorithm
}: Props) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      <button onClick={onGenerate}>Generate</button>
      <button onClick={onPlayPause}>{playing ? 'Pause' : 'Play'}</button>
      <button onClick={onStepBack}>◀ Step</button>
      <button onClick={onStepForward}>Step ▶</button>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        Algorithm
        <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value as 'merge'|'quick')}>
          <option value="merge">Merge Sort</option>
          <option value="quick">Quick Sort</option>
        </select>
      </label>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        Size
        <input
          type="range"
          min={10}
          max={160}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
        />
        <span>{size}</span>
      </label>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        Speed
        <input
          type="range"
          min={0.25}
          max={4}
          step={0.25}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
        <span>{speed}x</span>
      </label>
    </div>
  );
}
