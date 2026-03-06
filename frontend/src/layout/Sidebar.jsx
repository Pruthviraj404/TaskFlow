import React from 'react';
import { Layout, Clock, LayoutDashboard, CheckCircle2, Briefcase, User, BookOpen, Settings, LogOut } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, count, active, onClick, color }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-[#3B82F6] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
  >
    <div className="flex items-center gap-3">
      <Icon size={18} className={color} />
      {label}
    </div>
    {count !== undefined && (
      <span className="font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded">{count}</span>
    )}
  </button>
);

export default function Sidebar({ tasks, stats, activeScreen, setActiveScreen, filter, setFilter, user, onLogout }) {
  
  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <aside className="w-64 bg-[#1E1E1E] text-white flex flex-col shrink-0 shadow-2xl">
      <div className="p-6">
        <h1 className="text-[28px] font-extrabold text-white mb-8 tracking-tight">TaskFlow</h1>
        
        <div className="mb-6">
          <p className="text-[10px] font-bold text-gray-500 mb-3 px-2 uppercase tracking-widest">Menu</p>
          <nav className="space-y-1">
            <SidebarItem 
              icon={Layout} 
              label="All Tasks" 
              count={tasks.length} 
              active={activeScreen === 'list' && filter === 'All'} 
              onClick={() => {setActiveScreen('list'); setFilter('All');}} 
            />
            <SidebarItem 
              icon={Clock} 
              label="Today" 
              count={stats.pending} 
              active={filter === 'Today'} 
              onClick={() => {setActiveScreen('list'); setFilter('Today');}} 
            />
            <SidebarItem 
              icon={LayoutDashboard} 
              label="Overview" 
              active={activeScreen === 'dashboard'} 
              onClick={() => setActiveScreen('dashboard')} 
            />
            <SidebarItem 
              icon={CheckCircle2} 
              label="Completed" 
              active={filter === 'Completed'} 
              onClick={() => {setActiveScreen('list'); setFilter('Completed');}} 
            />
          </nav>
        </div>

        <div className="mb-6">
          <p className="text-[10px] font-bold text-gray-500 mb-3 px-2 uppercase tracking-widest">Categories</p>
          <nav className="space-y-1">
            <SidebarItem icon={Briefcase} label="Work" color="text-blue-400" onClick={() => setActiveScreen('categories')} />
            <SidebarItem icon={User} label="Personal" color="text-purple-400" onClick={() => setActiveScreen('categories')} />
            <SidebarItem icon={BookOpen} label="Study" color="text-emerald-400" onClick={() => setActiveScreen('categories')} />
          </nav>
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-white/10 space-y-2">
        <div className="flex items-center gap-3 w-full p-2">
          <div className="w-8 h-8 shrink-0 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">
            {getInitials(user?.name)}
          </div>
          <div className="text-left overflow-hidden">
            <p className="text-sm font-semibold truncate">{user?.name || 'Guest'}</p>
            <p className="text-[10px] text-gray-400 truncate">{user?.email || 'No email'}</p>
          </div>
          <Settings 
            size={14} 
            className="ml-auto text-gray-400 cursor-pointer hover:text-white" 
            onClick={() => setActiveScreen('settings')} 
          />
        </div>
        
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </aside>
  );
}