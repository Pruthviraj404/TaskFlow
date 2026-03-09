import React, { useState } from 'react';
import { 
  Moon, 
  Bell, 
  Calendar, 
  Lock, 
  LogOut, 
  ChevronRight, 
  ArrowLeft 
} from 'lucide-react';
import ChangePasswordModal from '../components/ChangePasswordModal';



const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onChange(!enabled);
    }}
    className={`w-10 h-5 rounded-full transition-colors relative ${enabled ? 'bg-blue-600' : 'bg-gray-200'}`}
  >
    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${enabled ? 'left-6' : 'left-1'}`} />
  </button>
);

const SettingsRow = ({ icon: Icon, label, description, control, onClick, isRed }) => (
  <div 
    onClick={onClick}
    className={`flex items-center justify-between p-5 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 transition-all active:scale-[0.99] ${isRed ? 'text-red-500' : 'text-gray-700'}`}
  >
    <div className="flex items-center gap-4">
      <div className={`p-2.5 rounded-xl ${isRed ? 'bg-red-50' : 'bg-gray-100 text-gray-500'}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-sm font-bold">{label}</p>
        {description && <p className="text-[11px] text-gray-400 font-bold">{description}</p>}
      </div>
    </div>
    <div onClick={(e) => e.stopPropagation()}>
      {control ? control : <ChevronRight size={16} className="text-gray-300" />}
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
    <div className="relative min-h-screen bg-white">
     
      <div className={`transition-all duration-300 ${showPasswordModal ? 'blur-md pointer-events-none scale-95' : 'scale-100'}`}>
        <div className="p-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          
       
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => setActiveScreen('dashboard')} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-90"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-2xl font-black text-gray-900">Settings</h1>
          </div>

    
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-[1.25rem] bg-blue-600 flex items-center justify-center text-xl font-black text-white shadow-lg shadow-blue-200">
                {getInitials(user?.name)}
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">{user?.name || 'User'}</h2>
                <p className="text-sm text-gray-400 font-bold">{user?.email}</p>
              </div>
            </div>
            <button className="px-5 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
              Edit Profile
            </button>
          </div>

        
          <div className="mb-8">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-3">Preferences</p>
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <SettingsRow 
                icon={Moon} 
                label="Dark Mode" 
                description="Switch appearance" 
                control={<Toggle enabled={darkMode} onChange={setDarkMode} />}
                onClick={() => setDarkMode(!darkMode)}
              />
              <SettingsRow 
                icon={Bell} 
                label="Notifications" 
                description="Task reminders" 
                control={<Toggle enabled={notifications} onChange={setNotifications} />}
                onClick={() => setNotifications(!notifications)}
              />
              <SettingsRow 
                icon={Calendar} 
                label="Default Due Date" 
                description="When creating tasks" 
                onClick={handleDueDateChange}
                control={
                  <div className="flex items-center gap-1 text-sm font-bold text-blue-600">
                    {defaultDueDate} <ChevronRight size={14} />
                  </div>
                } 
              />
            </div>
          </div>

     
          <div className="mb-8">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-3">Account</p>
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <SettingsRow 
                icon={Lock} 
                label="Change Password" 
                description="Update your security"
                onClick={() => setShowPasswordModal(true)} 
              />
              <SettingsRow 
                icon={LogOut} 
                label="Log Out" 
                onClick={onLogout} 
                isRed={true} 
              />
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}