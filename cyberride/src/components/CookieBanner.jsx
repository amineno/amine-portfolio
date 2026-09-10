import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Check } from 'lucide-react';
import { playClick } from '../utils/audioSynth';

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cyberride_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    playClick();
    localStorage.setItem('cyberride_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    playClick();
    localStorage.setItem('cyberride_cookie_consent', 'essential_only');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-lg z-50 bg-[#0A0A0A]/95 border-2 border-[#E10600]/60 rounded-2xl p-5 shadow-[0_0_40px_rgba(225,6,0,0.4)] backdrop-blur-xl animate-fadeIn text-white font-mono text-xs select-none">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#E10600]/20 border border-[#E10600] flex items-center justify-center text-[#FF1A1A] shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="font-display font-bold text-sm text-white uppercase tracking-wider">
            SECURITY & COOKIE TELEMETRY
          </div>
          <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
            We use essential cookies to maintain cart telemetry, secure login sessions, and optimize Dubai express delivery services in compliance with UAE PDPL regulations.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleAccept}
              className="cyber-button-primary px-4 py-2 rounded-xl text-[10px] font-bold flex items-center gap-1 cursor-pointer shadow-[0_0_15px_rgba(225,6,0,0.5)]"
            >
              <Check className="w-3.5 h-3.5" />
              <span>ACCEPT ALL COOKIES</span>
            </button>
            <button
              onClick={handleDecline}
              className="px-3 py-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-gray-400 hover:text-white text-[10px] transition cursor-pointer"
            >
              ESSENTIAL ONLY
            </button>
          </div>
        </div>
        <button
          onClick={handleDecline}
          className="text-gray-500 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
