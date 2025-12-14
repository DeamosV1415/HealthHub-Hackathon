import React, { useState } from 'react';
import { Bell, EyeOff, MoreVertical, Calendar as CalendarIcon, FileText, MessageSquare, Activity, ChevronRight, File } from 'lucide-react';
import StatCard from './StatCard';
import TrendChart from './TrendChart';
import AIModal from './AIModal';
import { HealthMetric, SidebarTab } from '../types';

interface DashboardProps {
  onNavigate: (tab: SidebarTab) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [showSensitive, setShowSensitive] = useState(true);
  const [activeModal, setActiveModal] = useState<'chat' | 'triage' | 'report' | null>(null);

  const metrics: HealthMetric[] = [
    { label: 'Heart Rate', value: '72', unit: 'bpm', status: 'Improving', trendValue: '+2%', icon: 'heart' },
    { label: 'Blood Pressure', value: '120/80', unit: '', status: 'Stable', icon: 'droplet' },
    { label: 'Weight', value: '68', unit: 'kg', status: 'Improving', trendValue: '-1 kg', icon: 'scale' },
  ];

  const recentActivity = [
    { id: 1, title: 'Blood Test Results', subtitle: 'Uploaded Yesterday', icon: FileText, color: 'text-blue-400 bg-blue-500/10' },
    { id: 2, title: 'Dr. Wong replied', subtitle: '2 days ago', icon: MessageSquare, color: 'text-purple-400 bg-purple-500/10' },
    { id: 3, title: 'Prescription Renewed', subtitle: 'Oct 24, 2023', icon: Activity, color: 'text-emerald-400 bg-emerald-500/10' },
  ];

  return (
    <div className="flex-1 bg-health-bg min-h-screen pb-20 md:pb-0 md:ml-64 p-4 md:p-8 overflow-y-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Good Morning, Sarah</h2>
          <p className="text-health-muted">Here is your daily health summary</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowSensitive(!showSensitive)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-gray-300 text-sm hover:bg-white/10 transition-colors"
          >
            <EyeOff className="w-4 h-4" />
            {showSensitive ? 'Hide' : 'Show'} Sensitive Data
          </button>
          <button className="relative p-2 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-health-bg"></span>
          </button>
        </div>
      </header>

      {/* Stats Row */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 transition-opacity duration-300 ${showSensitive ? 'opacity-100' : 'opacity-0'}`}>
        {metrics.map((m, i) => (
          <StatCard key={i} metric={m} />
        ))}
      </div>

      {/* Charts & Appointments Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 h-auto lg:h-[320px]">
        {/* Chart */}
        <div className="lg:col-span-2 h-[300px] lg:h-full">
          <TrendChart />
        </div>

        {/* Appointment Card */}
        <div className="bg-health-card rounded-3xl border border-white/5 p-1 relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-emerald-900/40 to-transparent"></div>
            <div className="p-5 relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                   <img src="https://picsum.photos/id/1062/400/200" className="w-full h-32 object-cover rounded-2xl opacity-80" alt="Doctor" />
                </div>
                <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 bg-emerald-500 text-health-bg text-xs font-bold rounded-full uppercase">Tomorrow</span>
                    <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" />
                </div>
                
                <h3 className="text-lg font-bold text-white">Dr. Emily Smith</h3>
                <p className="text-health-muted text-xs mb-4">General Checkup • 10:00 AM</p>

                <div className="mt-auto flex gap-3">
                    <button className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-health-bg font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-health-bg animate-pulse"></span>
                        Join Call
                    </button>
                    <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors">
                        <CalendarIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {/* Action 1 */}
             <button onClick={() => setActiveModal('report')} className="bg-health-card p-5 rounded-2xl border border-white/5 hover:border-emerald-500/50 hover:bg-[#132A23] transition-all group text-left">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-500 transition-colors">
                    <FileText className="w-5 h-5 text-emerald-500 group-hover:text-health-bg" />
                </div>
                <h4 className="font-bold text-white mb-1">Analyze Report</h4>
                <p className="text-xs text-health-muted">Upload for AI analysis</p>
             </button>

             {/* Action 2 */}
             <button onClick={() => setActiveModal('chat')} className="bg-health-card p-5 rounded-2xl border border-white/5 hover:border-emerald-500/50 hover:bg-[#132A23] transition-all group text-left">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-500 transition-colors">
                    <MessageSquare className="w-5 h-5 text-emerald-500 group-hover:text-health-bg" />
                </div>
                <h4 className="font-bold text-white mb-1">Ask a Question</h4>
                <p className="text-xs text-health-muted">Chat with care team</p>
             </button>

             {/* Action 3 */}
             <button onClick={() => setActiveModal('triage')} className="bg-health-card p-5 rounded-2xl border border-white/5 hover:border-emerald-500/50 hover:bg-[#132A23] transition-all group text-left">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-500 transition-colors">
                    <Activity className="w-5 h-5 text-emerald-500 group-hover:text-health-bg" />
                </div>
                <h4 className="font-bold text-white mb-1">Start Triage</h4>
                <p className="text-xs text-health-muted">Check new symptoms</p>
             </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-health-card rounded-3xl border border-white/5 p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                <button className="text-xs text-emerald-500 font-medium hover:text-emerald-400">View All</button>
            </div>
            <div className="space-y-4">
                {recentActivity.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className={`p-3 rounded-xl ${item.color}`}>
                            <item.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{item.title}</h4>
                            <p className="text-xs text-health-muted">{item.subtitle}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white" />
                    </div>
                ))}
            </div>
        </div>
      </div>

      <AIModal 
        type={activeModal} 
        onClose={() => setActiveModal(null)} 
        onBookAppointment={() => onNavigate(SidebarTab.APPOINTMENTS)}
      />
    </div>
  );
};

export default Dashboard;