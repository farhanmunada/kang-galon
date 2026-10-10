import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { logoutAction } from '@/actions/authActions';
import { Droplet, Users, CalendarCheck, Truck, LogOut, ShieldCheck, User } from 'lucide-react';

export default async function Navbar() {
  const session = await getSession();

  return (
    <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-2xs sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={session?.role === 'COURIER' ? '/courier' : '/'} className="flex items-center gap-2 font-bold text-xl text-sky-600">
          <Droplet className="w-6 h-6 fill-sky-600 text-sky-600" />
          <span className="tracking-tight">Kang Galon</span>
        </Link>

        {session ? (
          <div className="flex items-center gap-2 sm:gap-6">
            <nav className="flex items-center gap-1 sm:gap-2 text-sm font-medium text-slate-600">
              {session.role === 'OWNER' && (
                <>
                  <Link
                    href="/"
                    className="px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition"
                  >
                    Dasbor
                  </Link>
                  <Link
                    href="/customers"
                    className="px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition flex items-center gap-1.5"
                  >
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">Pelanggan</span>
                  </Link>
                  <Link
                    href="/subscriptions"
                    className="px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition flex items-center gap-1.5"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span className="hidden sm:inline">Langganan</span>
                  </Link>
                </>
              )}

              <Link
                href="/courier"
                className="px-3 py-2 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 transition flex items-center gap-1.5 font-semibold"
              >
                <Truck className="w-4 h-4" />
                <span>Kurir</span>
              </Link>
            </nav>

            <div className="flex items-center gap-2 pl-2 sm:pl-4 border-l border-slate-200">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-800 leading-tight">{session.name}</span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {session.role === 'OWNER' ? 'Pemilik Depot' : 'Pekerja Kurir'}
                </span>
              </div>

              <span
                className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  session.role === 'OWNER'
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {session.role === 'OWNER' ? (
                  <ShieldCheck className="w-3 h-3" />
                ) : (
                  <User className="w-3 h-3" />
                )}
                {session.role === 'OWNER' ? 'Owner' : 'Kurir'}
              </span>

              <form action={logoutAction}>
                <button
                  type="submit"
                  title="Keluar"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold transition"
          >
            Masuk
          </Link>
        )}
      </div>
    </header>
  );
}
