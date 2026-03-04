import React, { useState } from 'react';
import { X } from 'lucide-react';

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
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold">New Task</h2>
          <button onClick={onClose} className="text-gray-400 p-2 hover:bg-gray-100 rounded-xl">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <input 
            type="text" 
            placeholder="Task Title" 
            required 
            className="w-full p-3 border-2 border-gray-100 rounded-xl"
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
            <select 
              className="p-3 border-2 border-gray-100 rounded-xl text-sm"
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option>work</option><option>personal</option><option>study</option>
            </select>
            <input 
              type="date" 
              className="p-3 border-2 border-gray-100 rounded-xl text-sm"
              onChange={e => setFormData({...formData, due_date: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg">
            Save Task
          </button>
        </form>
      </div>
    </div>
  );
}