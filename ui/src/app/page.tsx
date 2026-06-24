'use client';

import { useState, useEffect } from 'react';
import { Eye, Trash2, Search, Terminal, Activity, ShieldCheck, Sparkles, Globe, BrainCircuit } from 'lucide-react';
import dynamic from 'next/dynamic';

const MemoryGraph = dynamic(() => import('../components/MemoryGraph'), { ssr: false });

interface DocumentCard {
  id: string; title: string; description: string; type: string; date: string; path: string;
}

export default function HermesOS() {
  const [docs, setDocs] = useState<DocumentCard[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [selectedDoc, setSelectedDoc] = useState<DocumentCard | null>(null);

  useEffect(() => {
    fetch('/api/documents').then(res => res.json()).then(data => {
      if (Array.isArray(data)) setDocs(data);
    });
  }, []);

  const filteredDocs = docs.filter(doc => 
    (filter === 'ALL' || doc.type === filter) &&
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full w-full bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl text-gray-200 font-sans z-10 relative">
      
      {/* PANTHEON SIDE PANEL (Left) */}
      <aside className="w-80 bg-black/60 border-r border-white/10 flex flex-col p-4 backdrop-blur-md">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
          <Sparkles className="text-cyan-400 animate-pulse" />
          <h1 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">PANTHEON OS</h1>
        </div>
        
        <div className="space-y-4 flex-1 overflow-y-auto pr-2">
          {/* Da Vinci Persona */}
          <div className="p-4 bg-gradient-to-br from-indigo-900/40 to-blue-900/20 rounded-xl border border-indigo-500/30 group hover:border-indigo-400/50 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl"></div>
            <p className="text-[10px] text-indigo-400 font-mono tracking-widest flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span> AGENT ACTIVE</p>
            <h3 className="font-bold text-white mt-1 text-lg">Da Vinci</h3>
            <p className="text-xs text-indigo-200/70 mt-1">Creative Frontend & UI Artist</p>
            <div className="mt-3 text-[10px] font-mono bg-black/40 p-2 rounded border border-white/5 text-gray-400">Task: Tailwind Masonry Comp</div>
          </div>

          {/* Socrates Persona */}
          <div className="p-4 bg-gradient-to-br from-amber-900/40 to-orange-900/20 rounded-xl border border-amber-500/30 group hover:border-amber-400/50 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-xl"></div>
            <p className="text-[10px] text-amber-400 font-mono tracking-widest">🧠 DEEP THINKER</p>
            <h3 className="font-bold text-white mt-1 text-lg">Socrates</h3>
            <p className="text-xs text-amber-200/70 mt-1">Logic, Philosophy & Architecture</p>
            <div className="mt-3 text-[10px] font-mono bg-black/40 p-2 rounded border border-white/5 text-gray-400">Task: Routing Auth Flow Logic</div>
          </div>
          
          {/* Dream Sequence Widget */}
          <div className="p-4 bg-gradient-to-br from-purple-900/20 to-fuchsia-900/20 rounded-xl border border-purple-500/20 opacity-80 backdrop-blur-md mt-8">
            <p className="text-[10px] text-purple-400 font-mono tracking-widest">🌙 CRON SCHEDULED</p>
            <h3 className="font-bold text-gray-200 mt-1">Dream Sequence</h3>
            <p className="text-xs text-gray-400 mt-1">Runs daily at 02:00 AM</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONSOLE AREA (Right) */}
      <main className="flex-1 flex flex-col overflow-hidden bg-transparent">
        
        {/* MISSION CONTROL STATS BAR */}
        <section className="p-6 bg-black/40 border-b border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 backdrop-blur-sm">
          <div className="bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-xl border border-white/10 shadow-lg">
            <div className="flex justify-between items-center text-xs text-gray-400 mb-1 font-mono tracking-wider">
              <span>AI COMPUTE SPEND</span>
              <Terminal size={14} className="text-amber-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-white mt-2">$220.45</h2>
          </div>
          <div className="bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-xl border border-white/10 shadow-lg">
            <div className="flex justify-between items-center text-xs text-gray-400 mb-1 font-mono tracking-wider">
              <span>TOKENS CONSERVED</span>
              <ShieldCheck size={14} className="text-emerald-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-emerald-400 mt-2">86.4%</h2>
          </div>
          <div className="bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-xl border border-white/10 shadow-lg">
            <div className="flex justify-between items-center text-xs text-gray-400 mb-1 font-mono tracking-wider">
              <span>SYSTEM WORKSPACES</span>
              <Activity size={14} className="text-cyan-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-white mt-2">4 instances</h2>
          </div>
        </section>

        {/* MIDDLE SCROLLABLE CONTENT */}
        <section className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
          
          {/* TOP ROW: GRAPH & HERMES WORLD */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[300px] shrink-0">
             {/* Obsidian Memory Graph */}
             <div className="flex flex-col bg-black/50 border border-white/10 rounded-xl overflow-hidden shadow-xl relative">
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                   <BrainCircuit className="text-purple-400" size={16} />
                   <h3 className="text-xs font-bold tracking-widest text-gray-300">OBSIDIAN SECOND BRAIN</h3>
                </div>
                <MemoryGraph />
             </div>
             
             {/* Hermes World Iframe */}
             <div className="flex flex-col bg-black/50 border border-white/10 rounded-xl overflow-hidden shadow-xl relative group">
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur">
                   <Globe className="text-blue-400" size={16} />
                   <h3 className="text-xs font-bold tracking-widest text-gray-300">HERMES WORLD INTEGRATION</h3>
                </div>
                <iframe src="https://hermes-world.ai/play/?embed=dashboard" className="w-full h-full border-none opacity-80 group-hover:opacity-100 transition-opacity" title="Hermes World" />
             </div>
          </div>

          <hr className="border-white/5 my-2" />

          {/* INTERACTIVE ARTIFACTS / INTELLIGENCE LAYER */}
          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-lg font-bold text-white tracking-wide">Intelligence Layer Cabinet</h2>
              
              {/* UTILITY CONTROLS */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
                  <input 
                    type="text" placeholder="Search code artifacts..." 
                    className="w-full bg-black/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyan-500 transition-colors"
                    value={search} onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex items-center bg-black/50 border border-white/10 rounded-lg p-1 text-xs font-mono">
                  {['ALL', 'MD', 'JSON', 'TS', 'HTML'].map((type) => (
                    <button 
                      key={type} onClick={() => setFilter(type)}
                      className={`px-3 py-1.5 rounded-md transition-all ${filter === type ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-gray-400 hover:text-white'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* DYNAMIC CARDS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDocs.map((doc) => (
                <div key={doc.id} className="bg-black/40 border border-white/10 rounded-xl p-4 hover:border-cyan-500/30 hover:bg-white/5 transition-all flex flex-col justify-between group relative overflow-hidden backdrop-blur-md shadow-lg">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-500/20 text-cyan-400 tracking-wider">
                        {doc.type}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">{doc.date}</span>
                    </div>
                    <h3 className="font-bold text-gray-200 text-sm group-hover:text-white transition-colors line-clamp-1 mt-2">
                      {doc.title}
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-2 line-clamp-3 leading-relaxed font-mono bg-black/30 p-2 rounded border border-white/5 text-ellipsis break-words">
                      {doc.description}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 mt-4 pt-3 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setSelectedDoc(doc)} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
                      <Eye size={12} /> Preview
                    </button>
                    <button className="bg-red-950/20 hover:bg-red-900/40 border border-red-900/30 text-red-400 p-1.5 rounded-lg transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
              
              {filteredDocs.length === 0 && (
                 <div className="col-span-full py-12 flex items-center justify-center text-white/30 font-mono text-sm border border-dashed border-white/10 rounded-xl bg-black/20">
                    No artifacts found in the intelligence cabinet.
                 </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* FULL PREVIEW WINDOW OVERLAY */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 z-50">
          <div className="bg-[#12161b] border border-white/10 w-full max-w-3xl rounded-2xl flex flex-col max-h-[80vh] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="font-bold text-white flex items-center gap-3">
                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-cyan-950 border border-cyan-500/20 text-cyan-400 tracking-wider">
                  {selectedDoc.type}
                </span>
                {selectedDoc.title}
              </h2>
              <button onClick={() => setSelectedDoc(null)} className="text-gray-400 hover:text-white font-mono text-xs px-3 py-1.5 bg-black/50 border border-white/10 hover:bg-white/10 rounded-lg transition-colors">ESC</button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-gray-300 bg-black/40 leading-relaxed whitespace-pre-wrap break-words">
              {selectedDoc.description}... {"\n\n"}[Full Output Asset Available inside local system folder "{selectedDoc.path}"]
            </div>
            <div className="p-4 border-t border-white/10 bg-black/60 text-right text-[10px] text-gray-500 font-mono rounded-b-2xl">
              System Path: {selectedDoc.path}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
