import React, { useState } from "react";
import Sidebar from "./layout/Sidebar"; 
import Dashboard from "./pages/Dashboard";
import TaskPage from "./pages/TaskPage";
import { useTasks } from "./hooks/useTasks";
import AddTaskModal from "./components/tasks/AddTaskModal";
import AuthPage from './pages/auth/AuthPage';

export default function App() {
  const [activeScreen, setActiveScreen] = useState('list');
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [user,setUser] = useState(null);

  if(!user){
    return <AuthPage onLogin={(userData)=>setUser(userData)}/>;
  }
  
  const { tasks, filteredTasks, stats, handleToggle, handleDelete, handleAdd } = useTasks(filter, searchQuery);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F9FAFB]">
      <Sidebar 
        tasks={tasks}
        stats={stats} 
        activeScreen={activeScreen} 
        setActiveScreen={setActiveScreen} 
        filter={filter} 
        setFilter={setFilter} 
      />

      <main className="flex-1 overflow-y-auto relative">
        {activeScreen === 'dashboard' ? (
          <Dashboard stats={stats} tasks={tasks} />
        ) : (
          <TaskPage 
            tasks={filteredTasks}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filter={filter}
            setFilter={setFilter}
            setShowModal={setShowModal}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
      </main>

      {showModal && (
        <AddTaskModal 
          onClose={() => setShowModal(false)} 
          onSave={handleAdd} 
        />
      )}
    </div>
  );
}