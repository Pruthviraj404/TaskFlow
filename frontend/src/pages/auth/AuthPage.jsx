import React, { useState } from 'react';

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin
      ? '/api/auth/login'
      : '/api/auth/signup';

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // Fix: Normalize data. 
        // If it's Login, user is in data.user. 
        // If it's Signup, it might be the flat object.
        const userToSet = data.user || data;
        onLogin(userToSet);
      } else {
        alert(data.error || "Authentication failed");
      }
    } catch (err) {
      alert("Server connection failed. Is the backend running?");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-4 font-sans">
      <div className="bg-white w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl shadow-blue-100/50 border border-gray-50 animate-in fade-in zoom-in duration-300">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">TaskFlow</h1>
          <p className="text-gray-400 font-medium">
            {isLogin
              ? "Welcome back! Access your dashboard."
              : "Create an account to stay organized."
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Full Name</label>
              <input
                type="text"
                placeholder="Ajay Patil"
                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Email Address</label>
            <input
              type="email"
              placeholder="ajay@example.com"
              className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] mt-2"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-50 text-center">
          <p className="text-sm text-gray-500 font-medium">
            {isLogin ? "New to TaskFlow?" : "Already a member?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 font-extrabold ml-2 hover:underline"
            >
              {isLogin ? "Create an Account" : "Sign In instead"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}