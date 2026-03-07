import React from 'react';
import { 
  Moon, 
  Bell, 
  Calendar, 
  Lock, 
  LogOut, 
  ChevronRight, 
  ArrowLeft 
} from 'lucide-react';

const SettingsRow = ({ icon: Icon, label, description, control, onClick, isRed }) => (
  <div 
    onClick={onClick}
    className={`flex items-center justify-between p-4 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50/50 transition-colors ${isRed ? 'text-red-500' : 'text-gray-700'}`}
  >
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-lg ${isRed ? 'bg-red-50' : 'bg-gray-100'}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-sm font-bold">{label}</p>
        {description && <p className="text-[11px] text-gray-400 font-medium">{description}</p>}
      </div>
    </div>
    {control ? control : <ChevronRight size={16} className="text-gray-300" />}
  </div>
);

export default function Settings({ user, onLogout, setActiveScreen }) {
  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??';

  return (
    <div className="p-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => setActiveScreen('dashboard')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-black text-gray-900">Settings</h1>
      </div>

      {/* Profile Card */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-[1.25rem] bg-blue-600 flex items-center justify-center text-xl font-black text-white shadow-lg shadow-blue-200">
            {getInitials(user?.name)}
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900">{user?.name}</h2>
            <p className="text-sm text-gray-400 font-medium">{user?.email}</p>
          </div>
        </div>
        <button className="px-5 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
          Edit Profile
        </button>
      </div>

      {/* Preferences Section */}
      <div className="mb-8">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-3">Preferences</p>
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <SettingsRow 
            icon={Moon} 
            label="Dark Mode" 
            description="Switch appearance" 
            control={<input type="checkbox" className="sr-only peer" /> /* Add your toggle UI here */} 
          />
          <SettingsRow 
            icon={Bell} 
            label="Notifications" 
            description="Task reminders" 
            control={<div className="w-10 h-5 bg-emerald-500 rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"/></div>} 
          />
          <SettingsRow 
            icon={Calendar} 
            label="Default Due Date" 
            description="When creating tasks" 
            control={<span className="text-sm font-bold text-gray-400">Tomorrow <ChevronRight size={14} className="inline ml-1"/></span>} 
          />
        </div>
      </div>

      {/* Account Section */}
      <div className="mb-8">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-3">Account</p>
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <SettingsRow icon={Lock} label="Change Password" />
          <SettingsRow icon={LogOut} label="Log Out" onClick={onLogout} isRed={true} />
        </div>
      </div>
    </div>
  );
}