import { getCustomers } from '@/actions/customerActions';
import CustomerForm from '@/components/CustomerForm';
import { Users, Phone, MapPin, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
  const customerList = await getCustomers();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Manajemen Pelanggan</h1>
        <p className="text-sm text-slate-500 mt-1">
          Daftar pelanggan aktif depot air isi ulang dan formulir pendaftaran.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Form Tambah */}
        <div className="lg:col-span-1">
          <CustomerForm />
        </div>

        {/* Kolom Kanan: Tabel Pelanggan */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-600" />
                Data Pelanggan ({customerList.length})
              </h2>
            </div>

            {customerList.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                Belum ada data pelanggan. Silakan input form di samping.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {customerList.map((customer) => (
                  <div key={customer.id} className="p-5 hover:bg-slate-50 transition space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900 text-base">{customer.name}</h3>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(customer.createdAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-slate-600">
                      <div className="flex items-center gap-1.5 text-sky-700 font-medium">
                        <Phone className="w-4 h-4" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 truncate">
                        <MapPin className="w-4 h-4 shrink-0 text-slate-400" />
                        <span className="truncate">{customer.address}</span>
                      </div>
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
