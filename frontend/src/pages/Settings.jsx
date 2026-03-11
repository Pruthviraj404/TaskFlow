import React, { useState } from 'react';
import { 
  Moon, 
  Bell, 
  Calendar, 
  Lock, 
  LogOut, 
  ChevronRight, 
  ArrowLeft,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import ChangePasswordModal from '../components/ChangePasswordModal';

const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onChange(!enabled);
    }}
    className={`w-11 h-6 rounded-full transition-all duration-300 relative focus:outline-none ${
      enabled ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]' : 'bg-gray-200'
    }`}
  >
    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 transform ${
      enabled ? 'translate-x-6' : 'translate-x-1'
    }`} />
  </button>
);

const SettingsRow = ({ icon: Icon, label, description, control, onClick, isRed }) => (
  <div 
    onClick={onClick}
    className={`flex items-center justify-between p-5 transition-all active:scale-[0.98] cursor-pointer group hover:bg-gray-50/80`}
  >
    <div className="flex items-center gap-4">
      <div className={`p-2.5 rounded-xl transition-colors ${
        isRed 
          ? 'bg-red-50 text-red-500' 
          : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:shadow-sm'
      }`}>
        <Icon size={18} />
      </div>
      <div>
        <p className={`text-sm font-bold ${isRed ? 'text-red-500' : 'text-gray-800'}`}>{label}</p>
        {description && <p className="text-[12px] text-gray-400 font-medium">{description}</p>}
      </div>
    </div>
    <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
      {control ? control : <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-0.5 transition-transform" />}
    </div>
  </div>
);

export default function Settings({ user, onLogout, setActiveScreen }) {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [defaultDueDate, setDefaultDueDate] = useState('Tomorrow');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??';

  const handleDueDateChange = () => {
    const options = ['Today', 'Tomorrow', 'Next Week'];
    const currentIndex = options.indexOf(defaultDueDate);
    const nextIndex = (currentIndex + 1) % options.length;
    setDefaultDueDate(options[nextIndex]);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFF]">
      {/* Container with max-width for desktop readability */}
      <div className={`max-w-xl mx-auto transition-all duration-500 ${showPasswordModal ? 'blur-xl scale-95 opacity-50' : 'opacity-100'}`}>
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#FAFBFF]/80 backdrop-blur-md px-6 py-6 flex items-center gap-4">
          <button 
            onClick={() => setActiveScreen('dashboard')} 
            className="p-2 hover:bg-white hover:shadow-md rounded-full transition-all active:scale-90"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-[900] text-gray-900 tracking-tight">Settings</h1>
        </div>

        <div className="px-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Profile Card */}
          <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-lg font-black text-white shadow-lg shadow-blue-100">
                {getInitials(user?.name)}
              </div>
              <div className="overflow-hidden">
                <h2 className="text-base font-black text-gray-900 truncate">{user?.name || 'User'}</h2>
                <p className="text-xs text-gray-400 font-semibold truncate">{user?.email}</p>
              </div>
            </div>
            <button className="flex-shrink-0 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all">
              Edit
            </button>
          </div>

          {/* Preferences Group */}
          <div className="mb-10">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] ml-2 mb-4">Preferences</h3>
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] overflow-hidden divide-y divide-gray-50">
              <SettingsRow 
                icon={Moon} 
                label="Dark Mode" 
                description="Easier on the eyes" 
                control={<Toggle enabled={darkMode} onChange={setDarkMode} />}
                onClick={() => setDarkMode(!darkMode)}
              />
              <SettingsRow 
                icon={Bell} 
                label="Notifications" 
                description="Instant task reminders" 
                control={<Toggle enabled={notifications} onChange={setNotifications} />}
                onClick={() => setNotifications(!notifications)}
              />
              <SettingsRow 
                icon={Calendar} 
                label="Default Due Date" 
                description="Set for new tasks" 
                onClick={handleDueDateChange}
                control={
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 rounded-lg text-xs font-bold text-blue-600">
                    {defaultDueDate} <ChevronRight size={12} />
                  </div>
                } 
              />
            </div>
          </div>

          {/* Account Group */}
          <div className="mb-10">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] ml-2 mb-4">Security & Account</h3>
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] overflow-hidden divide-y divide-gray-50">
              <SettingsRow 
                icon={Lock} 
                label="Change Password" 
                description="Last updated 2 months ago"
                onClick={() => setShowPasswordModal(true)} 
              />
              <SettingsRow 
                icon={LogOut} 
                label="Log Out" 
                description="Safely exit your account"
                onClick={onLogout} 
                isRed={true} 
              />
            </div>
          </div>

          {/* Footer Version Info */}
          <p className="text-center text-[10px] text-gray-300 font-bold uppercase tracking-widest">
            Version 2.4.0 • Built with ❤️
          </p>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/5 backdrop-blur-sm">
          <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
        </div>
      )}
    </div>
  );
}
