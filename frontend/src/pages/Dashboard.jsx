import React from 'react';
import { Layout, Calendar, CheckCircle2, Clock } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import TaskBadge from '../components/tasks/TaskBadge';

export default function Dashboard({ stats, tasks }) {
  return (
    <div className="p-8 max-w-6xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h2 className="text-2xl font-extrabold text-[#111827]">Good morning, Rahul 👋</h2>
        <p className="text-gray-500 text-sm font-mono mt-1">Today is Tuesday, 3 March 2026</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Tasks" value={stats.total} icon={Layout} color="border-blue-500" />
        <StatCard label="Due Today" value={stats.pending} icon={Calendar} color="border-amber-500" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} color="border-emerald-500" />
        <StatCard label="Overdue" value={stats.overdue} icon={Clock} color="border-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-[#111827] mb-4">Pending Tasks</h3>
          <div className="space-y-3">
            {tasks.filter(t => !t.is_done).slice(0, 4).map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-sm font-medium">{t.title}</span>
                <TaskBadge category={t.category} />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center">
          <h3 className="font-bold text-[#111827] mb-8 w-full">Completion Rate</h3>
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="#F3F4F6" strokeWidth="12" fill="transparent" />
              <circle cx="80" cy="80" r="70" stroke="#3B82F6" strokeWidth="12" fill="transparent" strokeDasharray="440" strokeDashoffset={440 - (440 * stats.rate) / 100} strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black font-mono">{stats.rate}%</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Done</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}