import React from 'react';
import { ShoppingBag, Package, Wallet, Users, Settings, MessageSquare } from 'lucide-react';

/* AdminNav: Bottom navigation tabs.
   Props:
     activeTab
     setActiveTab
*/
const tabs = [
  { id: 'pos', label: 'Kasir', icon: ShoppingBag },
  { id: 'waorders', label: 'Pesanan WA', icon: MessageSquare },
  { id: 'products', label: 'Stok', icon: Package },
  { id: 'bundles', label: 'Paket', icon: Package },
  { id: 'cashflow', label: 'Keuangan', icon: Wallet },
  { id: 'debts', label: 'Piutang', icon: Users },
  { id: 'settings', label: 'Pengaturan', icon: Settings }
];

export function AdminNav({ activeTab, setActiveTab }) {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur border-t border-gray-200 z-30 no-print flex justify-center py-1" role="navigation" aria-label="Navigasi dashboard">
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl flex justify-between gap-1 md:gap-2 px-2 md:px-4 pb-safe">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 md:py-4 flex flex-col items-center gap-1 rounded-md md:rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-black ${active ? 'text-black bg-gray-100' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={18} className="md:hidden" strokeWidth={active ? 2.5 : 1.5} />
              <Icon size={20} className="hidden md:block" strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
