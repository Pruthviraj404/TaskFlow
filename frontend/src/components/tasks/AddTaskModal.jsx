import React, { useState } from 'react';
import { X, Calendar, Briefcase, User, GraduationCap } from 'lucide-react';

export default function AddTaskModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'work',
    priority: 'medium',
    due_date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">New Task</h2>
          <button onClick={onClose} className="text-gray-400 p-2 hover:bg-white hover:text-gray-600 rounded-xl transition-all border border-transparent hover:border-gray-100">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 ml-1">Task Title <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              placeholder="e.g., Fix login bug in backend API" 
              required 
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all"
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 ml-1">Description</label>
            <textarea 
              placeholder="Add more details about this task..." 
              rows="3"
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Category & Date Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 ml-1">Category</label>
              <select 
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm appearance-none cursor-pointer"
                onChange={e => setFormData({...formData, category: e.target.value})}
                value={formData.category}
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="study">Study</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 ml-1">Due Date</label>
              <input 
                type="date" 
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm cursor-pointer"
                onChange={e => setFormData({...formData, due_date: e.target.value})}
                value={formData.due_date}
              />
            </div>
          </div>

          {/* Priority Selector */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Priority</label>
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
                      : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'}`}
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

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all"
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