'use client';

import { useState } from 'react';
import { createCustomer } from '@/actions/customerActions';
import { PlusCircle, Loader2 } from 'lucide-react';

export default function CustomerForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await createCustomer(formData);

    setLoading(false);
    if (result.success) {
      setMessage({ type: 'success', text: 'Pelanggan berhasil ditambahkan!' });
      (e.target as HTMLFormElement).reset();
    } else {
      setMessage({ type: 'error', text: result.error || 'Terjadi kesalahan' });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
      <h3 className="font-semibold text-slate-800 text-lg flex items-center gap-2">
        <PlusCircle className="w-5 h-5 text-sky-600" />
        Tambah Pelanggan Baru
      </h3>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
          Nama Lengkap
        </label>
        <input
          name="name"
          type="text"
          required
          placeholder="Contoh: Pak RT Bambang"
          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
          Nomor HP / WhatsApp
        </label>
        <input
          name="phone"
          type="tel"
          required
          placeholder="Contoh: 081234567890"
          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
          Alamat Lengkap
        </label>
        <textarea
          name="address"
          rows={3}
          required
          placeholder="Contoh: Jl. Mawar No. 12, RT 02/03, Dekat Masjid"
          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        <span>Simpan Pelanggan</span>
      </button>
    </form>
  );
}
