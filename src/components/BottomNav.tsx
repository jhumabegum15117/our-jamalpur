import React from 'react';
import { Home, ShoppingBag, Newspaper, Layers, User, Plus } from 'lucide-react';
import { TabType } from '../types';

interface Props {
  activeTab: TabType;
  onNavigate: (tab: TabType) => void;
}

export const BottomNav: React.FC<Props> = ({ activeTab, onNavigate }) => {
  const items = [
    { id: 'home', label: 'হোম', icon: Home },
    { id: 'marketplace', label: 'মার্কেট', icon: ShoppingBag },
    { id: 'sell', label: 'পোস্ট', icon: Plus, isSpecial: true },
    { id: 'news', label: 'খবর', icon: Newspaper },
    { id: 'profile', label: 'প্রোফাইল', icon: User },
  ];

  return (
    <div id="mobile-bottom-navbar" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-2xl py-1 px-2 transition-colors duration-200">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                id={`bottom-nav-${item.id}`}
                onClick={() => onNavigate(item.id as TabType)}
                className="flex flex-col items-center justify-center -mt-5 bg-gradient-to-tr from-emerald-600 to-teal-600 text-white w-12 h-12 rounded-full shadow-lg shadow-emerald-600/30 border-4 border-white dark:border-slate-900 cursor-pointer active:scale-95 transition"
              >
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => onNavigate(item.id as TabType)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg cursor-pointer transition ${
                isActive
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
