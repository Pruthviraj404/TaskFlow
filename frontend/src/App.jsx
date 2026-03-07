import React, { useState, useEffect } from "react";
import Sidebar from "./layout/Sidebar"; 
import Dashboard from "./pages/Dashboard";
import TaskPage from "./pages/TaskPage";
import Overview from "./pages/Overview"; 
import Settings from "./pages/Settings";
import { useTasks } from "./hooks/useTasks";
import AddTaskModal from "./components/tasks/AddTaskModal";
import AuthPage from "./pages/auth/AuthPage";

export default function App() {
  const [activeScreen, setActiveScreen] = useState("dashboard");
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Authentication Lifecycle
  useEffect(() => {
    fetch("http://localhost:5000/api/auth/me", {
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) throw new Error("Session expired");
        return res.json();
      })
      .then(data => {
        const userData = data.user || (data.id ? data : null);
        setUser(userData);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
      setActiveScreen("dashboard");
    }
  };

  // 2. Task Logic Hook
  const userId = user?.id;
  const { tasks, filteredTasks, stats, handleToggle, handleDelete, handleAdd } =
    useTasks(filter, searchQuery, userId);

  // 3. Conditional Rendering Guards
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F9FAFB]">
        <div className="text-gray-500 font-medium animate-pulse text-lg">
          Loading TaskFlow...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthPage 
        onLogin={(data) => {
          setUser(data.user || data);
          setActiveScreen("dashboard");
        }} 
      />
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F9FAFB]">
      <Sidebar
        user={user}
        onLogout={handleLogout}
        tasks={tasks}
        stats={stats}
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        filter={filter}
        setFilter={setFilter}
      />
      
      <main className="flex-1 overflow-y-auto relative bg-[#F9FAFB]">
        {/* Screen 04: Overview Dashboard */}
        {activeScreen === "dashboard" ? (
          <Dashboard 
            stats={stats} 
            tasks={tasks} 
            onToggle={handleToggle} 
            setShowModal={setShowModal} 
          />
        ) 
        /* Figure 3: Categories Expandable View */
        : activeScreen === "overview" ? (
          <Overview 
            tasks={tasks} 
            onToggle={handleToggle} 
          />
        ) 
        /* Screen 05: Profile & Settings */
        : activeScreen === "settings" ? (
          <Settings 
            user={user} 
            onLogout={handleLogout} 
            setActiveScreen={setActiveScreen} 
          />
        ) 
        /* Task List View (All, Today, Completed, Category Filters) */
        : (
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