'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Pickaxe, Settings2, Plus } from 'lucide-react';

interface Persona {
  name: string;
  role: string;
  model: string;
  temp: string;
  desc: string;
  skills: string[];
}

export default function ProfilesPage() {
  const [personas, setPersonas] = useState<Persona[]>([
    { name: 'ATHENA', role: 'Architect & Strategist', model: 'claude-3-7-sonnet', temp: '0.2', desc: 'Focuses on deep architectural planning and generating structural blueprints before execution.', skills: ['project-docs', 'system-design', 'repo-analyzer'] },
    { name: 'MERCURY', role: 'Fast Executor', model: 'gemini-3.1-pro-high', temp: '0.7', desc: 'Used for extremely fast, parallelized code generation and API connection work.', skills: ['npm-automation', 'github-gist', 'fast-coder'] }
  ]);
  
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-group local skills into Personas
  const handleAutoGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/personas/generate', { method: 'POST' });
      const data = await res.json();
      if (data.personas) {
        setPersonas(data.personas);
      }
    } catch (err) {
      console.error("Failed to generate personas", err);
    }
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full p-6 text-white text-sm bg-black/40 rounded-xl border border-white/5 shadow-2xl backdrop-blur-md overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">PANTHEON // DYANMIC PROFILES</h2>
          <p className="text-white/60 mt-1 max-w-2xl">
            Personas are intelligent clusters of your local skills. Group skills manually to build specialized agents, or let the OS automatically map your device's capabilities and forge the perfect expert council.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-black/50 border border-white/10 hover:bg-white/10 rounded-md font-semibold tracking-wide transition-all text-white flex items-center gap-2">
            <Plus size={16} /> Custom Build
          </button>
          <button 
            onClick={handleAutoGenerate}
            disabled={isGenerating}
            className={`px-4 py-2 bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-500 hover:to-yellow-500 rounded-md font-semibold tracking-wide transition-all shadow-lg text-white flex items-center gap-2 ${isGenerating ? 'opacity-50 cursor-wait' : ''}`}
          >
            <Sparkles size={16} className={isGenerating ? "animate-spin" : ""} />
            {isGenerating ? 'Mapping Local Skills...' : 'Auto-Group Skills into Personas'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
        {personas.map((persona, idx) => (
          <div key={idx} className="flex flex-col p-5 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold tracking-wider text-orange-300">{persona.name}</h3>
                <span className="text-xs text-white/50">{persona.role}</span>
              </div>
              <Settings2 size={16} className="text-white/30 hover:text-white/80 cursor-pointer" />
            </div>

            <p className="text-white/70 text-sm flex-1 mb-4 leading-relaxed">{persona.desc}</p>

            <div className="mb-4">
              <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Loaded Skills ({persona.skills.length})</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {persona.skills.map((skill, sIdx) => (
                  <span key={sIdx} className="px-2 py-1 bg-black/60 border border-white/10 rounded text-xs text-cyan-200 flex items-center gap-1">
                    <Pickaxe size={10} /> {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 p-3 bg-black/40 rounded-xl border border-white/5 text-xs text-white/60 font-mono">
              <div className="flex justify-between"><span className="text-white/40">Model:</span> <span className="text-cyan-200">{persona.model}</span></div>
              <div className="flex justify-between"><span className="text-white/40">Temperature:</span> <span>{persona.temp}</span></div>
            </div>
          </div>
        ))}
        
        {/* 'Create New' Card */}
        <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/5 border border-dashed border-white/20 hover:border-white/50 hover:bg-white/10 transition-all cursor-pointer min-h-[300px] text-white/40 hover:text-white/80">
           <Plus size={32} className="mb-2" />
           <span className="font-semibold tracking-wider">GROUP NEW SKILLS</span>
        </div>
      </div>
    </div>
  );
}
