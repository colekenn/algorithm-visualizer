// src/types.ts
export type CompareStep = { type: 'compare'; indices: [number, number] };
export type SwapStep = { type: 'swap'; indices: [number, number] };
export type OverwriteStep = { type: 'overwrite'; index: number; value: number };
export type DoneStep = { type: 'done' };

export type Step = CompareStep | SwapStep | OverwriteStep | DoneStep;
