import React from 'react';

export default function ConductorPage() {
  return (
    <div className="flex flex-col gap-6 w-full h-full p-6 text-white text-sm bg-black/40 rounded-xl border border-white/5 shadow-2xl backdrop-blur-md">
      <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">CONDUCTOR {"//"} MISSION CONTROL</h2>
      <p className="text-white/60">Decompose high-level directives into swarm-executable tasks. Track parallel progression.</p>
      
      <div className="flex flex-col gap-4 border border-white/10 bg-black/50 p-4 rounded-xl">
        <h3 className="font-semibold text-white">Create New Mission</h3>
        <input className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white placeholder-white/30 outline-none focus:border-cyan-500 transition-colors" placeholder="Directive (e.g., 'Research and draft a 500-word blog post on Swarm Intelligence...')" />
        <button className="self-end px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-md font-semibold tracking-wide transition-all shadow-[0_0_15px_rgba(0,255,255,0.3)]">DEPLOY SWARM</button>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-4 text-white">Active Missions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-white/10 rounded-xl bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all"></div>
            <h4 className="font-bold text-cyan-300">Blog Generation</h4>
            <p className="text-xs text-white/50 mt-1 line-clamp-2">Research and draft a 500-word blog post on Swarm Intelligence.</p>
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/40">Researcher</span>
                <span className="text-cyan-400">DONE</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/40">Writer</span>
                <span className="text-yellow-400 animate-pulse">DOING</span>
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
               <div className="h-full w-1/2 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
