import React, { useState } from 'react';
import { User, Bell, Shield, Lock, Smartphone, ChevronRight, LogOut, Moon, Check, Globe, Loader2, CheckCircle } from 'lucide-react';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });

  const [profile, setProfile] = useState({
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 000-0000',
    dob: '1988-05-14'
  });

  // Track original state to detect changes
  const [originalProfile, setOriginalProfile] = useState(profile);

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Derive hasChanges state
  const hasChanges = JSON.stringify(profile) !== JSON.stringify(originalProfile);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
    setShowSuccess(false); // Hide success message on edit
  };

  const handleSave = () => {
    if (!hasChanges) return;

    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setOriginalProfile(profile); // Update original profile to current
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const Toggle = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button 
        onClick={onChange}
        className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-emerald-500' : 'bg-gray-700'}`}
    >
        <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );

  return (
    <div className="flex-1 bg-health-bg min-h-screen pb-20 md:pb-0 md:ml-64 p-4 md:p-8 overflow-y-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-1">Settings</h2>
        <p className="text-health-muted">Manage your account preferences</p>
      </header>

      <div className="max-w-4xl space-y-8">
        
        {/* Profile Section */}
        <section>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-500" />
                Profile Information
            </h3>
            <div className="bg-health-card rounded-2xl border border-white/5 p-6 space-y-6">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <img src="https://picsum.photos/id/64/100/100" alt="Profile" className="w-20 h-20 rounded-full border-2 border-emerald-500/30" />
                        <button className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-health-card hover:bg-emerald-400">
                             <User className="w-3 h-3" />
                        </button>
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-lg">{profile.name}</h4>
                        <p className="text-gray-400 text-sm">Patient ID: #HH-8829-X</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Full Name</label>
                        <input 
                            type="text" 
                            name="name"
                            value={profile.name} 
                            onChange={handleInputChange}
                            className={`w-full bg-health-bg border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors ${
                                profile.name !== originalProfile.name ? 'border-amber-500/50' : 'border-white/10'
                            }`}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Email Address</label>
                        <input 
                            type="email" 
                            name="email"
                            value={profile.email} 
                            onChange={handleInputChange}
                            className={`w-full bg-health-bg border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors ${
                                profile.email !== originalProfile.email ? 'border-amber-500/50' : 'border-white/10'
                            }`}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Phone Number</label>
                        <input 
                            type="tel" 
                            name="phone"
                            value={profile.phone} 
                            onChange={handleInputChange}
                            className={`w-full bg-health-bg border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors ${
                                profile.phone !== originalProfile.phone ? 'border-amber-500/50' : 'border-white/10'
                            }`}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Date of Birth</label>
                        <input 
                            type="date" 
                            name="dob"
                            value={profile.dob} 
                            onChange={handleInputChange}
                            className={`w-full bg-health-bg border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors ${
                                profile.dob !== originalProfile.dob ? 'border-amber-500/50' : 'border-white/10'
                            }`}
                        />
                    </div>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-4 h-12">
                    {hasChanges && !isSaving && !showSuccess && (
                        <span className="text-sm text-amber-400 animate-pulse font-medium">
                            Unsaved changes
                        </span>
                    )}
                    
                    {showSuccess && (
                        <span className="text-emerald-400 text-sm flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <CheckCircle className="w-4 h-4" /> 
                            <span className="font-medium">Saved successfully</span>
                        </span>
                    )}

                    <button 
                        onClick={handleSave}
                        disabled={isSaving || !hasChanges}
                        className={`px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
                           hasChanges 
                           ? 'bg-emerald-500 text-health-bg hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transform hover:-translate-y-0.5' 
                           : 'bg-white/5 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </section>

        {/* Notifications */}
        <section>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-500" />
                Notifications
            </h3>
            <div className="bg-health-card rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-4 flex items-center justify-between border-b border-white/5">
                    <div>
                        <h4 className="text-white font-medium">Email Notifications</h4>
                        <p className="text-xs text-gray-400">Receive weekly summaries and report updates</p>
                    </div>
                    <Toggle checked={notifications.email} onChange={() => setNotifications(prev => ({...prev, email: !prev.email}))} />
                </div>
                <div className="p-4 flex items-center justify-between border-b border-white/5">
                    <div>
                        <h4 className="text-white font-medium">Push Notifications</h4>
                        <p className="text-xs text-gray-400">Real-time alerts for appointments and messages</p>
                    </div>
                    <Toggle checked={notifications.push} onChange={() => setNotifications(prev => ({...prev, push: !prev.push}))} />
                </div>
                <div className="p-4 flex items-center justify-between">
                    <div>
                        <h4 className="text-white font-medium">SMS Messages</h4>
                        <p className="text-xs text-gray-400">Text alerts for urgent results</p>
                    </div>
                    <Toggle checked={notifications.sms} onChange={() => setNotifications(prev => ({...prev, sms: !prev.sms}))} />
                </div>
            </div>
        </section>

        {/* Connected Devices */}
        <section>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-500" />
                Connected Devices
            </h3>
            <div className="bg-health-card rounded-2xl border border-white/5 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                             <Activity className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold">Apple Health</h4>
                            <p className="text-xs text-emerald-400 flex items-center gap-1">
                                <Check className="w-3 h-3" /> Connected
                            </p>
                        </div>
                    </div>
                    <button className="text-sm text-gray-400 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg">Disconnect</button>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                             <Globe className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold">Fitbit</h4>
                            <p className="text-xs text-gray-500">Not connected</p>
                        </div>
                    </div>
                    <button className="text-sm bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg">Connect</button>
                </div>
            </div>
        </section>

        {/* Security & Danger Zone */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-500" />
                    Security
                </h3>
                <div className="bg-health-card rounded-2xl border border-white/5 p-4 space-y-2">
                    <button className="w-full flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors text-left group">
                        <div className="flex items-center gap-3">
                            <Lock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-200">Change Password</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors text-left group">
                         <div className="flex items-center gap-3">
                            <Moon className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-200">Appearance</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white" />
                    </button>
                </div>
             </div>
             
             <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 text-rose-500">
                    <LogOut className="w-5 h-5" />
                    Account Actions
                </h3>
                <div className="bg-health-card rounded-2xl border border-white/5 p-6 flex flex-col items-start justify-center h-[120px]">
                     <button className="w-full py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl font-medium transition-colors mb-2">
                        Sign Out
                     </button>
                     <p className="text-[10px] text-gray-500 text-center w-full">Version 2.5.0</p>
                </div>
             </div>
        </section>

      </div>
    </div>
  );
};

// Helper for icon
function Activity(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    )
  }

export default Settings;