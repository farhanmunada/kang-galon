import './globals.css';
import Navbar from '@/components/Navbar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kang Galon - Sistem Manajemen & Distribusi Depot Air',
  description: 'Aplikasi manajemen langganan dan tracking pengantaran galon berbasis Next.js dan Neon Database',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">{children}</main>
        <footer className="border-t bg-white py-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Kang Galon Depot Management System. Dibangun dengan Next.js & Neon Serverless.
        </footer>
      </body>
    </html>
  );
}
