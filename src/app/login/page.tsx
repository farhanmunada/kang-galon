import LoginForm from '@/components/LoginForm';
import { Droplet } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Sistem Manajemen Kang Galon',
  description: 'Portal autentikasi pemilik dan pekerja depot air minum',
};

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/80 shadow-lg p-8 sm:p-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-sky-100 rounded-2xl text-sky-600 mb-2">
            <Droplet className="w-8 h-8 fill-sky-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Kang Galon Portal</h2>
          <p className="text-sm text-slate-500">
            Masuk untuk mengakses dasbor operasional dan distribusi galon
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
