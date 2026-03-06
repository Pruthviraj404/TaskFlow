import React, { useState, useEffect } from "react";
import Sidebar from "./layout/Sidebar"; 
import Dashboard from "./pages/Dashboard";
import TaskPage from "./pages/TaskPage";
import { useTasks } from "./hooks/useTasks";
import AddTaskModal from "./components/tasks/AddTaskModal";
import AuthPage from "./pages/auth/AuthPage";

export default function App() {
  // Set default screen to "dashboard" for a better first impression
  const [activeScreen, setActiveScreen] = useState("dashboard");
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    fetch("http://localhost:5000/api/auth/me", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        // Fix: Since your API returns a flat object like {"id":2, "name":"Ajay"...}
        if (data && data.id) {
          setUser(data);
        } else {
          setUser(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  // Logout handler that clears backend cookies and local state
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setUser(null);
        setActiveScreen("dashboard"); // Reset for next user
      }
    } catch (err) {
      console.error("Logout failed:", err);
      setUser(null); // Fallback to local logout
    }
  };

  const userId = user?.id;

  const { tasks, filteredTasks, stats, handleToggle, handleDelete, handleAdd } =
    useTasks(filter, searchQuery, userId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F9FAFB]">
        <div className="text-gray-500 font-medium animate-pulse text-lg">
          Loading TaskFlow...
        </div>
      </div>
    );
  }

  // Redirect logic: If no user, show AuthPage
  if (!user) {
    return (
      <AuthPage 
        onLogin={(userData) => {
          setUser(userData);
          setActiveScreen("dashboard"); // Force dashboard view on login
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

      <main className="flex-1 overflow-y-auto relative">
        {activeScreen === "dashboard" ? (
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