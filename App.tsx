import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Appointments from './components/Appointments';
import { SidebarTab } from './types';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SidebarTab>(SidebarTab.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-health-bg min-h-screen text-health-text font-sans selection:bg-emerald-500/30">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-health-sidebar border-b border-white/5 sticky top-0 z-40">
        <div className="flex items-center gap-2">
            <div className="bg-emerald-500/20 p-1.5 rounded-md">
                <div className="w-4 h-4 bg-emerald-500 rounded-sm"></div>
            </div>
            <span className="font-bold text-white">HealthHub</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-white">
            <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/90 z-40 md:hidden pt-20 px-4">
             <nav className="space-y-4">
                {Object.values(SidebarTab).map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => { setActiveTab(tab); setIsMobileMenuOpen(false); }}
                        className={`block w-full text-left py-3 px-4 rounded-lg text-lg ${activeTab === tab ? 'bg-emerald-900/50 text-emerald-400' : 'text-gray-400'}`}
                    >
                        {tab}
                    </button>
                ))}
             </nav>
        </div>
      )}

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="transition-all duration-300">
        {activeTab === SidebarTab.DASHBOARD && <Dashboard onNavigate={setActiveTab} />}
        {activeTab === SidebarTab.REPORTS && <Reports />}
        {activeTab === SidebarTab.SETTINGS && <Settings />}
        {activeTab === SidebarTab.APPOINTMENTS && <Appointments />}
        
        {/* Placeholders for other tabs */}
        {(activeTab === SidebarTab.TRIAGE || activeTab === SidebarTab.PRESCRIPTIONS) && (
            <div className="md:ml-64 p-8 flex flex-col items-center justify-center min-h-screen text-center">
                <div className="bg-health-card p-12 rounded-3xl border border-white/5 max-w-md">
                    <h2 className="text-3xl font-bold text-white mb-4">{activeTab}</h2>
                    <p className="text-health-muted mb-8">This module is currently under development.</p>
                    <button 
                        onClick={() => setActiveTab(SidebarTab.DASHBOARD)}
                        className="px-6 py-3 bg-emerald-500 text-health-bg font-bold rounded-xl hover:bg-emerald-400 transition-colors"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default App;