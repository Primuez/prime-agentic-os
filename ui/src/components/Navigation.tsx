'use client';
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="flex flex-wrap gap-2 p-1 bg-black/50 border border-white/10 rounded-xl w-max backdrop-blur-xl">
      <Link href="/" className="px-4 xl:px-6 py-2 rounded-lg hover:bg-white/10 text-xs xl:text-sm font-semibold tracking-wider text-white transition-colors">DASHBOARD</Link>
      <Link href="/conductor" className="px-4 xl:px-6 py-2 rounded-lg hover:bg-white/10 text-xs xl:text-sm font-semibold tracking-wider text-white transition-colors">CONDUCTOR</Link>
      <Link href="/kanban" className="px-4 xl:px-6 py-2 rounded-lg hover:bg-white/10 text-xs xl:text-sm font-semibold tracking-wider text-white transition-colors">KANBAN</Link>
      <Link href="/operations" className="px-4 xl:px-6 py-2 rounded-lg hover:bg-white/10 text-xs xl:text-sm font-semibold tracking-wider text-white transition-colors">SWARM</Link>
      <Link href="/sessions" className="px-6 py-2 rounded-lg hover:bg-white/10 text-sm font-semibold tracking-wider text-white transition-colors">SESSIONS</Link>
      <Link href="/profiles" className="px-4 xl:px-6 py-2 rounded-lg hover:bg-white/10 text-xs xl:text-sm font-semibold tracking-wider text-white transition-colors">PROFILES</Link>
      <Link href="/sessions" className="px-6 py-2 rounded-lg hover:bg-white/10 text-sm font-semibold tracking-wider text-white transition-colors">SESSIONS</Link>
    </nav>
  );
}
