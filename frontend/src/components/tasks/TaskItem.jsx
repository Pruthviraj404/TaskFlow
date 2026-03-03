import React from 'react';
import { CheckCircle2, Calendar, Trash2, MoreHorizontal } from 'lucide-react';
import TaskBadge from './TaskBadge';

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className={`flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group ${task.is_done ? 'opacity-60' : ''}`}>
      <button 
        onClick={() => onToggle(task.id)}
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${task.is_done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 hover:border-blue-400'}`}
      >
        {task.is_done === 1 && <CheckCircle2 size={14} strokeWidth={3} />}
      </button>
      <div className={`w-2 h-2 rounded-full shrink-0 ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
      <div className="flex-1 min-w-0">
        <h3 className={`text-[13px] font-medium truncate ${task.is_done ? 'line-through text-gray-400' : 'text-[#111827]'}`}>{task.title}</h3>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <TaskBadge category={task.category} />
        <div className="flex items-center gap-1 text-gray-400 font-mono text-[11px]">
          <Calendar size={12} /> {task.dueDate}
        </div>
        <button onClick={() => onDelete(task.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
        <MoreHorizontal size={16} className="text-gray-300 cursor-pointer" />
      </div>
    </div>
  );
}