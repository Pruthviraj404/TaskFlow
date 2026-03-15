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
  // --- State ---
  const [activeScreen, setActiveScreen] = useState("dashboard");
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dark mode state with localStorage persistence
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  // Save darkMode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // --- Authentication Lifecycle ---
  useEffect(() => {
    fetch("http://localhost:5000/api/auth/me", { credentials: "include" })
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

  // --- Task Logic Hook ---
  const userId = user?.id;
  const {
    tasks,
    filteredTasks,
    stats,
    handleToggle,
    handleDelete,
    handleAdd,
    handleEdit, // Added
  } = useTasks(filter, searchQuery, userId);

  // --- Loading Screen ---
  if (loading) {
    return (
      <div
        className={`flex items-center justify-center h-screen ${
          darkMode ? "bg-gray-900" : "bg-[#F9FAFB]"
        }`}
      >
        <div
          className={`text-lg font-medium animate-pulse ${
            darkMode ? "text-white" : "text-gray-500"
          }`}
        >
          Loading TaskFlow...
        </div>
      </div>
    );
  }

  // --- Auth Guard ---
  if (!user) {
    return (
      <AuthPage
        onLogin={(data) => {
          setUser(data.user || data);
          setActiveScreen("dashboard");
        }}
        darkMode={darkMode} // optional: for styling in AuthPage
      />
    );
  }

  // --- Main Render ---
  return (
    <div
      className={`flex h-screen w-full overflow-hidden ${
        darkMode ? "bg-gray-900 text-white" : "bg-[#F9FAFB] text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <Sidebar
        user={user}
        onLogout={handleLogout}
        tasks={tasks}
        stats={stats}
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        filter={filter}
        setFilter={setFilter}
        darkMode={darkMode}
        setDarkMode={setDarkMode} // toggle switch
      />

      {/* Main Content */}
      <main
        className={`flex-1 overflow-y-auto relative ${
          darkMode ? "bg-gray-900 text-white" : "bg-[#F9FAFB] text-gray-900"
        }`}
      >
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
          <Overview tasks={tasks} onToggle={handleToggle} darkMode={darkMode} />
        ) : activeScreen === "settings" ? (
          <Settings
            user={user}
            onLogout={handleLogout}
            setActiveScreen={setActiveScreen}
            darkMode={darkMode}
            setDarkMode={setDarkMode} // toggle from settings
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
            onEdit={handleEdit} // passed to TaskPage
            darkMode={darkMode}
          />
        )}
      </main>

      {/* Add Task Modal */}
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