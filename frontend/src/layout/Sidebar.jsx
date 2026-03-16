import React from 'react';
import { 
  Layout, 
  Clock, 
  LayoutDashboard, 
  CheckCircle2, 
  Briefcase, 
  User, 
  BookOpen, 
  Settings, 
  LogOut,
  Layers 
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, count, active, onClick, color }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={18} className={active ? 'text-white' : color || 'text-inherit'} />
      {label}
    </div>
    {count !== undefined && (
      <span className={`font-mono text-[10px] px-2 py-0.5 rounded-md ${
        active ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-500'
      }`}>
        {count}
      </span>
    )}
  </button>
);

export default function Sidebar({
  tasks,
  stats,
  activeScreen,
  setActiveScreen,
  filter,
  setFilter,
  categoryFilter,
  setCategoryFilter,
  user,
  onLogout,
  darkMode,
  setDarkMode
}) {

  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // ✅ Category click — sets categoryFilter + resets tab to All
  const handleCategoryClick = (catName) => {
    setCategoryFilter(catName);
    setFilter("All");
    setActiveScreen("tasks");
  };

  // ✅ Regular nav click — clears categoryFilter
  const handleNavClick = (screen, filterVal = "All") => {
    setCategoryFilter(null);
    setFilter(filterVal);
    setActiveScreen(screen);
  };

  return (
    <aside className="w-64 bg-[#121212] text-white flex flex-col shrink-0 border-r border-white/5">

      <div className="p-6">

        {/* Logo */}
        <div
          className="flex items-center gap-3 mb-10 cursor-pointer group"
          onClick={() => handleNavClick("dashboard")}
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Layout size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">
            TaskFlow
          </h1>
        </div>

        {/* Main Menu */}
        <div className="mb-8">
          <p className="text-[10px] font-bold text-gray-600 mb-4 px-3 uppercase tracking-[0.2em]">
            Main Menu
          </p>

          <nav className="space-y-1.5">

            <SidebarItem
              icon={LayoutDashboard}
              label="Dashboard"
              active={activeScreen === "dashboard"}
              onClick={() => handleNavClick("dashboard")}
            />

            <SidebarItem
              icon={Layout}
              label="All Tasks"
              count={tasks.length}
              active={activeScreen === "tasks" && !categoryFilter && filter === "All"}
              onClick={() => handleNavClick("tasks", "All")}
            />

            <SidebarItem
              icon={Clock}
              label="Today"
              count={stats.pending}
              active={activeScreen === "tasks" && !categoryFilter && filter === "Today"}
              onClick={() => handleNavClick("tasks", "Today")}
            />

            <SidebarItem
              icon={Layers}
              label="Categories View"
              active={activeScreen === "overview"}
              onClick={() => handleNavClick("overview")}
            />

            <SidebarItem
              icon={CheckCircle2}
              label="Completed"
              active={activeScreen === "tasks" && !categoryFilter && filter === "Completed"}
              onClick={() => handleNavClick("tasks", "Completed")}
            />

          </nav>
        </div>

        {/* Quick Filters */}
        <div>
          <p className="text-[10px] font-bold text-gray-600 mb-4 px-3 uppercase tracking-[0.2em]">
            Quick Filters
          </p>

          <nav className="space-y-1.5">

            <SidebarItem
              icon={Briefcase}
              label="Work"
              color="text-blue-400"
              active={activeScreen === "tasks" && categoryFilter === "work"}
              onClick={() => handleCategoryClick("work")}
            />

            <SidebarItem
              icon={User}
              label="Personal"
              color="text-purple-400"
              active={activeScreen === "tasks" && categoryFilter === "personal"}
              onClick={() => handleCategoryClick("personal")}
            />

            <SidebarItem
              icon={BookOpen}
              label="Study"
              color="text-emerald-400"
              active={activeScreen === "tasks" && categoryFilter === "study"}
              onClick={() => handleCategoryClick("study")}
            />

          </nav>
        </div>

      </div>

      {/* User Footer */}
      <div className="mt-auto p-4 bg-white/5 border-t border-white/5 space-y-3">

        <div
          className="flex items-center gap-3 w-full p-2 group cursor-pointer hover:bg-white/5 rounded-xl transition-colors"
          onClick={() => setActiveScreen("settings")}
        >
          <div className="w-10 h-10 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-500/20 text-white">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              getInitials(user?.name)
            )}
          </div>

          <div className="text-left overflow-hidden flex-1">
            <p className="text-sm font-bold truncate text-gray-100 group-hover:text-blue-400 transition-colors">
              {user?.name || "Guest User"}
            </p>
            <p className="text-[10px] text-gray-500 truncate">
              {user?.email || "Sign in to sync"}
            </p>
          </div>

          <Settings
            size={16}
            className="text-gray-500 group-hover:text-white transition-all group-hover:rotate-90"
          />
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded-xl transition-all active:scale-95"
        >
          <LogOut size={14} />
          Sign Out
        </button>

      </div>
    </aside>
  );
}