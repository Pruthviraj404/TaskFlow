import React from 'react';
import { Search, Plus } from 'lucide-react';
import TaskList from "../components/tasks/TaskList";

interface Task {
  id: number;
  title: string;
  description?: string;
  category: string;
  priority: string;
  due_date: string;
  is_done: number;
}

interface TaskPageProps {
  tasks: Task[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filter: string;
  setFilter: (filter: string) => void;
  setShowModal: (show: boolean) => void;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, data: any) => Promise<void>;
  darkMode: boolean;
  categoryFilter?: string | null;
}

export default function TaskPage({
  tasks,
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
  setShowModal,
  onToggle,
  onDelete,
  onEdit,
  darkMode,
  categoryFilter,
}: TaskPageProps) {

 
  const pageTitle = categoryFilter
    ? `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} Tasks`
    : filter === 'All' ? 'All Tasks' : `${filter} Tasks`;

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500">

     
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-[#111827]'}`}>
            {pageTitle}
          </h2>
          
          {categoryFilter && (
            <p className="text-xs text-gray-400 mt-1 font-medium">
              Filtered by category · Tab filters apply within
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
            />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 pr-4 py-2 border rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-200 text-black'
              }`}
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#3B82F6] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-200"
          >
            <Plus size={18} /> Add Task
          </button>
        </div>
      </div>

     
      <div className={`flex items-center gap-6 mb-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        {['All', 'Today', 'Pending', 'Completed', 'Overdue'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`pb-3 text-sm font-bold relative transition-colors ${
              filter === f
                ? darkMode ? 'text-white' : 'text-black'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {f}
            {filter === f && (
              <div className={`absolute bottom-0 left-0 w-full h-0.5 rounded-full ${darkMode ? 'bg-white' : 'bg-black'}`} />
            )}
          </button>
        ))}
      </div>

    
      {tasks.length > 0 ? (
        <TaskList
          tasks={tasks}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          darkMode={darkMode}
        />
      ) : (
        <div className={`text-center py-20 rounded-2xl border-2 border-dashed ${
          darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            darkMode ? 'bg-gray-800 text-gray-600' : 'bg-gray-50 text-gray-300'
          }`}>
            <Plus size={32} />
          </div>
          <h3 className={`font-bold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
            No tasks found
          </h3>
          <p className="text-gray-400 text-sm">
            {categoryFilter
              ? `No ${filter === 'All' ? '' : filter.toLowerCase() + ' '}${categoryFilter} tasks found.`
              : 'Try changing filters or add a new task.'
            }
          </p>
        </div>
      )}
    </div>
  );
}