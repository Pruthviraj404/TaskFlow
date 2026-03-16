import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddTaskModal({ onClose, onSave, darkMode }) {

  const now = new Date();
  const todayLocal = now.toLocaleDateString('en-CA');
  const currentTime = now.toTimeString().slice(0, 5);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'work',
    priority: 'medium',
    due_date: todayLocal,
    due_time: '', 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const isToday = formData.due_date === todayLocal;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${
        darkMode ? 'bg-gray-900' : 'bg-white'
      }`}>

  
        <div className={`p-6 border-b flex items-center justify-between ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50/50 border-gray-100'
        }`}>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            New Task
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all border ${
              darkMode
                ? 'text-gray-400 hover:bg-gray-700 hover:text-white border-transparent hover:border-gray-600'
                : 'text-gray-400 hover:bg-white hover:text-gray-600 border-transparent hover:border-gray-100'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">

          <div className="space-y-1">
            <label className={`text-sm font-bold ml-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Fix login bug in backend API"
              required
              className={`w-full p-4 border-2 rounded-2xl outline-none focus:border-blue-500 transition-all ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:bg-gray-800'
                  : 'bg-gray-50 border-gray-100 text-black focus:bg-white'
              }`}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

    
          <div className="space-y-1">
            <label className={`text-sm font-bold ml-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Description
            </label>
            <textarea
              placeholder="Add more details about this task..."
              rows="3"
              className={`w-full p-4 border-2 rounded-2xl outline-none focus:border-blue-500 transition-all resize-none ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:bg-gray-800'
                  : 'bg-gray-50 border-gray-100 text-black focus:bg-white'
              }`}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

         
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={`text-sm font-bold ml-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Category
              </label>
              <select
                className={`w-full p-4 border-2 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm appearance-none cursor-pointer ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-gray-50 border-gray-100 text-black focus:bg-white'
                }`}
                onChange={e => setFormData({...formData, category: e.target.value})}
                value={formData.category}
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="study">Study</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className={`text-sm font-bold ml-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Due Date
              </label>
              <input
                type="date"
                min={todayLocal}
                value={formData.due_date}
                className={`w-full p-4 border-2 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm cursor-pointer ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-gray-50 border-gray-100 text-black focus:bg-white'
                }`}
                onChange={e => setFormData({...formData, due_date: e.target.value})}
              />
            </div>
          </div>

       
          <div className="space-y-1">
            <div className="flex items-center justify-between ml-1">
              <label className={`text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Due Time
              </label>
           
              {formData.due_time ? (
                <button
                  type="button"
                  onClick={() => setFormData({...formData, due_time: ''})}
                  className="text-xs text-red-400 hover:text-red-600 font-bold"
                >
                  Clear time
                </button>
              ) : (
                <span className="text-xs text-gray-400">Optional</span>
              )}
            </div>
            <input
              type="time"
              value={formData.due_time}
              min={isToday && formData.due_time ? currentTime : undefined}
              placeholder="--:--"
              className={`w-full p-4 border-2 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm cursor-pointer ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-gray-50 border-gray-100 text-black focus:bg-white'
              } ${!formData.due_time ? 'text-gray-400' : ''}`}
              onChange={e => setFormData({...formData, due_time: e.target.value})}
            />
          </div>

       
          <div className="space-y-2">
            <label className={`text-sm font-bold ml-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Priority
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['low', 'medium', 'high'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({...formData, priority: p})}
                  className={`py-3 px-2 rounded-xl border-2 font-bold text-xs uppercase tracking-wider transition-all
                    ${formData.priority === p
                      ? p === 'high' ? 'bg-red-50 border-red-500 text-red-600' :
                        p === 'medium' ? 'bg-amber-50 border-amber-500 text-amber-600' :
                        'bg-emerald-50 border-emerald-500 text-emerald-600'
                      : darkMode
                        ? 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                        : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'
                    }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      p === 'high' ? 'bg-red-500' : p === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
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
                darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all"
            >
              Save Task →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}