'use client';

import { useState, useEffect } from 'react';
import { Eye, Trash2, Search, Terminal, Activity, ShieldCheck, Sparkles } from 'lucide-react';

interface DocumentCard {
  id: string; title: string; description: string; type: string; date: string; path: string;
}

export default function HermesOS() {
  const [docs, setDocs] = useState<DocumentCard[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [selectedDoc, setSelectedDoc] = useState<DocumentCard | null>(null);

  useEffect(() => {
    // Poll the artifacts local directory
    const fetchDocs = () => {
      fetch('/api/documents')
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) setDocs(data);
        });
    };
    fetchDocs();
    const interval = setInterval(fetchDocs, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredDocs = docs.filter(doc => 
    (filter === 'ALL' || doc.type === filter) &&
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex w-full h-[calc(100vh-140px)] gap-6 text-gray-200 font-sans">
      {/* PANTHEON SIDE PANEL (Left) */}
      <aside className="w-80 bg-black/60 rounded-xl border border-white/10 backdrop-blur-md flex flex-col p-4 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
          <Sparkles className="text-cyan-400 animate-pulse" />
          <h1 className="text-xl font-bold tracking-wider text-white">PANTHEON // OS</h1>
        </div>
        
        <div className="space-y-4 flex-1 overflow-y-auto pr-2">
          {/* Active Persona */}
          <div className="p-4 bg-gradient-to-br from-blue-900/40 to-cyan-900/20 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(0,255,255,0.1)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/10 rounded-full blur-xl group-hover:bg-cyan-400/20 transition-all"></div>
            <div className="flex justify-between items-center mb-2">
               <p className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  Active Identity
               </p>
            </div>
            <h3 className="font-bold text-white text-lg font-mono">SOCRATES</h3>
            <p className="text-xs text-gray-400 mt-1">Role: Deep Thinking Philosopher</p>
            <p className="text-[10px] text-cyan-300 mt-3 font-mono bg-black/30 p-2 rounded">Current: Dream Sequence Logic</p>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
            <p className="text-[10px] text-purple-400 font-mono tracking-widest uppercase mb-1">💤 Standby</p>
            <h3 className="font-bold text-gray-300">DA VINCI</h3>
            <p className="text-xs text-gray-500 mt-1">Role: Creative UI/UX Designer</p>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
             <p className="text-[10px] text-orange-400 font-mono tracking-widest uppercase mb-1">💤 Standby</p>
             <h3 className="font-bold text-gray-300">HEPHAESTUS</h3>
             <p className="text-xs text-gray-500 mt-1">Role: Backend Forge Engineer</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONSOLE AREA (Right) */}
      <main className="flex-1 flex flex-col overflow-hidden bg-black/40 rounded-xl border border-white/10 backdrop-blur-md shadow-2xl">
        
        {/* MISSION CONTROL STATS BAR */}
        <section className="p-4 bg-white/5 border-b border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/40 p-4 rounded-xl border border-white/5">
            <div className="flex justify-between items-center text-[10px] tracking-widest uppercase text-gray-400 mb-2">
              <span>AI COMPUTE SPEND</span>
              <Terminal size={14} className="text-amber-500" />
            </div>
            <h2 className="text-2xl font-mono font-bold text-white">$220.45</h2>
          </div>
          <div className="bg-black/40 p-4 rounded-xl border border-white/5">
            <div className="flex justify-between items-center text-[10px] tracking-widest uppercase text-gray-400 mb-2">
              <span>MEMORY COMPRESS</span>
              <ShieldCheck size={14} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-mono font-bold text-emerald-400">86.4%</h2>
          </div>
          <div className="bg-black/40 p-4 rounded-xl border border-white/5">
            <div className="flex justify-between items-center text-[10px] tracking-widest uppercase text-gray-400 mb-2">
              <span>ACTIVE CONNECTIONS</span>
              <Activity size={14} className="text-cyan-500" />
            </div>
            <h2 className="text-2xl font-mono font-bold text-white">4 instances</h2>
          </div>
        </section>

        {/* INTERACTIVE ARTIFACTS / INTELLIGENCE LAYER */}
        <section className="flex-1 p-6 overflow-y-auto flex flex-col relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 tracking-wider">INTELLIGENCE LAYER CABINET</h2>
              <p className="text-xs text-gray-400 mt-1">Live Document Sync from Local Agents</p>
            </div>
            
            {/* UTILITY CONTROLS */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-2.5 text-gray-500" size={14} />
                <input 
                  type="text" placeholder="Search artifacts..." 
                  className="w-full bg-black/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-gray-200 focus:outline-none focus:border-cyan-500 transition-colors"
                  value={search} onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center bg-black/50 border border-white/10 rounded-lg p-1 text-[10px] font-mono">
                {['ALL', 'MD', 'JSON', 'LOG'].map((t) => (
                  <button 
                    key={t} onClick={() => setFilter(t)}
                    className={`px-3 py-1.5 rounded-md transition-all ${filter === t ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-gray-400 hover:text-white'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* DYNAMIC CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-12">
            {filteredDocs.map((doc) => (
              <div key={doc.id} className="bg-black/40 border border-white/10 rounded-xl p-4 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(0,255,255,0.1)] transition-all flex flex-col justify-between group relative overflow-hidden backdrop-blur-md">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-cyan-300 tracking-wider">
                      {doc.type}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">{doc.date}</span>
                  </div>
                  <h3 className="font-bold text-gray-100 text-sm group-hover:text-white transition-colors truncate">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-3 line-clamp-3 leading-relaxed font-mono bg-black/50 p-2 rounded h-16 opacity-80 group-hover:opacity-100 transition-opacity">
                    {doc.description}
                  </p>
                </div>
                
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setSelectedDoc(doc)} className="flex-1 bg-white/5 hover:bg-white/10 text-gray-200 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors">
                    <Eye size={14} /> Preview
                  </button>
                  <button className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 p-2 rounded-lg transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            
            {docs.length === 0 && (
               <div className="col-span-full h-40 flex items-center justify-center border border-dashed border-white/20 rounded-xl">
                  <p className="text-gray-500 text-sm font-mono flex items-center gap-2">
                    <Sparkles size={14} className="animate-spin text-cyan-500/50" /> Waiting for agent artifacts...
                  </p>
               </div>
            )}
          </div>
        </section>
      </main>

      {/* FULL PREVIEW WINDOW OVERLAY */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-6 z-[100]">
          <div className="bg-[#0a0a0f] border border-cyan-500/30 w-full max-w-4xl rounded-2xl flex flex-col max-h-[85vh] shadow-[0_0_50px_rgba(0,255,255,0.1)]">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5 rounded-t-2xl">
              <h2 className="font-bold text-white flex items-center gap-3">
                <span className="text-[10px] font-mono tracking-wider bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 px-2 py-1 rounded">{selectedDoc.type}</span>
                <span className="text-lg">{selectedDoc.title}</span>
              </h2>
              <button onClick={() => setSelectedDoc(null)} className="text-gray-400 hover:text-white hover:bg-white/10 font-mono text-xs px-3 py-1.5 rounded-lg transition-colors">CLOSE (ESC)</button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 font-mono text-sm text-gray-300 bg-black/40 leading-relaxed whitespace-pre-wrap">
              {selectedDoc.description}
              
              <div className="mt-8 pt-8 border-t border-dashed border-white/20 text-gray-500 italic">
                ... [Full Document available in local vault]
              </div>
            </div>
            <div className="p-3 border-t border-white/10 bg-black/60 rounded-b-2xl text-right text-[10px] text-gray-500 font-mono">
              Absolute Path: {selectedDoc.path}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
