'use client';

import React, { useState } from 'react';
import { MessageSquare, Search, Send, Clock, Sparkles, Code, TerminalSquare } from 'lucide-react';

export default function SessionsPage() {
  const [activeSession, setActiveSession] = useState(1);

  const sessionsList = [
    { id: 1, title: 'WebGL Shader Optimization', persona: 'Da Vinci', time: '10 mins ago', active: true },
    { id: 2, title: 'Database Schema Design', persona: 'Socrates', time: '2 hours ago', active: false },
    { id: 3, title: 'Nightly Dream Sequence', persona: 'Orchestrator', time: '8 hours ago', active: false },
    { id: 4, title: 'Swarm Execution: Blog Post', persona: 'Conductor', time: 'Yesterday', active: false }
  ];

  const chatHistory = [
    { role: 'user', content: 'We need to optimize the ParticleMorph shader. The framerate drops when we push it to 10k particles.', time: '10:41 AM' },
    { role: 'agent', persona: 'Da Vinci', content: 'I observe the canvas. The issue lies within the `useFrame` CPU-side calculation. By moving the sine and cosine transformations directly into a custom WebGL Vertex Shader (GLSL), we can offload the computation to the GPU.\n\nLet me write the BufferGeometry implementation for you.', time: '10:42 AM', isCode: true },
    { role: 'user', content: 'Perfect. Execute that and apply it to the main layout.', time: '10:45 AM' },
    { role: 'agent', persona: 'Da Vinci', content: 'Artifact generated. I have successfully applied the GLSL modifications. Framerate is locked at 60fps for 50k particles.', time: '10:45 AM' }
  ];

  return (
    <div className="flex gap-6 w-full h-[calc(100vh-140px)] text-white text-sm bg-black/40 rounded-xl border border-white/5 shadow-2xl backdrop-blur-md overflow-hidden relative">
      
      {/* Sessions Sidebar (Left) */}
      <aside className="w-80 flex flex-col border-r border-white/10 bg-black/20">
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="text-lg font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center gap-2">
            <MessageSquare size={18} className="text-cyan-400" />
            SESSIONS
          </h2>
        </div>
        
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={14} />
            <input 
              type="text" placeholder="Search transcripts..." 
              className="w-full bg-black/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-gray-200 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-2">
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-500 px-3 mt-2 mb-3">Recent Memory</h3>
          
          {sessionsList.map(session => (
            <div 
              key={session.id} 
              onClick={() => setActiveSession(session.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 group ${activeSession === session.id ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'}`}
            >
              <div className="flex justify-between items-start">
                <h4 className={`font-semibold text-sm line-clamp-1 group-hover:text-cyan-300 transition-colors ${activeSession === session.id ? 'text-cyan-400' : 'text-gray-300'}`}>
                  {session.title}
                </h4>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className={`px-2 py-0.5 rounded border ${activeSession === session.id ? 'bg-cyan-950/50 border-cyan-500/50 text-cyan-300' : 'bg-black/50 border-white/10 text-gray-500'}`}>
                  {session.persona}
                </span>
                <span className="text-gray-600 flex items-center gap-1"><Clock size={10} /> {session.time}</span>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Interface (Right) */}
      <main className="flex-1 flex flex-col bg-transparent relative">
        {/* Chat Header */}
        <header className="p-5 border-b border-white/10 bg-white/5 flex justify-between items-center shrink-0 backdrop-blur-md">
          <div className="flex flex-col">
             <div className="flex items-center gap-3">
                <h3 className="font-bold text-lg text-white tracking-wide">WebGL Shader Optimization</h3>
                <span className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-mono rounded animate-pulse">
                  DA VINCI ACTIVE
                </span>
             </div>
             <span className="text-xs text-gray-500 font-mono mt-1">ID: sess_982b1c4a • Tokens: 1,402</span>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-black/50 border border-white/10 rounded-lg hover:bg-white/10 text-gray-400 transition-colors tooltip" aria-label="Terminal View"><TerminalSquare size={16} /></button>
            <button className="p-2 bg-black/50 border border-white/10 rounded-lg hover:bg-white/10 text-gray-400 transition-colors"><Code size={16} /></button>
          </div>
        </header>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl p-4 relative group ${msg.role === 'user' ? 'bg-gradient-to-br from-cyan-900/60 to-blue-900/40 border border-cyan-500/20 rounded-tr-sm' : 'bg-black/60 border border-white/10 rounded-tl-sm backdrop-blur-md'}`}>
                
                {msg.role === 'agent' && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
                    <Sparkles size={12} className="text-indigo-400" />
                    <span className="text-[10px] font-mono text-indigo-300 font-bold uppercase tracking-wider">{msg.persona}</span>
                  </div>
                )}
                
                <p className="text-sm leading-relaxed text-gray-200 whitespace-pre-wrap">{msg.content}</p>
                
                <span className={`text-[9px] absolute ${msg.role === 'user' ? '-left-12' : '-right-12'} top-4 text-gray-600 font-mono opacity-0 group-hover:opacity-100 transition-opacity`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-black/40 border-t border-white/10 backdrop-blur-xl shrink-0">
          <div className="relative flex items-center bg-black/60 border border-white/10 rounded-xl overflow-hidden focus-within:border-cyan-500/50 transition-colors p-1">
            <span className="pl-3 text-cyan-500 pointer-events-none text-xl font-light">/</span>
            <input 
              type="text" 
              placeholder="Ask Da Vinci, trigger a tool, or drop a file..." 
              className="w-full bg-transparent p-3 text-sm text-white placeholder-gray-600 outline-none"
            />
            <button className="mx-2 p-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg text-white shadow-[0_0_10px_rgba(0,255,255,0.2)] transition-all">
              <Send size={16} />
            </button>
          </div>
          <div className="flex justify-between items-center mt-2 px-2 text-[10px] text-gray-500 font-mono">
            <span>Use @ to summon a specific persona, or # to search memory.</span>
            <span>Shift + Enter for newline</span>
          </div>
        </div>
      </main>
    </div>
  );
}
