import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="flex gap-4 mb-8 p-1 bg-black/50 border border-white/10 rounded-xl w-max backdrop-blur-xl">
      <Link href="/" className="px-6 py-2 rounded-lg hover:bg-white/10 text-sm font-semibold tracking-wider text-white transition-colors">DASHBOARD</Link>
      <Link href="/conductor" className="px-6 py-2 rounded-lg hover:bg-white/10 text-sm font-semibold tracking-wider text-white transition-colors">CONDUCTOR</Link>
      <Link href="/operations" className="px-6 py-2 rounded-lg hover:bg-white/10 text-sm font-semibold tracking-wider text-white transition-colors">OPERATIONS</Link>
    </nav>
  );
}
