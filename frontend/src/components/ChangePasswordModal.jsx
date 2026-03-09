import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, X, Loader2 } from 'lucide-react';
import * as TaskService from '../services/TaskService'; /

export default function ChangePasswordModal({ onClose }) {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
        
     
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-xl font-black text-gray-900">Security</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

    
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Current Password</label>
            <div className="relative">
              <input 
                type={showPass ? "text" : "password"}
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                placeholder="••••••••"
                required
                disabled={isLoading}
                onChange={(e) => handleChange(e, 'current')}
              />
              <button 
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-4 text-gray-300 hover:text-blue-500 transition-colors"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">New Password</label>
            <input 
              type="password"
              className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all outline-none"
              placeholder="Min. 8 characters"
              required
              disabled={isLoading}
              onChange={(e) => handleChange(e, 'new')}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Confirm New Password</label>
            <input 
              type="password"
              className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all outline-none"
              placeholder="Repeat new password"
              required
              disabled={isLoading}
              onChange={(e) => handleChange(e, 'confirm')}
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black mt-4 shadow-lg shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all disabled:bg-blue-400 disabled:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}