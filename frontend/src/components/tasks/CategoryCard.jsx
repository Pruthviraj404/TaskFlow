import React, { useState } from 'react';
import {
  ChevronDown,
  Briefcase,
  User,
  BookOpen,
  CheckCircle2,
  AlignLeft,
  Calendar,
  AlertCircle
} from 'lucide-react';

const icons = {
  work: <Briefcase size={20} className="text-amber-600" />,
  personal: <User size={20} className="text-orange-600" />,
  study: <BookOpen size={20} className="text-emerald-600" />
};

const CategoryTaskItem = ({ task, onToggle, today }) => {

  const [isTaskExpanded, setIsTaskExpanded] = useState(false);

  const isOverdue =
    task.due_date && task.due_date < today && task.is_done === 0;

  return (
    <div className="border-b border-gray-50 last:border-0 overflow-hidden">

      {/* Task Summary Row */}

      <div
        onClick={() => setIsTaskExpanded(!isTaskExpanded)}
        className="flex items-center gap-4 px-10 py-3 hover:bg-gray-50 group cursor-pointer transition-colors"
      >

        {/* Checkbox */}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(task.id);
          }}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
            task.is_done === 1
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-gray-200 bg-white group-hover:border-blue-400'
          }`}
        >
          {task.is_done === 1 && <CheckCircle2 size={12} strokeWidth={3} />}
        </button>

        {/* Title */}

        <span
          className={`text-sm flex-1 font-medium truncate ${
            task.is_done === 1
              ? 'line-through text-gray-300'
              : 'text-gray-700'
          }`}
        >
          {task.title}
        </span>

        {/* Due Date */}

        {task.due_date && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${
            isOverdue ? 'text-red-500' : 'text-gray-500'
          }`}>
            <Calendar size={14} />
            {task.due_date}
          </div>
        )}

        {/* Priority */}

        <div
          className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
            task.priority === 'high'
              ? 'bg-red-100 text-red-600'
              : task.priority === 'medium'
              ? 'bg-yellow-100 text-yellow-600'
              : 'bg-green-100 text-green-600'
          }`}
        >
          {task.priority || 'normal'}
        </div>

        {/* Overdue Badge */}

        {isOverdue && (
          <span className="text-[9px] font-black text-red-500 uppercase bg-red-50 px-2 py-0.5 rounded">
            overdue
          </span>
        )}

        <ChevronDown
          size={14}
          className={`text-gray-300 transition-transform duration-300 ${
            isTaskExpanded ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Expandable Task Details */}

      {isTaskExpanded && (
        <div className="px-10 pb-4 pt-1 bg-gray-50 animate-in slide-in-from-top-1 duration-200">

          <div className="pl-9 space-y-3">

            {/* Description */}

            <div className="flex gap-2">

              <AlignLeft size={14} className="text-gray-400 mt-1 shrink-0" />

              <div>

                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">
                  Description
                </p>

                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  {task.description || "No description provided."}
                </p>

              </div>

            </div>

            {/* Metadata */}

            <div className="grid grid-cols-2 gap-4">

              <div className="flex items-center gap-2">

                <Calendar size={13} className="text-gray-400" />

                <div>
                  <p className="text-[8px] font-bold text-gray-400 uppercase">
                    Due Date
                  </p>

                  <p className="text-[11px] font-bold text-gray-600">
                    {task.due_date}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2">

                <AlertCircle size={13} className="text-gray-400" />

                <div>

                  <p className="text-[8px] font-bold text-gray-400 uppercase">
                    Priority
                  </p>

                  <p
                    className={`text-[11px] font-bold capitalize ${
                      task.priority === 'high'
                        ? 'text-red-500'
                        : 'text-gray-600'
                    }`}
                  >
                    {task.priority || 'Medium'}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default function CategoryCard({ category, total, completed, tasks, onToggle }) {

  const [isExpanded, setIsExpanded] = useState(false);

  const progress = total > 0
    ? Math.round((completed / total) * 100)
    : 0;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-300 ${
        isExpanded
          ? 'border-blue-200 shadow-xl shadow-blue-50'
          : 'border-gray-100 shadow-sm'
      }`}
    >

      {/* Category Header */}

      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors rounded-t-2xl"
      >

        <div className="flex items-center gap-4">

          <div className="p-3 bg-gray-50 rounded-xl">
            {icons[category.toLowerCase()] || <Briefcase size={20} />}
          </div>

          <div>

            <h3 className="font-bold text-gray-900">{category}</h3>

            <p className="text-xs text-gray-400 font-medium">
              {total} tasks • {completed} completed
            </p>

          </div>

        </div>

        <div className="flex items-center gap-6">

          <div className="flex items-center gap-3">

            <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">

              <div
                className="h-full bg-blue-500 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />

            </div>

            <span className="text-sm font-bold text-blue-600 w-8">
              {progress}%
            </span>

          </div>

          <ChevronDown
            size={18}
            className={`text-gray-400 transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />

        </div>

      </div>

      {/* Tasks */}

      {isExpanded && (

        <div className="border-t border-gray-50 bg-white animate-in slide-in-from-top-2 duration-300 pb-2">

          {tasks.length > 0 ? (

            tasks.map((task) => (
              <CategoryTaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                today={today}
              />
            ))

          ) : (

            <div className="p-8 text-center text-gray-400 text-xs italic">
              No tasks yet in this category.
            </div>

          )}

        </div>

      )}

    </div>
  );
}