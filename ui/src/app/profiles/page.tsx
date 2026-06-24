import React from 'react';

export default function ProfilesPage() {
  const personas = [
    { name: 'ATHENA', role: 'Architect & Strategist', model: 'claude-3-7-sonnet', temp: '0.2', desc: 'Focuses on deep architectural planning and generating structural blueprints before execution.' },
    { name: 'MERCURY', role: 'Fast Executor', model: 'gemini-3.1-pro-high', temp: '0.7', desc: 'Used for extremely fast, parallelized code generation and API connection work.' },
    { name: 'HEPHAESTUS', role: 'Frontend Builder', model: 'agy-cli-default', temp: '0.4', desc: 'Specialized in taking Tailwind and CSS mockups and turning them into production components.' },
    { name: 'ARGUS', role: 'QA & Reviewer', model: 'hermes-agent-default', temp: '0.1', desc: 'Evaluates code changes, reviews PRs, and performs security sanity checks on orchestrator logs.' }
  ];

  return (
    <div className="flex flex-col gap-6 w-full h-full p-6 text-white text-sm bg-black/40 rounded-xl border border-white/5 shadow-2xl backdrop-blur-md overflow-y-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">PANTHEON // PROFILES</h2>
          <p className="text-white/60 mt-1">Manage system prompts, allowed tools, and engine routing for your agent personas.</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-500 hover:to-yellow-500 rounded-md font-semibold tracking-wide transition-all shadow-lg text-white">+ Create Persona</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
        {personas.map(persona => (
          <div key={persona.name} className="flex flex-col p-5 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold tracking-wider text-orange-300">{persona.name}</h3>
                <span className="text-xs text-white/50">{persona.role}</span>
              </div>
              <div className="px-2 py-1 bg-black/40 border border-white/10 rounded text-[10px] uppercase font-mono text-white/40">v2.1</div>
            </div>

            <p className="text-white/70 text-sm flex-1 mb-6 leading-relaxed">{persona.desc}</p>

            <div className="flex flex-col gap-2 p-3 bg-black/40 rounded-xl border border-white/5 text-xs text-white/60 font-mono">
              <div className="flex justify-between"><span className="text-white/40">Model:</span> <span className="text-cyan-200">{persona.model}</span></div>
              <div className="flex justify-between"><span className="text-white/40">Temp:</span> <span>{persona.temp}</span></div>
              <div className="flex justify-between"><span className="text-white/40">Max Tokens:</span> <span>8192</span></div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button className="flex-1 py-2 text-xs border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-white">Edit Prompt</button>
              <button className="flex-1 py-2 text-xs bg-white/10 border border-white/10 rounded-lg hover:bg-white/20 transition-colors text-white">Activate</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
