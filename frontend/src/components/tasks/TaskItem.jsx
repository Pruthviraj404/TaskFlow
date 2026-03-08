import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Calendar, 
  Trash2, 
  MoreHorizontal, 
  ChevronDown, 
  AlignLeft,
  AlertCircle
} from 'lucide-react';
import TaskBadge from './TaskBadge';

export default function TaskItem({ task, onToggle, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col mb-3">
      {/* Main Task Row */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer ${
          task.is_done ? 'opacity-60 bg-gray-50/50' : ''
        } ${isExpanded ? 'rounded-b-none border-b-transparent shadow-none' : ''}`}
      >
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevent opening description when checking off
            onToggle(task.id);
          }}
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
            task.is_done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 hover:border-blue-400'
          }`}
        >
          {task.is_done === 1 && <CheckCircle2 size={14} strokeWidth={3} />}
        </button>

        <div className={`w-2 h-2 rounded-full shrink-0 ${
          task.priority?.toLowerCase() === 'high' ? 'bg-red-500' : 
          task.priority?.toLowerCase() === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
        }`} />

        <div className="flex-1 min-w-0">
          <h3 className={`text-[13px] font-bold truncate ${
            task.is_done ? 'line-through text-gray-400' : 'text-[#111827]'
          }`}>
            {task.title}
          </h3>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <TaskBadge category={task.category} />
          
          <ChevronDown 
            size={16} 
            className={`text-gray-300 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
          />
        </div>
      </div>

      {/* Expandable Content (The "Dropdown") */}
      {isExpanded && (
        <div className="bg-white border border-t-0 border-gray-100 rounded-b-xl p-4 pt-0 shadow-sm animate-in slide-in-from-top-2 duration-200">
          <div className="h-[1px] bg-gray-50 w-full mb-4" />
          
          <div className="space-y-4">
            {/* Description Section */}
            <div className="flex gap-3">
              <AlignLeft size={16} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Description</p>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {task.description || "No description provided for this task."}
                </p>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 ml-7">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-400" />
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase">Due Date</p>
                  <p className="text-xs font-bold text-gray-700">{task.dueDate || task.due_date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle size={14} className="text-gray-400" />
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase">Priority</p>
                  <p className={`text-xs font-bold capitalize ${
                    task.priority === 'high' ? 'text-red-500' : 'text-gray-700'
                  }`}>
                    {task.priority || 'Normal'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={14} /> Delete Task
              </button>
              <button className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}