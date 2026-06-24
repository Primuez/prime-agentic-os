import React from 'react';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6 h-full text-white bg-black/40 rounded-xl border border-white/5 backdrop-blur-md shadow-2xl">
      <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">DASHBOARD</h2>
      <p className="text-white/60">Universal WebGL Interface connected to daemon.py</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="p-4 rounded-xl border border-white/10 bg-white/5">
             <div className="text-white/40 text-xs uppercase tracking-wider mb-2">Total Compute</div>
             <div className="text-2xl font-bold text-white">41.2M</div>
         </div>
         <div className="p-4 rounded-xl border border-white/10 bg-white/5">
             <div className="text-white/40 text-xs uppercase tracking-wider mb-2">Active Swarm</div>
             <div className="text-2xl font-bold text-cyan-400">3 Nodes</div>
         </div>
         <div className="p-4 rounded-xl border border-white/10 bg-white/5">
             <div className="text-white/40 text-xs uppercase tracking-wider mb-2">System Load</div>
             <div className="text-2xl font-bold text-teal-400">14%</div>
         </div>
      </div>
    </div>
  );
}
