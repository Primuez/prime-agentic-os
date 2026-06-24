import React from 'react';

export default function KanbanPage() {
  const columns = [
    { title: 'BACKLOG', color: 'border-white/20 text-white', tasks: ['Set up Supabase integration', 'Write agent testing docs'] },
    { title: 'IN PROGRESS', color: 'border-cyan-500/50 text-cyan-400', tasks: ['Generate Dashboard masonry layout', 'Analyze competitor codebases'] },
    { title: 'REVIEW', color: 'border-purple-500/50 text-purple-400', tasks: ['Fix Prisma Schema issue'] },
    { title: 'DONE', color: 'border-emerald-500/50 text-emerald-400', tasks: ['Implement WebGL Particle Morph', 'Setup daemon.py hooks'] },
  ];

  return (
    <div className="flex flex-col gap-6 w-full h-full p-6 text-white text-sm bg-black/40 rounded-xl border border-white/5 shadow-2xl backdrop-blur-md overflow-hidden">
      <header className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">KANBAN // WORKFLOW</h2>
          <p className="text-white/60 mt-1">Drag-and-drop interactive task management for parallel swarm execution.</p>
        </div>
        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md transition-all text-white">+ Add Task</button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full overflow-y-auto mt-4 pb-4">
        {columns.map(col => (
          <div key={col.title} className="flex flex-col gap-3 min-w-[250px]">
            <div className={`p-2 border-b-2 font-bold tracking-widest text-xs uppercase ${col.color}`}>
              {col.title} <span className="opacity-50 ml-2">({col.tasks.length})</span>
            </div>
            
            <div className="flex flex-col gap-3 flex-1">
              {col.tasks.map((task, i) => (
                <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all cursor-grab flex flex-col gap-3 group">
                  <p className="text-sm text-white/90 font-medium group-hover:text-white leading-snug">{task}</p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="px-2 py-1 rounded bg-black/50 text-white/50 border border-white/5 font-mono">AGT-{Math.floor(Math.random()*900)+100}</span>
                    <span className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 border border-white/20 shadow-inner" title="Assigned Agent"></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
