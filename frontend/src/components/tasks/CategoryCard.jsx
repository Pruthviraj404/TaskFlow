import React, { useState } from 'react';
import { ChevronDown, Briefcase, User, BookOpen, CheckCircle2 } from 'lucide-react';

const icons = {
  work: <Briefcase size={20} className="text-amber-600" />,
  personal: <User size={20} className="text-orange-600" />,
  study: <BookOpen size={20} className="text-emerald-600" />
};

export default function CategoryCard({ category, total, completed, tasks, onToggle }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Real-time progress calculation
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-300 ${
      isExpanded ? 'border-blue-200 shadow-xl shadow-blue-50' : 'border-gray-100 shadow-sm'
    }`}>
      {/* Header Area */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-white transition-colors">
            {icons[category.toLowerCase()] || <Briefcase size={20} />}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{category}</h3>
            <p className="text-xs text-gray-400">
              {total} tasks • {completed} completed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Progress Bar Group */}
          <div className="flex items-center gap-3">
            <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-700 ease-in-out" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-bold text-blue-600 w-8">{progress}%</span>
          </div>
          <ChevronDown 
            size={18} 
            className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
          />
        </div>
      </div>

      {/* Expandable Content Area */}
      {isExpanded && (
        <div className="border-t border-gray-50 bg-white animate-in slide-in-from-top-2 duration-300">
          {tasks.length > 0 ? (
            tasks.map((task) => {
              const isOverdue = task.due_date < today && task.is_done === 0;
              return (
                <div 
                  key={task.id} 
                  className="flex items-center gap-4 px-10 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/30 group"
                >
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); // Prevent card from collapsing
                      onToggle(task.id); 
                    }}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      task.is_done === 1 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'border-gray-200 bg-white group-hover:border-blue-400'
                    }`}
                  >
                    {task.is_done === 1 && <CheckCircle2 size={12} strokeWidth={3} />}
                  </button>
                  
                  <span className={`text-sm flex-1 font-medium ${
                    task.is_done === 1 ? 'line-through text-gray-300 decoration-gray-300' : 'text-gray-600'
                  }`}>
                    {task.title}
                  </span>

                  {isOverdue && (
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-tight">Overdue</span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center text-gray-400 text-xs italic">No tasks yet.</div>
          )}
        </div>
      )}
    </div>
  );
}