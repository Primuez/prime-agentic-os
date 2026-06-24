import React from 'react';

export default function OperationsPage() {
  return (
    <div className="flex flex-col gap-6 w-full h-full p-6 text-white text-sm bg-black/40 rounded-xl border border-white/5 shadow-2xl backdrop-blur-md">
      <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">OPERATIONS {"//"} SWARM ROSTER</h2>
      <p className="text-white/60">Live telemetry of all active personas bridging across available nodes.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {[
          { name: 'orchestrator', status: 'IDLE', tasks: 0, color: 'text-gray-400' },
          { name: 'researcher', status: 'EXECUTING', tasks: 3, color: 'text-cyan-400 blink' },
          { name: 'builder', status: 'THINKING', tasks: 1, color: 'text-purple-400' },
          { name: 'reviewer', status: 'IDLE', tasks: 0, color: 'text-gray-400' },
          { name: 'qa', status: 'OFFLINE', tasks: 0, color: 'text-red-900' }
        ].map(agent => (
          <div key={agent.name} className="flex flex-col gap-3 p-5 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group hover:bg-white/10 transition-colors">
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 bg-current ${agent.color.split(' ')[0]}`}></div>
            <div className="flex justify-between items-start">
              <h3 className="font-mono text-lg font-bold tracking-wider capitalize text-white group-hover:text-white transition-colors">{agent.name}</h3>
              <span className={`text-xs px-2 py-1 bg-black/50 border border-white/10 rounded-md font-semibold tracking-wider ${agent.color}`}>{agent.status}</span>
            </div>
            <div className="text-white/40 text-xs">Active Tasks: <span className="text-white/80">{agent.tasks}</span></div>
            <button className="mt-2 text-xs border border-white/20 rounded py-1 hover:bg-white/10 transition-colors">View Telemetry</button>
          </div>
        ))}
      </div>
    </div>
  );
}
