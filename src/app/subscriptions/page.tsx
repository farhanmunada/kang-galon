import { getCustomers } from '@/actions/customerActions';
import { getSubscriptions } from '@/actions/subscriptionActions';
import SubscriptionForm from '@/components/SubscriptionForm';
import StatusBadge from '@/components/StatusBadge';
import { CalendarCheck, Package, RefreshCw } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SubscriptionsPage() {
  const [customers, subscriptionsList] = await Promise.all([getCustomers(), getSubscriptions()]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Paket Langganan Galon</h1>
        <p className="text-sm text-slate-500 mt-1">
          Atur kontrak pengantaran rutin otomatis untuk pelanggan setia.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <SubscriptionForm customers={customers} />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-sky-600" />
                Daftar Paket Langganan ({subscriptionsList.length})
              </h2>
            </div>

            {subscriptionsList.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                Belum ada paket langganan aktif.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {subscriptionsList.map((sub) => (
                  <div key={sub.id} className="p-5 hover:bg-slate-50 transition space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900 text-base">{sub.customer.name}</h3>
                        <p className="text-xs text-slate-500">{sub.customer.phone}</p>
                      </div>
                      <StatusBadge status={sub.status} />
                    </div>

                    <div className="flex items-center gap-4 text-xs font-medium text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-1.5 text-sky-700">
                        <Package className="w-4 h-4" />
                        <span>{sub.bottlesPerDelivery} Galon / Antar</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Tiap {sub.intervalDays} Hari Sekali</span>
                      </div>
                      <div className="text-slate-400">Mulai: {sub.startDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
