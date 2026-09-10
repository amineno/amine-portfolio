import React from 'react';
import { Lock, X, ShieldAlert } from 'lucide-react';
import { playClick } from '../utils/audioSynth';

export const PrivacyPolicy = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto animate-fadeIn select-none">
      <div className="w-full max-w-3xl bg-[#0A0A0A] border-2 border-[#E10600]/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(225,6,0,0.3)] relative text-white max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Lock className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-wider text-white">
                PRIVACY POLICY (UAE PDPL COMPLIANT)
              </h3>
              <p className="text-[10px] font-mono text-gray-400">DATA PROTECTION REGULATION • CYBERRIDE UAE</p>
            </div>
          </div>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-gray-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 font-mono text-xs text-gray-300">
          
          <div className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A]">
            <strong className="text-emerald-400 font-bold block mb-1">1. UAE PERSONAL DATA PROTECTION LAW (PDPL)</strong>
            CyberRide FZ-LLC adheres strictly to UAE Federal Decree-Law No. 45 of 2021 regarding Personal Data Protection. We collect and process personal data solely for processing your orders, delivering packages via Aramex, and providing app synchronization.
          </div>

          <div className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A]">
            <strong className="text-white font-bold block mb-1">2. DATA WE COLLECT</strong>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li><strong>Personal Identifiers:</strong> Name, email address, mobile phone (+971 format).</li>
              <li><strong>Delivery Information:</strong> Physical street address, Emirate, building name.</li>
              <li><strong>Payment Telemetry:</strong> Tokenized gateway references (Stripe, Telr, Tabby). Raw credit card data is NEVER stored on our servers.</li>
              <li><strong>Bluetooth App Metrics:</strong> Active LED matrix pattern presets and display firmware sync status.</li>
            </ul>
          </div>

          <div className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A]">
            <strong className="text-white font-bold block mb-1">3. DATA RETENTION & SECURITY (5 YEARS)</strong>
            In compliance with UAE Federal Tax Authority (FTA) laws, invoice and transaction data are retained securely in encrypted PostgreSQL storage for 5 years. All web traffic is encrypted via TLS 1.3 / SSL.
          </div>

          <div className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A]">
            <strong className="text-white font-bold block mb-1">4. YOUR RIGHTS UNDER UAE LAW</strong>
            You have the right to request access to your stored personal data, request correction of details, or request account deletion by emailing <span className="text-[#FF1A1A]">privacy@cyberride.ae</span>.
          </div>

        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-[#2A2A2A] flex justify-end">
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="cyber-button-primary px-6 py-2.5 rounded-xl text-xs font-mono font-bold cursor-pointer"
          >
            ACCEPT PRIVACY POLICY
          </button>
        </div>

      </div>
    </div>
  );
};
