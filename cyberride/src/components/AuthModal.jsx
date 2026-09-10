import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { playClick, playBeep, playSuccess } from '../utils/audioSynth';
import { ShieldCheck, User, Lock, Mail, Phone, X, LogIn, UserPlus, Check, Sparkles, ChevronRight } from 'lucide-react';

export const AuthModal = () => {
  const { isAuthOpen, setIsAuthOpen, login, signup, user, setIsAdminOpen } = useCart();
  const [authMode, setAuthMode] = useState('LOGIN'); // 'LOGIN' or 'SIGNUP'
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState('USER'); // 'USER' or 'ADMIN'
  const [signupSuccess, setSignupSuccess] = useState(false);

  if (!isAuthOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail || !loginPassword) {
      setLoginError('PLEASE FILL IN ALL REQUIRED CREDENTIALS.');
      return;
    }

    const result = login(loginEmail, loginPassword);
    if (result.success) {
      playSuccess();
      setIsAuthOpen(false);
      if (result.user.role === 'ADMIN') {
        setIsAdminOpen(true);
      }
    } else {
      setLoginError(result.message || 'INVALID RIDER CREDENTIALS.');
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword) return;

    const newRider = signup({
      name: signupName,
      email: signupEmail,
      phone: signupPhone || '+971 50 123 4567',
      password: signupPassword,
      role: signupRole
    });

    playSuccess();
    setSignupSuccess(true);
    setTimeout(() => {
      setIsAuthOpen(false);
      setSignupSuccess(false);
      if (newRider.role === 'ADMIN') {
        setIsAdminOpen(true);
      }
    }, 1200);
  };

  // Quick preset logins for instant testing
  const handleQuickDemoAdmin = () => {
    playBeep();
    setLoginEmail('admin@cyberride.ae');
    setLoginPassword('admin123');
    login('admin@cyberride.ae', 'admin123');
    setIsAuthOpen(false);
    setIsAdminOpen(true);
  };

  const handleQuickDemoUser = () => {
    playBeep();
    setLoginEmail('rider@cyberride.ae');
    setLoginPassword('rider123');
    login('rider@cyberride.ae', 'rider123');
    setIsAuthOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
      <div className="max-w-md w-full bg-[#0A0A0A] border-2 border-[#E10600]/50 rounded-2xl p-6 shadow-[0_0_50px_rgba(225,6,0,0.4)] relative overflow-hidden">
        
        {/* Neon Glow Header Bar */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FF1A1A] to-transparent" />

        {/* Close Button */}
        <button
          onClick={() => {
            playClick();
            setIsAuthOpen(false);
          }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-gray-400 hover:text-white hover:border-[#E10600] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#E10600]/40 text-xs font-mono text-[#FF1A1A] mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CYBERRIDE REGIONAL AUTH GATEWAY</span>
          </div>
          <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">
            {authMode === 'LOGIN' ? 'ACCESS RIDER NETWORK' : 'CREATE RIDER PROFILE'}
          </h3>
          <p className="text-xs font-sans text-gray-400 mt-1">
            {authMode === 'LOGIN'
              ? 'Sign in to access your orders, VIP status, and custom LED presets.'
              : 'Register your rider profile for express Dubai shipping and telemetry.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-[#141414] p-1.5 rounded-xl border border-[#2A2A2A] mb-6">
          <button
            onClick={() => {
              playClick();
              setAuthMode('LOGIN');
            }}
            className={`py-2 rounded-lg font-mono text-xs font-bold flex items-center justify-center gap-2 transition ${
              authMode === 'LOGIN'
                ? 'bg-[#E10600] text-white shadow-[0_0_15px_rgba(225,6,0,0.6)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>SIGN IN</span>
          </button>

          <button
            onClick={() => {
              playClick();
              setAuthMode('SIGNUP');
            }}
            className={`py-2 rounded-lg font-mono text-xs font-bold flex items-center justify-center gap-2 transition ${
              authMode === 'SIGNUP'
                ? 'bg-[#E10600] text-white shadow-[0_0_15px_rgba(225,6,0,0.6)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>SIGN UP</span>
          </button>
        </div>

        {/* TAB 1: LOGIN FORM */}
        {authMode === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-[10px] font-mono text-gray-400 uppercase mb-1 block">RIDER EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="rider@cyberride.ae"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#141414] border border-[#2A2A2A] text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#E10600]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-gray-400 uppercase mb-1 block">PASSCODE</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#141414] border border-[#2A2A2A] text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#E10600]"
                />
              </div>
            </div>

            {loginError && (
              <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-mono text-center">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="cyber-button-primary py-3.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 mt-2 shadow-[0_0_20px_rgba(225,6,0,0.5)] cursor-pointer"
            >
              <span>AUTHORIZE ACCESS</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Access Accelerator (Riders only) */}
            <div className="mt-4 pt-4 border-t border-[#1F1F1F] flex flex-col gap-2">
              <div className="text-[10px] font-mono text-gray-500 uppercase text-center">QUICK RIDER DEMO ACCESS</div>
              <button
                type="button"
                onClick={handleQuickDemoUser}
                className="w-full p-2.5 rounded-xl bg-[#141414] border border-[#2A2A2A] hover:border-emerald-500 transition group flex items-center justify-between cursor-pointer"
              >
                <div className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  <span>DEMO RIDER ACCOUNT</span>
                </div>
                <div className="text-[10px] font-mono text-gray-400">rider@cyberride.ae</div>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: SIGNUP FORM */}
        {authMode === 'SIGNUP' && (
          <form onSubmit={handleSignupSubmit} className="flex flex-col gap-3">
            <div>
              <label className="text-[10px] font-mono text-gray-400 uppercase mb-1 block">FULL NAME</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="Sheikh Rashid Al-Nuaimi"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141414] border border-[#2A2A2A] text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#E10600]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-gray-400 uppercase mb-1 block">EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="rashid@dubai.ae"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141414] border border-[#2A2A2A] text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#E10600]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-gray-400 uppercase mb-1 block">UAE MOBILE PHONE (+971)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  placeholder="+971 50 987 6543"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141414] border border-[#2A2A2A] text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#E10600]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-gray-400 uppercase mb-1 block">CREATE PASSWORD</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141414] border border-[#2A2A2A] text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#E10600]"
                />
              </div>
            </div>

            {signupSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-mono flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>RIDER PROFILE REGISTERED & LOGGED IN!</span>
              </div>
            )}

            <button
              type="submit"
              className="cyber-button-primary py-3.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 mt-2 shadow-[0_0_20px_rgba(225,6,0,0.5)] cursor-pointer"
            >
              <span>REGISTER RIDER PROFILE</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
