import React from 'react';
import { ShieldAlert, Hospital, Flame, Shield, Activity, HeartPulse, PhoneCall, ChevronRight } from 'lucide-react';
import { emergencyContacts } from '../data/initialData';
import { TabType } from '../types';

interface Props {
  onNavigate?: (tab: TabType) => void;
}

export const EmergencyBar: React.FC<Props> = ({ onNavigate }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldAlert':
        return <ShieldAlert className="w-4 h-4 text-red-500" />;
      case 'Hospital':
        return <Hospital className="w-4 h-4 text-emerald-600" />;
      case 'Flame':
        return <Flame className="w-4 h-4 text-orange-500" />;
      case 'Shield':
        return <Shield className="w-4 h-4 text-blue-600" />;
      case 'Activity':
        return <Activity className="w-4 h-4 text-purple-600" />;
      case 'HeartPulse':
        return <HeartPulse className="w-4 h-4 text-rose-600" />;
      default:
        return <PhoneCall className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div id="emergency-hotlines-bar" className="bg-red-50/80 dark:bg-red-950/30 border-y border-red-200/80 dark:border-red-900/50 py-2 px-3 sm:px-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 shrink-0 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded shadow-xs">
            <ShieldAlert className="w-3.5 h-3.5 animate-bounce" />
            <span>জরুরি হটলাইন</span>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('helplines')}
              className="text-[11px] font-bold text-red-700 dark:text-red-300 hover:underline flex items-center gap-0.5 cursor-pointer shrink-0"
            >
              <span>সকল হেল্পলাইন</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {emergencyContacts.map((contact, idx) => (
            <a
              key={idx}
              id={`emergency-contact-${idx}`}
              href={`tel:${contact.number.replace(/[^0-9]/g, '')}`}
              className="flex items-center gap-2 bg-white dark:bg-slate-850 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-red-100 dark:border-red-900/40 shadow-2xs hover:border-red-300 dark:hover:border-red-700 hover:shadow-xs transition text-xs group"
              title={`${contact.title} - ${contact.subtitle}`}
            >
              {getIcon(contact.iconName)}
              <div className="flex flex-col text-left">
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] group-hover:text-red-700 dark:group-hover:text-red-400 whitespace-nowrap">
                  {contact.title}
                </span>
                <span className="font-mono font-bold text-red-600 dark:text-red-400 text-[11px]">
                  {contact.number}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
