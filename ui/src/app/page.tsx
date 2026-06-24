import React from 'react';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6 h-full text-white bg-black/40 rounded-xl border border-white/5 backdrop-blur-md shadow-2xl overflow-y-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">MISSION CONTROL</h2>
          <p className="text-white/60 mt-1">Universal OS Global Telemetry</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">System Online</span>
        </div>
      </div>
      
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Swarm Nodes', value: '4', sub: '+1 this hour', color: 'text-cyan-400' },
          { label: 'Total Tokens Burned', value: '2.4M', sub: '$14.20 total cost', color: 'text-purple-400' },
          { label: 'Tasks Completed', value: '142', sub: 'Last 7 days', color: 'text-emerald-400' },
          { label: 'System Memory', value: '28%', sub: 'Obsidian Vault 12MB', color: 'text-amber-400' },
        ].map(metric => (
          <div key={metric.label} className="p-5 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden group">
            <div className="text-white/40 text-xs uppercase tracking-wider mb-2">{metric.label}</div>
            <div className={`text-3xl font-bold ${metric.color}`}>{metric.value}</div>
            <div className="text-white/30 text-xs mt-2">{metric.sub}</div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-all"></div>
          </div>
        ))}
      </div>

      {/* Middle Layout: Activity Log and Agent Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        
        {/* Activity Feed */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent">
          <h3 className="font-semibold text-white/80 uppercase tracking-wider text-xs mb-4">Live Activity Stream</h3>
          <div className="space-y-4">
            {[
              { time: '10:42 AM', agent: 'Orchestrator', action: 'Deployed sub-agent for UI design phase.' },
              { time: '10:39 AM', agent: 'Researcher', action: 'Saved Artifact: CompetitorAnalysis.md' },
              { time: '10:15 AM', agent: 'System', action: 'Processed Dream Sequence. Goals updated.' },
              { time: '09:00 AM', agent: 'Writer', action: 'Completed drafting phase. Pushed to Kanban Review.' }
            ].map((log, i) => (
              <div key={i} className="flex gap-4 items-start text-sm border-l-2 border-white/10 pl-4 py-1 relative">
                <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-cyan-500"></div>
                <div className="text-white/40 w-16 shrink-0">{log.time}</div>
                <div className="text-cyan-300 font-mono w-24 shrink-0">{log.agent}</div>
                <div className="text-white/70">{log.action}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Connections/Engines */}
        <div className="p-5 rounded-xl border border-white/10 bg-white/5">
          <h3 className="font-semibold text-white/80 uppercase tracking-wider text-xs mb-4">Active Engines</h3>
          <div className="flex flex-col gap-3">
            {[
              { name: 'Hermes VPS Gateway', status: 'Connected', ping: '12ms' },
              { name: 'Antigravity CLI', status: 'Connected', ping: '1ms' },
              { name: 'Claude Code', status: 'Idle', ping: '-' },
              { name: 'OpenClaw RPC', status: 'Offline', ping: 'ERR' }
            ].map(engine => (
              <div key={engine.name} className="flex justify-between items-center p-3 rounded-lg bg-black/40 border border-white/5">
                <span className="text-xs text-white/80">{engine.name}</span>
                <span className={`text-xs font-mono ${engine.status === 'Connected' ? 'text-emerald-400' : engine.status === 'Idle' ? 'text-amber-400' : 'text-red-400'}`}>
                  {engine.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
