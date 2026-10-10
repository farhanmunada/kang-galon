'use client';

import { useState } from 'react';
import { updateDeliveryStatus } from '@/actions/deliveryActions';
import StatusBadge from '@/components/StatusBadge';
import { Truck, CheckCircle2, MessageCircle, MapPin, Package, Loader2 } from 'lucide-react';

interface Props {
  delivery: {
    id: string;
    deliveryDate: string;
    bottleCount: number;
    status: string;
    subscription: {
      customer: {
        name: string;
        phone: string;
        address: string;
      };
    };
  };
}

export default function CourierDeliveryCard({ delivery }: Props) {
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(delivery.status);

  const customer = delivery.subscription.customer;

  async function handleStatusChange(target: 'DELIVERING' | 'DELIVERED') {
    setLoading(true);
    const res = await updateDeliveryStatus(delivery.id, target);
    setLoading(false);
    if (res.success && res.status) {
      setCurrentStatus(res.status);
    } else {
      alert(res.error || 'Gagal mengubah status');
    }
  }

  const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone}?text=Halo%20${encodeURIComponent(
    customer.name
  )},%20Depot%20Kang%20Galon%20sedang%20menuju%20ke%20lokasi%20untuk%20mengantar%20${delivery.bottleCount}%20galon.`;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
            {delivery.deliveryDate}
          </span>
          <StatusBadge status={currentStatus} />
        </div>

        <h4 className="font-bold text-slate-900 text-lg">{customer.name}</h4>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md w-fit my-2">
          <Package className="w-3.5 h-3.5" />
          <span>{delivery.bottleCount} Galon</span>
        </div>

        <div className="flex items-start gap-2 text-sm text-slate-600 mt-2">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>{customer.address}</span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 py-2 rounded-lg transition"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Chat WhatsApp</span>
        </a>

        {currentStatus === 'PENDING' && (
          <button
            onClick={() => handleStatusChange('DELIVERING')}
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
            <span>Mulai Antar</span>
          </button>
        )}

        {currentStatus === 'DELIVERING' && (
          <button
            onClick={() => handleStatusChange('DELIVERED')}
            disabled={loading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>Selesai Terkirim</span>
          </button>
        )}

        {currentStatus === 'DELIVERED' && (
          <div className="text-center py-1.5 text-xs font-semibold text-emerald-600 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Pengantaran Sukses</span>
          </div>
        )}
      </div>
    </div>
  );
}
