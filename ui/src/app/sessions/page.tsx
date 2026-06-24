import React from 'react';

export default function SessionsPage() {
  const sessions = [
    { id: 'ses_09xjf2', name: 'UI Architecting: Artifacts Grid', agent: 'Da Vinci', status: 'Completed', date: 'Today at 3:15 PM' },
    { id: 'ses_88mx1a', name: 'Daemon.py Subprocess Adapter', agent: 'Orchestrator', status: 'Completed', date: 'Today at 1:42 PM' },
    { id: 'ses_11bzw9', name: 'Dream Sequence Generation', agent: 'Socrates', status: 'Active', date: 'Today at 02:00 AM' },
    { id: 'ses_7cvn44', name: 'Prisma Schema Debugging', agent: 'Mercury', status: 'Failed', date: 'Yesterday at 8:20 PM' }
  ];

  return (
    <div className="flex flex-col gap-6 w-full h-full p-6 text-white text-sm bg-black/40 rounded-xl border border-white/5 shadow-2xl backdrop-blur-md overflow-hidden">
      <header className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">SESSIONS // HISTORY</h2>
          <p className="text-white/60 mt-1">Browse, restore, or fork past conversation threads and terminal logs.</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto mt-4 pr-2 space-y-3">
        {sessions.map((session) => (
          <div key={session.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group cursor-pointer relative overflow-hidden">
             {/* Left Info */}
             <div className="flex flex-col gap-1 z-10">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">{session.id}</span>
                  <h3 className="font-bold text-gray-200 group-hover:text-white transition-colors">{session.name}</h3>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400 ml-1">
                   <span>Agent: <span className="text-gray-300">{session.agent}</span></span>
                   <span>•</span>
                   <span>{session.date}</span>
                </div>
             </div>
             
             {/* Right Status */}
             <div className="flex items-center gap-6 z-10">
                <span className={`text-xs font-mono tracking-widest ${session.status === 'Active' ? 'text-cyan-400 animate-pulse' : session.status === 'Completed' ? 'text-emerald-400' : 'text-red-400'}`}>
                   [{session.status}]
                </span>
                <button className="opacity-0 group-hover:opacity-100 px-4 py-1.5 bg-black/50 border border-white/10 hover:bg-white/10 rounded-lg transition-all text-xs font-semibold text-white">
                   Restore
                </button>
             </div>
             
             {/* Hover Glow */}
             <div className="absolute top-0 right-0 h-full w-48 bg-gradient-to-l from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
