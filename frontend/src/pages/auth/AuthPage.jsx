import React, { useState } from 'react';
import { Mail, Loader2, ArrowLeft, KeyRound, Eye, EyeOff } from 'lucide-react';

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otp, setOtp] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [formData, setFormData] = useState({
    name: '', email: '', password: ''
  });

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (error) setError('');
  };

  const resetAll = () => {
    setStep(1);
    setOtp('');
    setError('');
    setSuccess('');
    setNewPassword('');
    setConfirmPassword('');
    setFormData({ name: '', email: '', password: '' });
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      onLogin(data.user || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleSendOTP = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  
  const handleVerifySignupOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP');
      setStep(3); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...formData, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      onLogin(data.user || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtpLoading(true);
    setError('');
    setOtp('');
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
    } catch (err) {
      setError(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleForgotSendOTP = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStep(2);
      setSuccess('OTP sent! Check your inbox.');
    } catch (err) {
      setError(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  
  const handleVerifyResetOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP');
      setSuccess('');
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess('Password reset successfully!');
      setTimeout(() => {
        setIsForgot(false);
        setIsLogin(true);
        resetAll();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotResendOTP = async () => {
    setOtpLoading(true);
    setError('');
    setOtp('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess('OTP resent!');
    } catch (err) {
      setError(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setIsForgot(false);
    resetAll();
  };

  const getSubtitle = () => {
    if (isForgot) {
      if (step === 1) return "Enter your email to reset password.";
      if (step === 2) return "Enter the OTP sent to your email.";
      return "Set your new password.";
    }
    if (isLogin) return "Welcome back! Access your dashboard.";
    if (step === 1) return "Enter your email to get started.";
    if (step === 2) return "Enter the OTP sent to your email.";
    return "Almost done! Set up your account.";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-4 font-sans">
      <div className="bg-white w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl shadow-blue-100/50 border border-gray-50 animate-in fade-in zoom-in duration-300">

    
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">TaskFlow</h1>
          <p className="text-gray-400 font-medium">{getSubtitle()}</p>
        </div>

        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold">
            {error}
          </div>
        )}

    
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-100 rounded-2xl text-green-600 text-xs font-bold">
            {success}
          </div>
        )}

      
        {isLogin && !isForgot && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Email Address</label>
              <input type="email" placeholder="ajay@example.com" value={formData.email} required
                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all"
                onChange={(e) => handleChange(e, 'email')} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Password</label>
              <input type="password" placeholder="••••••••" value={formData.password} required
                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all"
                onChange={(e) => handleChange(e, 'password')} />
            </div>
            <div className="text-right">
              <button type="button"
                onClick={() => { setIsForgot(true); setIsLogin(false); resetAll(); }}
                className="text-sm text-blue-500 hover:text-blue-700 font-bold">
                Forgot password?
              </button>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <Loader2 size={18} className="animate-spin" /> : "Sign In"}
            </button>
          </form>
        )}

       
        {!isLogin && !isForgot && step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Email Address</label>
              <input type="email" placeholder="ajay@example.com" value={formData.email} required
                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all"
                onChange={(e) => handleChange(e, 'email')} />
            </div>
            <button type="submit" disabled={otpLoading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60">
              {otpLoading
                ? <><Loader2 size={18} className="animate-spin" /> Sending OTP...</>
                : <><Mail size={18} /> Send Verification OTP</>}
            </button>
          </form>
        )}

       
        {!isLogin && !isForgot && step === 2 && (
          <form onSubmit={handleVerifySignupOTP} className="space-y-5">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
              <Mail size={18} className="text-blue-500 shrink-0" />
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase">OTP sent to</p>
                <p className="text-sm font-bold text-gray-800">{formData.email}</p>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Enter 6-digit OTP</label>
              <input type="text" inputMode="numeric" maxLength={6} placeholder="••••••" value={otp} required
                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all text-center text-2xl font-black tracking-[0.5em]"
                onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); if (error) setError(''); }} />
            </div>
            <button type="submit" disabled={loading || otp.length !== 6}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60">
              {loading
                ? <><Loader2 size={18} className="animate-spin" /> Verifying...</>
                : "Verify Email"}
            </button>
            <div className="flex items-center justify-between pt-1">
              <button type="button" onClick={() => { setStep(1); setOtp(''); setError(''); }}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 font-bold">
                <ArrowLeft size={14} /> Change email
              </button>
              <button type="button" onClick={handleResendOTP} disabled={otpLoading}
                className="text-sm text-blue-500 hover:text-blue-700 font-bold disabled:opacity-50">
                {otpLoading ? 'Sending...' : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}

        
        {!isLogin && !isForgot && step === 3 && (
          <form onSubmit={handleSignup} className="space-y-5">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl">
              <KeyRound size={18} className="text-green-500 shrink-0" />
              <p className="text-sm font-bold text-gray-700">
                Email verified! Complete your account.
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Full Name</label>
              <input type="text" placeholder="Ajay Patil" value={formData.name} required
                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all"
                onChange={(e) => handleChange(e, 'name')} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  required
                  minLength={8}
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all pr-12"
                  onChange={(e) => handleChange(e, 'password')}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60">
              {loading
                ? <><Loader2 size={18} className="animate-spin" /> Creating Account...</>
                : "Create Account →"}
            </button>
          </form>
        )}

       
        {isForgot && step === 1 && (
          <form onSubmit={handleForgotSendOTP} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Registered Email</label>
              <input type="email" placeholder="ajay@example.com" value={formData.email} required
                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all"
                onChange={(e) => handleChange(e, 'email')} />
            </div>
            <button type="submit" disabled={otpLoading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60">
              {otpLoading
                ? <><Loader2 size={18} className="animate-spin" /> Sending...</>
                : <><Mail size={18} /> Send Reset OTP</>}
            </button>
            <button type="button" onClick={() => { setIsForgot(false); setIsLogin(true); resetAll(); }}
              className="w-full flex items-center justify-center gap-1 text-sm text-gray-400 hover:text-gray-600 font-bold">
              <ArrowLeft size={14} /> Back to Login
            </button>
          </form>
        )}

       
        {isForgot && step === 2 && (
          <form onSubmit={handleVerifyResetOTP} className="space-y-5">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
              <Mail size={18} className="text-blue-500 shrink-0" />
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase">OTP sent to</p>
                <p className="text-sm font-bold text-gray-800">{formData.email}</p>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Enter 6-digit OTP</label>
              <input type="text" inputMode="numeric" maxLength={6} placeholder="••••••" value={otp} required
                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all text-center text-2xl font-black tracking-[0.5em]"
                onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); if (error) setError(''); }} />
            </div>
            <button type="submit" disabled={loading || otp.length !== 6}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60">
              {loading
                ? <><Loader2 size={18} className="animate-spin" /> Verifying...</>
                : "Verify OTP"}
            </button>
            <div className="flex items-center justify-between pt-1">
              <button type="button" onClick={() => { setStep(1); setOtp(''); setError(''); }}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 font-bold">
                <ArrowLeft size={14} /> Change email
              </button>
              <button type="button" onClick={handleForgotResendOTP} disabled={otpLoading}
                className="text-sm text-blue-500 hover:text-blue-700 font-bold disabled:opacity-50">
                {otpLoading ? 'Sending...' : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}

        
        {isForgot && step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl">
              <KeyRound size={18} className="text-green-500 shrink-0" />
              <p className="text-sm font-bold text-gray-700">OTP verified! Set your new password.</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1 uppercase">New Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} placeholder="••••••••" value={newPassword}
                  required minLength={8}
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all pr-12"
                  onChange={(e) => { setNewPassword(e.target.value); if (error) setError(''); }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Confirm Password</label>
              <input type={showPass ? "text" : "password"} placeholder="••••••••" value={confirmPassword} required
                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all"
                onChange={(e) => { setConfirmPassword(e.target.value); if (error) setError(''); }} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60">
              {loading
                ? <><Loader2 size={18} className="animate-spin" /> Resetting...</>
                : "Reset Password"}
            </button>
          </form>
        )}

     
        {!isForgot && (
          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-sm text-gray-500 font-medium">
              {isLogin ? "New to TaskFlow?" : "Already a member?"}
              <button onClick={switchMode} className="text-blue-600 font-extrabold ml-2 hover:underline">
                {isLogin ? "Create an Account" : "Sign In instead"}
              </button>
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
