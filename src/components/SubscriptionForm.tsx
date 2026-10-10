'use client';

import { useState } from 'react';
import { createSubscription } from '@/actions/subscriptionActions';
import { CalendarPlus, Loader2 } from 'lucide-react';

interface Props {
  customers: Array<{ id: string; name: string; phone: string }>;
}

export default function SubscriptionForm({ customers }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await createSubscription(formData);

    setLoading(false);
    if (result.success) {
      setMessage({
        type: 'success',
        text: `Langganan dibuat! Jadwal terbentuk: ${result.generatedDates?.join(', ')}`,
      });
      (e.target as HTMLFormElement).reset();
    } else {
      setMessage({ type: 'error', text: result.error || 'Terjadi kesalahan' });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
      <h3 className="font-semibold text-slate-800 text-lg flex items-center gap-2">
        <CalendarPlus className="w-5 h-5 text-sky-600" />
        Buat Paket Langganan Baru
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
          Pilih Pelanggan
        </label>
        <select
          name="customerId"
          required
          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
        >
          <option value="">-- Pilih Pelanggan --</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.phone})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Galon per Antar
          </label>
          <input
            name="bottlesPerDelivery"
            type="number"
            min="1"
            defaultValue="2"
            required
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Selang Hari (Interval)
          </label>
          <input
            name="intervalDays"
            type="number"
            min="1"
            defaultValue="3"
            required
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Mulai Dari Tanggal
          </label>
          <input
            name="startDate"
            type="date"
            defaultValue={todayStr}
            required
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Jumlah Siklus Awal
          </label>
          <input
            name="batchCount"
            type="number"
            min="1"
            max="12"
            defaultValue="4"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || customers.length === 0}
        className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        <span>Buat & Otomasi Jadwal</span>
      </button>
    </form>
  );
}
