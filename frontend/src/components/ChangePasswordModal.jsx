import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, X, Loader2 } from 'lucide-react';
import * as TaskService from '../services/TaskService';

export default function ChangePasswordModal({ onClose, dark }) {
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ current: '', new: '', confirm: '' });

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.new.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (formData.new !== formData.confirm) {
      setError("New passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      await TaskService.changePassword({
        currentPassword: formData.current,
        newPassword: formData.new
      });

      alert("Success! Password has been changed.");
      onClose();

    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md">
      <div className={`w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border ${
        dark
          ? 'bg-gray-900 border-gray-700'
          : 'bg-white border-gray-100'
      }`}>

       
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${dark ? 'bg-blue-900 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              <ShieldCheck size={20} />
            </div>
            <h2 className={`text-xl font-black ${dark ? 'text-white' : 'text-gray-900'}`}>
              Security
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`p-2 rounded-full transition-colors ${
              dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-400 hover:bg-gray-100'
            }`}
          >
            <X size={20} />
          </button>
        </div>


        {error && (
          <div className={`mb-4 p-4 rounded-2xl text-xs font-bold border ${
            dark
              ? 'bg-red-900/30 border-red-700 text-red-400'
              : 'bg-red-50 border-red-100 text-red-600'
          }`}>
            {error}
          </div>
        )}

    
        <form onSubmit={handleSubmit} className="space-y-4">

    
          <input
            type={showPass ? "text" : "password"}
            placeholder="Current Password"
            value={formData.current}
            onChange={(e) => handleChange(e, "current")}
            required
            className={`w-full rounded-xl p-3 border focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              dark
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                : 'bg-white border-gray-200 text-black'
            }`}
          />

        
          <input
            type={showPass ? "text" : "password"}
            placeholder="New Password"
            value={formData.new}
            onChange={(e) => handleChange(e, "new")}
            required
            className={`w-full rounded-xl p-3 border focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              dark
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                : 'bg-white border-gray-200 text-black'
            }`}
          />

          <input
            type={showPass ? "text" : "password"}
            placeholder="Confirm New Password"
            value={formData.confirm}
            onChange={(e) => handleChange(e, "confirm")}
            required
            className={`w-full rounded-xl p-3 border focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              dark
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                : 'bg-white border-gray-200 text-black'
            }`}
          />

    
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className={`flex items-center gap-2 text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            {showPass ? "Hide Passwords" : "Show Passwords"}
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Change Password"}
          </button>

        </form>
      </div>
    </div>
  );
}