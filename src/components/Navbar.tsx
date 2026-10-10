import Link from 'next/link';
import { Droplet, Users, CalendarCheck, Truck } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="border-b bg-white shadow-xs sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-sky-600">
          <Droplet className="w-6 h-6 fill-sky-600 text-sky-600" />
          <span>Kang Galon</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-4 text-sm font-medium text-slate-600">
          <Link
            href="/"
            className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition flex items-center gap-1.5"
          >
            Dasbor
          </Link>
          <Link
            href="/customers"
            className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Pelanggan</span>
          </Link>
          <Link
            href="/subscriptions"
            className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition flex items-center gap-1.5"
          >
            <CalendarCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Langganan</span>
          </Link>
          <Link
            href="/courier"
            className="px-3 py-2 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 transition flex items-center gap-1.5 font-semibold"
          >
            <Truck className="w-4 h-4" />
            <span>Kurir</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
