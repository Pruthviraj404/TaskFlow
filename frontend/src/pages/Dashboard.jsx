import React from 'react';
import { Plus, Clock, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

const StatCard = ({ title, count, subtitle, color, icon: Icon }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col gap-2">
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-2xl ${color.bg}`}>
        <Icon size={20} className={color.text} />
      </div>
      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${color.bg} ${color.text}`}>
        {subtitle}
      </span>
    </div>
    <div className="mt-2">
      <h4 className="text-4xl font-black text-gray-900">{count}</h4>
      <p className="text-sm font-bold text-gray-400 mt-1">{title}</p>
    </div>
  </div>
);

export default function Dashboard({ stats, tasks, onToggle, setShowModal }) {
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.due_date === today).slice(0, 4);
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Good morning, Pruthviraj 👋</h1>
          <p className="text-gray-400 font-bold text-sm">Friday, 14 March 2026</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:scale-105 transition-transform"
        >
          <Plus size={18} /> Quick Add
        </button>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Tasks" count={stats.total} subtitle="+2 new" icon={FileText} color={{bg:'bg-blue-50', text:'text-blue-600'}} />
        <StatCard title="Due Today" count={stats.pending} subtitle="4 tasks" icon={Clock} color={{bg:'bg-amber-50', text:'text-amber-600'}} />
        <StatCard title="Completed" count={stats.completed} subtitle="+3 this week" icon={CheckCircle2} color={{bg:'bg-emerald-50', text:'text-emerald-600'}} />
        <StatCard title="Overdue" count={stats.overdue || 0} subtitle="Action needed" icon={AlertCircle} color={{bg:'bg-red-50', text:'text-red-600'}} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Due Today Mini-List */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-gray-900">Due Today</h3>
            <button className="text-blue-600 text-sm font-bold">View all →</button>
          </div>
          <div className="space-y-4">
            {todayTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={task.is_done === 1} 
                    onChange={() => onToggle(task.id)}
                    className="w-5 h-5 rounded-lg border-2 border-gray-200 text-blue-600 focus:ring-0" 
                  />
                  <span className={`text-sm font-bold ${task.is_done ? 'line-through text-gray-300' : 'text-gray-700'}`}>{task.title}</span>
                </div>
                <span className={`text-[10px] font-black uppercase ${task.is_done ? 'text-gray-300' : 'text-red-500'}`}>
                  {task.is_done ? 'Done' : 'Today'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Completion Rate Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center">
          <h3 className="font-black text-gray-900 self-start mb-6">Completion Rate</h3>
          <div className="relative flex items-center justify-center mb-6">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-gray-100" />
              <circle 
                cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" 
                strokeDasharray={502.4}
                strokeDashoffset={502.4 - (502.4 * completionRate) / 100}
                className="text-blue-600 transition-all duration-1000 ease-out" 
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black text-gray-900">{completionRate}%</span>
              <span className="text-xs font-bold text-gray-400">Done</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-8 w-full px-4">
            <div className="text-center">
               <div className="text-blue-600 font-black">{stats.completed}</div>
               <div className="text-[10px] text-gray-400 uppercase font-bold">Completed</div>
            </div>
            <div className="text-center">
               <div className="text-amber-500 font-black">{stats.pending}</div>
               <div className="text-[10px] text-gray-400 uppercase font-bold">Pending</div>
            </div>
            <div className="text-center">
               <div className="text-red-500 font-black">{stats.overdue || 0}</div>
               <div className="text-[10px] text-gray-400 uppercase font-bold">Overdue</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}