import './globals.css';
import ParticleMorphDashboard from '../components/ParticleMorph';
import Navigation from '../components/Navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative bg-black text-white min-h-screen font-sans antialiased selection:bg-cyan-500/30">
        {/* Background WebGL (z-0) */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <ParticleMorphDashboard isDreaming={false} />
        </div>
        
        {/* Foreground UI Overlay (z-10) */}
        <div className="relative z-10 min-h-screen bg-transparent p-6 xl:p-12 flex flex-col pointer-events-auto">
          <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              PRIME AGENTIC OS
            </h1>
            <Navigation />
          </header>
          
          <main className="flex-1 h-full w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
