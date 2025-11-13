// src/components/ArrayVisualizer.tsx
import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import type { Step } from '../types';

type Props = {
  array: number[];
  currentStepIndex: number;
  steps?: Step[];
};

export default function ArrayVisualizer({ array, currentStepIndex, steps = [] }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const svg = d3.select(svgEl);
    const width = svgEl.clientWidth || 800;
    const height = 320;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const padding = 4;
    const barWidth = Math.max(2, (width - padding * array.length) / array.length);
    const maxVal = d3.max(array) ?? 1;
    const yScale = d3.scaleLinear().domain([0, maxVal]).range([0, height - 20]);

    type DataItem = { v: number; i: number };
    const data: DataItem[] = array.map((v, i) => ({ v, i }));

    const rects = svg.selectAll<SVGRectElement, DataItem>('rect').data(data, (d: DataItem) => d.i);

    // add new bars if the array got bigger
    rects.enter()
      .append('rect')
      .attr('x', (d: DataItem) => d.i * (barWidth + padding))
      .attr('y', (d: DataItem) => height - yScale(d.v))
      .attr('width', barWidth)
      .attr('height', (d: DataItem) => yScale(d.v))
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('fill', 'steelblue');

    // update existing bars when values change
    rects.transition().duration(120)
      .attr('x', (d: DataItem) => d.i * (barWidth + padding))
      .attr('y', (d: DataItem) => height - yScale(d.v))
      .attr('width', barWidth)
      .attr('height', (d: DataItem) => yScale(d.v));

    // remove bars if array got smaller
    rects.exit().remove();

    // color code the bars based on what's happening in the current step
    if (steps[currentStepIndex]) {
      const step = steps[currentStepIndex];
      svg.selectAll('rect').attr('fill', (_: unknown, idx: number) => {
        if (step.type === 'compare' && 'indices' in step && step.indices.includes(idx)) return 'orange';
        if (step.type === 'swap' && 'indices' in step && step.indices.includes(idx)) return 'red';
        if (step.type === 'overwrite' && 'index' in step && step.index === idx) return 'green';
        return 'steelblue';
      });
    } else {
      svg.selectAll('rect').attr('fill', 'steelblue');
    }

  }, [array, currentStepIndex, steps]);

  return <svg ref={svgRef} style={{ width: '100%', height: 340 }} />;
}
