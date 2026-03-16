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

  const [activeScreen, setActiveScreen] = useState(
    () => localStorage.getItem("activeScreen") || "dashboard"
  );
  const [filter, setFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState(null); 
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);


  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Session expired");
        return res.json();
      })
      .then((data) => {
        const userData = data.user || (data.id ? data : null);
        setUser(userData);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

 
  const handleSetActiveScreen = (screen) => {
    localStorage.setItem("activeScreen", screen);
    setActiveScreen(screen);
    if (screen !== "tasks") {
      setCategoryFilter(null);
      setFilter("All");
    }
  };

  const handleSetDarkMode = (val) => {
    setDarkMode(val);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
      localStorage.removeItem("activeScreen");
      setActiveScreen("dashboard");
      setCategoryFilter(null);
      setFilter("All");
    }
  };

  const userId = user?.id;
  const {
    tasks,
    filteredTasks,
    stats,
    handleToggle,
    handleDelete,
    handleAdd,
    handleEdit,
  } = useTasks(filter, searchQuery, userId, categoryFilter); 

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-screen ${darkMode ? "bg-gray-900" : "bg-[#F9FAFB]"}`}>
        <div className={`text-lg font-medium animate-pulse ${darkMode ? "text-white" : "text-gray-500"}`}>
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
          handleSetActiveScreen("dashboard");
        }}
        darkMode={darkMode}
      />
    );
  }

  return (
    <div className={`flex h-screen w-full overflow-hidden ${darkMode ? "bg-gray-900 text-white" : "bg-[#F9FAFB] text-gray-900"}`}>

      <Sidebar
        user={user}
        onLogout={handleLogout}
        tasks={tasks}
        stats={stats}
        activeScreen={activeScreen}
        setActiveScreen={handleSetActiveScreen}
        filter={filter}
        setFilter={setFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        darkMode={darkMode}
        setDarkMode={handleSetDarkMode}
      />

      <main className={`flex-1 overflow-y-auto relative ${darkMode ? "bg-gray-900 text-white" : "bg-[#F9FAFB] text-gray-900"}`}>
        {activeScreen === "dashboard" ? (
          <Dashboard
            stats={stats}
            tasks={tasks}
            onToggle={handleToggle}
            setShowModal={setShowModal}
            user={user}
            darkMode={darkMode}
          />
        ) : activeScreen === "overview" ? (
          <Overview
            tasks={tasks}
            onToggle={handleToggle}
            darkMode={darkMode}
          />
        ) : activeScreen === "settings" ? (
          <Settings
            user={user}
            onLogout={handleLogout}
            setActiveScreen={handleSetActiveScreen}
            darkMode={darkMode}
            setDarkMode={handleSetDarkMode}
            onUpdateUser={(updatedUser) => setUser(updatedUser)}
          />
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
            onEdit={handleEdit}
            darkMode={darkMode}
            categoryFilter={categoryFilter}
          />
        )}
      </main>

      {showModal && (
        <AddTaskModal
          onClose={() => setShowModal(false)}
          onSave={handleAdd}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}