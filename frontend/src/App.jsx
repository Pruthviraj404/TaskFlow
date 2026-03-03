import React, { useState, useMemo } from 'react';
import Sidebar from './layout/Sidebar';
import Dashboard from './pages/Dashboard';
import TaskItem from './components/tasks/TaskItem';
import { Search, Plus, X } from 'lucide-react';

const INITIAL_TASKS = [
  { id: 1, title: 'Submit project report to professor', category: 'Study', priority: 'high', dueDate: '2025-03-12', is_done: 0 },
  { id: 2, title: 'Fix login bug in the backend API', category: 'Work', priority: 'high', dueDate: '2025-03-03', is_done: 0 },
  { id: 6, title: 'Set up Node.js environment', category: 'Work', priority: 'low', dueDate: '2025-03-01', is_done: 1 },
];

export default function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [activeScreen, setActiveScreen] = useState('list');
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const completed = tasks.filter(t => t.is_done === 1).length;
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.is_done === 0).length,
      completed,
      overdue: tasks.filter(t => t.dueDate < today && t.is_done === 0).length,
      rate: tasks.length ? Math.round((completed / tasks.length) * 100) : 0
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let list = [...tasks];
    if (searchQuery) list = list.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const today = new Date().toISOString().split('T')[0];
    switch (filter) {
      case 'Today': return list.filter(t => t.dueDate === today);
      case 'Completed': return list.filter(t => t.is_done === 1);
      default: return list;
    }
  }, [tasks, filter, searchQuery]);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar 
        tasks={tasks} stats={stats} 
        activeScreen={activeScreen} setActiveScreen={setActiveScreen} 
        filter={filter} setFilter={setFilter} 
      />

      <main className="flex-1 overflow-y-auto relative bg-[#F9FAFB]">
        {activeScreen === 'dashboard' ? (
          <Dashboard stats={stats} tasks={tasks} />
        ) : (
          <div className="p-8 max-w-5xl mx-auto">
             <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-extrabold">All Tasks</h2>
               <div className="flex items-center gap-3">
                 <div className="relative">
                   <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                   <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 border rounded-xl text-sm" />
                 </div>
                 <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"><Plus size={18} /> Add Task</button>
               </div>
             </div>
             <div className="space-y-3">
               {filteredTasks.map(task => (
                 <TaskItem key={task.id} task={task} onToggle={(id) => setTasks(prev => prev.map(t => t.id === id ? {...t, is_done: t.is_done ? 0 : 1} : t))} onDelete={(id) => setTasks(prev => prev.filter(t => t.id !== id))} />
               ))}
             </div>
          </div>
        )}
      </main>
    </div>
  );
}