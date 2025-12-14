import React from 'react';
import { LayoutDashboard, FileText, Calendar, Activity, Pill, Settings, LogOut, PlusSquare } from 'lucide-react';
import { SidebarTab } from '../types';

interface SidebarProps {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: SidebarTab.DASHBOARD },
    { icon: FileText, label: SidebarTab.REPORTS },
    { icon: Calendar, label: SidebarTab.APPOINTMENTS },
    { icon: Activity, label: SidebarTab.TRIAGE },
    { icon: Pill, label: SidebarTab.PRESCRIPTIONS },
  ];

  return (
    <aside className="w-64 bg-health-sidebar border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 hidden md:flex z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-emerald-500/20 p-2 rounded-lg">
          <PlusSquare className="w-6 h-6 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-none">HealthHub</h1>
          <span className="text-xs text-health-muted">Patient Portal</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = activeTab === item.label;
          return (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-[#132A23] text-emerald-400 font-medium' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-2">
        <button 
          onClick={() => setActiveTab(SidebarTab.SETTINGS)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
             activeTab === SidebarTab.SETTINGS ? 'bg-[#132A23] text-emerald-400' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
        
        <div className="mt-4 flex items-center gap-3 px-4 py-3 border border-white/10 rounded-xl bg-white/5">
          <img 
            src="https://picsum.photos/id/64/100/100" 
            alt="User" 
            className="w-10 h-10 rounded-full border-2 border-emerald-500/30"
          />
          <div className="flex-1 overflow-hidden">
            <h4 className="text-sm font-medium text-white truncate">Sarah Jenkins</h4>
            <p className="text-xs text-emerald-500">Premium Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;