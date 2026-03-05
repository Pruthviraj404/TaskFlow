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
  const [user, setUser] = useState(null);

  // 1. Move the hook call AFTER the user check logic if you want to be safe, 
  // or pass the user ID as a dependency.
  const userId = user?.id;
  const { tasks, filteredTasks, stats, handleToggle, handleDelete, handleAdd } = useTasks(filter, searchQuery, userId);

  if (!user) {
    return <AuthPage onLogin={(userData) => setUser(userData)} />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F9FAFB]">
      <Sidebar 
        user={user} // 2. Pass the user object to show their name/profile
        onLogout={() => setUser(null)} // 3. Add a logout function
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