'use client';
import { useEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

export default function MemoryGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
    }
  }, []);

  const graphData = {
    nodes: [
      { id: 'Agent OS', group: 1, val: 20 },
      { id: 'Da Vinci', group: 2, val: 10 },
      { id: 'Socrates', group: 2, val: 10 },
      { id: 'Dream Sequence', group: 3, val: 15 },
      { id: 'Artifacts', group: 4, val: 15 },
      { id: 'Webhooks', group: 5, val: 10 },
      { id: 'Daemon.py', group: 3, val: 18 }
    ],
    links: [
      { source: 'Agent OS', target: 'Da Vinci' },
      { source: 'Agent OS', target: 'Socrates' },
      { source: 'Agent OS', target: 'Dream Sequence' },
      { source: 'Agent OS', target: 'Artifacts' },
      { source: 'Daemon.py', target: 'Dream Sequence' },
      { source: 'Daemon.py', target: 'Webhooks' },
      { source: 'Webhooks', target: 'Agent OS' }
    ]
  };

  return (
    <div ref={containerRef} className="w-full h-full min-h-[300px] border border-gray-800 rounded-xl bg-black/40 overflow-hidden">
      <ForceGraph2D
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        nodeColor={(node: any) => {
          if (node.group === 1) return '#06b6d4'; // cyan
          if (node.group === 2) return '#f59e0b'; // amber
          if (node.group === 3) return '#8b5cf6'; // purple
          return '#3b82f6'; // blue
        }}
        nodeRelSize={6}
        linkColor={() => '#334155'}
        backgroundColor="transparent"
      />
    </div>
  );
}
