import React from 'react';
import { Plus, Clock, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

const StatCard = ({ title, count, subtitle, color, icon: Icon, darkMode }) => (
  <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-[2rem] border shadow-sm flex flex-col gap-2 transition-all hover:shadow-md`}>
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-2xl ${color.bg}`}>
        <Icon size={20} className={color.text} />
      </div>
      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${color.bg} ${color.text}`}>
        {subtitle}
      </span>
    </div>
    <div className="mt-2">
      <h4 className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{count}</h4>
      <p className="text-sm font-bold text-gray-400 mt-1">{title}</p>
    </div>
  </div>
);

export default function Dashboard({ stats, tasks, onToggle, setShowModal, user, darkMode }) {
  const today = new Date().toISOString().split('T')[0];
  
  const todayTasks = tasks
    .filter(t => t.due_date === today && t.is_done === 0)
    .slice(0, 5); 

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const displayDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Good morning, {user?.name?.split(' ')[0] || 'User'} 👋
          </h1>
          <p className="text-gray-400 font-bold text-sm">{displayDate}</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:scale-105 transition-transform active:scale-95"
        >
          <Plus size={18} /> Quick Add
        </button>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard darkMode={darkMode} title="Total Tasks" count={stats.total} subtitle="Lifetime" icon={FileText} color={{bg:'bg-blue-50', text:'text-blue-600'}} />
        <StatCard darkMode={darkMode} title="Due Today" count={todayTasks.length} subtitle="Pending" icon={Clock} color={{bg:'bg-amber-50', text:'text-amber-600'}} />
        <StatCard darkMode={darkMode} title="Completed" count={stats.completed} subtitle="Done" icon={CheckCircle2} color={{bg:'bg-emerald-50', text:'text-emerald-600'}} />
        <StatCard darkMode={darkMode} title="Overdue" count={stats.overdue || 0} subtitle="Urgent" icon={AlertCircle} color={{bg:'bg-red-50', text:'text-red-600'}} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Due Today Mini-List */}
        <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} p-8 rounded-[2.5rem] border shadow-sm flex flex-col`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>Upcoming Today</h3>
            <div className={`px-3 py-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-full text-[10px] font-black text-gray-400 uppercase`}>
              {todayTasks.length} Pending
            </div>
          </div>
          
          <div className="space-y-2 flex-1">
            {todayTasks.length > 0 ? (
              todayTasks.map(task => (
                <div key={task.id} className={`flex items-center justify-between py-3 px-4 rounded-2xl transition-colors border border-transparent ${darkMode ? 'hover:bg-gray-800 hover:border-gray-700' : 'hover:bg-gray-50 hover:border-gray-100'} group`}>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => onToggle(task.id)}
                      className="w-5 h-5 rounded-lg border-2 border-gray-200 flex items-center justify-center transition-all hover:border-blue-500"
                    >
                      <div className="w-2 h-2 rounded-sm bg-blue-600 scale-0 group-hover:scale-50 transition-transform" />
                    </button>
                    <span className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{task.title}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase text-amber-500 bg-amber-50 px-2 py-1 rounded-md">
                    Today
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-10 opacity-40">
                <CheckCircle2 size={40} className="text-emerald-500 mb-2" />
                <p className={`text-sm font-bold ${darkMode ? 'text-gray-300' : ''}`}>All caught up for today!</p>
              </div>
            )}
          </div>
          
          <button className={`mt-6 w-full py-3 text-blue-600 text-sm font-bold border-2 border-dashed ${darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-blue-50 hover:bg-blue-50'} rounded-2xl transition-colors`}>
            View All Tasks
          </button>
        </div>

        {/* Completion Rate Chart */}
        <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} p-8 rounded-[2.5rem] border shadow-sm flex flex-col items-center`}>
          <h3 className={`font-black ${darkMode ? 'text-white' : 'text-gray-900'} self-start mb-6`}>Efficiency</h3>
          <div className="relative flex items-center justify-center mb-8">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" className={darkMode ? 'text-gray-800' : 'text-gray-50'} />
              <circle 
                cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" 
                strokeDasharray={502.4}
                strokeDashoffset={502.4 - (502.4 * completionRate) / 100}
                className="text-blue-600 transition-all duration-1000 ease-out" 
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{completionRate}%</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Growth</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 w-full">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50/50'} p-4 rounded-2xl text-center`}>
               <div className="text-emerald-600 font-black text-lg">{stats.completed}</div>
               <div className="text-[9px] text-gray-400 uppercase font-black">Done</div>
            </div>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50/50'} p-4 rounded-2xl text-center`}>
               <div className="text-amber-500 font-black text-lg">{stats.pending}</div>
               <div className="text-[9px] text-gray-400 uppercase font-black">Waiting</div>
            </div>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50/50'} p-4 rounded-2xl text-center`}>
               <div className="text-red-500 font-black text-lg">{stats.overdue || 0}</div>
               <div className="text-[9px] text-gray-400 uppercase font-black">Late</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}