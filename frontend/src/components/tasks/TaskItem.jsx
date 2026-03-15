import React, { useState } from "react";
import {
  CheckCircle2,
  Calendar,
  Clock,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  AlignLeft,
  Pencil,
  X,
} from "lucide-react";
import TaskBadge from "./TaskBadge";

function EditTaskModal({ task, onClose, onSave, darkMode }) {
  const todayLocal = new Date().toLocaleDateString('en-CA');
  const currentTime = new Date().toTimeString().slice(0, 5);

  const [formData, setFormData] = useState({
    title: task.title || "",
    description: task.description || "",
    category: task.category || "work",
    priority: task.priority || "medium",
    due_date: task.due_date || "",
    due_time: task.due_time || "",
  });

  const isToday = formData.due_date === todayLocal;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}>

        <div className={`p-6 border-b flex items-center justify-between ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50/50 border-gray-100"
        }`}>
          <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
            Edit Task
          </h2>
          <button onClick={onClose} className={`p-2 rounded-xl transition-all border ${
            darkMode
              ? "text-gray-400 hover:bg-gray-700 hover:text-white border-transparent hover:border-gray-600"
              : "text-gray-400 hover:bg-white hover:text-gray-600 border-transparent hover:border-gray-100"
          }`}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">

          <div className="space-y-1">
            <label className={`text-sm font-bold ml-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              className={`w-full p-4 border-2 rounded-2xl outline-none focus:border-blue-500 transition-all ${
                darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-100 text-black focus:bg-white"
              }`}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className={`text-sm font-bold ml-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Description
            </label>
            <textarea
              rows="3"
              value={formData.description}
              className={`w-full p-4 border-2 rounded-2xl outline-none focus:border-blue-500 transition-all resize-none ${
                darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-100 text-black focus:bg-white"
              }`}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={`text-sm font-bold ml-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Category
              </label>
              <select
                value={formData.category}
                className={`w-full p-4 border-2 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm appearance-none cursor-pointer ${
                  darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-100 text-black focus:bg-white"
                }`}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="study">Study</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className={`text-sm font-bold ml-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Due Date
              </label>
              <input
                type="date"
                min={todayLocal}
                value={formData.due_date}
                className={`w-full p-4 border-2 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm cursor-pointer ${
                  darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-100 text-black focus:bg-white"
                }`}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
          </div>

          {/* Due Time */}
          <div className="space-y-1">
            <label className={`text-sm font-bold ml-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Due Time
            </label>
            <input
              type="time"
              value={formData.due_time}
              min={isToday ? currentTime : undefined}
              className={`w-full p-4 border-2 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm cursor-pointer ${
                darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-100 text-black focus:bg-white"
              }`}
              onChange={(e) => setFormData({ ...formData, due_time: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-bold ml-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Priority
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["low", "medium", "high"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: p })}
                  className={`py-3 px-2 rounded-xl border-2 font-bold text-xs uppercase tracking-wider transition-all
                    ${formData.priority === p
                      ? p === "high" ? "bg-red-50 border-red-500 text-red-600"
                        : p === "medium" ? "bg-amber-50 border-amber-500 text-amber-600"
                        : "bg-emerald-50 border-emerald-500 text-emerald-600"
                      : darkMode
                        ? "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"
                        : "bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200"
                    }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      p === "high" ? "bg-red-500" : p === "medium" ? "bg-amber-500" : "bg-emerald-500"
                    }`} />
                    {p}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-4 font-bold rounded-2xl transition-all ${
                darkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all"
            >
              Save Changes →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TaskItem({ task, onToggle, onDelete, onEdit, darkMode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const isOverdue =
    task.due_date && new Date(task.due_date) < new Date() && !task.is_done;

  // ✅ Format 24hr to 12hr AM/PM
  const formatTime = (time) => {
    if (!time) return null;
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  };

  const handleSaveEdit = async (formData) => {
    await onEdit(task.id, formData);
    setShowEditModal(false);
  };

  return (
    <>
      <div className="flex flex-col mb-3">

        {/* Main Task Row */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-4 p-4 rounded-xl border shadow-sm hover:shadow-md transition-all group cursor-pointer
            ${darkMode ? "bg-gray-900 border-gray-800 hover:bg-gray-800" : "bg-white border-gray-100 hover:border-gray-200"}
            ${task.is_done ? "opacity-60" : ""}
            ${isExpanded ? "rounded-b-none border-b-transparent shadow-none" : ""}
          `}
        >
          {/* Checkbox */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggle(task.id); }}
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
              task.is_done ? "bg-emerald-500 border-emerald-500 text-white" : "border-gray-300 hover:border-blue-400"
            }`}
          >
            {task.is_done === 1 && <CheckCircle2 size={14} strokeWidth={3} />}
          </button>

          {/* Priority Dot */}
          <div className={`w-2 h-2 rounded-full shrink-0 ${
            task.priority?.toLowerCase() === "high" ? "bg-red-500"
              : task.priority?.toLowerCase() === "medium" ? "bg-amber-500"
              : "bg-emerald-500"
          }`} />

          {/* Task Title */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-[13px] font-bold truncate ${
              task.is_done ? "line-through text-gray-400" : darkMode ? "text-white" : "text-[#111827]"
            }`}>
              {task.title}
            </h3>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 shrink-0">
            <TaskBadge category={task.category} />

            {/* ✅ Date + Time */}
            <div className={`flex items-center gap-1 text-xs font-bold ${
              isOverdue ? "text-red-500" : darkMode ? "text-gray-400" : "text-gray-500"
            }`}>
              <Calendar size={14} />
              <span>{task.due_date}</span>
              {task.due_time && (
                <>
                  <Clock size={12} className="ml-1" />
                  <span>{formatTime(task.due_time)}</span>
                </>
              )}
            </div>

            <div className={`text-xs font-bold capitalize px-2 py-0.5 rounded-md ${
              task.priority === "high" ? "bg-red-100 text-red-600"
                : task.priority === "medium" ? "bg-yellow-100 text-yellow-600"
                : "bg-green-100 text-green-600"
            }`}>
              {task.priority || "normal"}
            </div>

            <ChevronDown size={16} className={`transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            } ${darkMode ? "text-gray-500" : "text-gray-300"}`} />
          </div>
        </div>

        {/* Expandable Section */}
        {isExpanded && (
          <div className={`border border-t-0 rounded-b-xl p-4 pt-0 shadow-sm animate-in slide-in-from-top-2 duration-200 ${
            darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
          }`}>
            <div className={`h-[1px] w-full mb-4 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`} />

            <div className="space-y-4">

              {/* ✅ Due date + time row */}
              <div className="flex gap-3">
                <Clock size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                    Due
                  </p>
                  <p className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {task.due_date || "No date"}
                    {task.due_time ? ` at ${formatTime(task.due_time)}` : ""}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="flex gap-3">
                <AlignLeft size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                    Description
                  </p>
                  <p className={`text-sm leading-relaxed font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {task.description || "No description provided for this task."}
                  </p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowEditModal(true); }}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Pencil size={14} /> Edit Task
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={14} /> Delete Task
                </button>
                <button className={`p-1.5 rounded-lg transition-colors ${
                  darkMode ? "text-gray-400 hover:bg-gray-800" : "text-gray-400 hover:bg-gray-50"
                }`}>
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditTaskModal
          task={task}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
          darkMode={darkMode}
        />
      )}
    </>
  );
}