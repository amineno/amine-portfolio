import React from 'react';
import { ShieldCheck, X, FileText } from 'lucide-react';
import { playClick } from '../utils/audioSynth';

export const TermsPolicy = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto animate-fadeIn select-none">
      <div className="w-full max-w-3xl bg-[#0A0A0A] border-2 border-[#E10600]/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(225,6,0,0.3)] relative text-white max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4 mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#E10600]" />
            <div>
              <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-wider text-white">
                TERMS & CONDITIONS OF SERVICE
              </h3>
              <p className="text-[10px] font-mono text-gray-400">CYBERRIDE FZ-LLC • DUBAI, UNITED ARAB EMIRATES</p>
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

        {/* Content Scroll Box */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 font-mono text-xs text-gray-300">
          
          <div className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A]">
            <strong className="text-white font-bold block mb-1">1. GOVERNING LAW & JURISDICTION</strong>
            This website and all transactions are governed exclusively by the federal laws of the United Arab Emirates and the local laws of the Emirate of Dubai. Any dispute arising out of or in connection with CyberRide products shall be subject to the exclusive jurisdiction of the Courts of Dubai.
          </div>

          <div className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A]">
            <strong className="text-white font-bold block mb-1">2. COMMERCIAL REGISTRATION & TAX COMPLIANCE</strong>
            CyberRide FZ-LLC is registered in Dubai Design District (d3), Dubai, UAE.
            <br />
            <strong>Tax Registration Number (TRN):</strong> 100492817200003 (5% UAE VAT applies to all local orders).
          </div>

          <div className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A]">
            <strong className="text-white font-bold block mb-1">3. HARDWARE & LED MATRIX WARRANTY (2 YEARS)</strong>
            The CyberRide NEXUS LED Smart Backpack includes a 24-month manufacturer warranty covering:
            <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-400">
              <li>LED matrix panel electronic defects and display power failure</li>
              <li>Bluetooth 5.3 LE app connection module hardware faults</li>
              <li>Hardshell IP54 weather seal integrity and zipper assembly</li>
            </ul>
            Warranty does not cover accidental impact damage, improper crash usage, or unauthorized third-party electrical modifications.
          </div>

          <div className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A]">
            <strong className="text-white font-bold block mb-1">4. ROAD SAFETY & COMPLIANCE DISCLAIMER</strong>
            While CyberRide LED backpacks feature high-visibility signal modes and customizable graphics, riders are required to comply with UAE RTA (Roads and Transport Authority) traffic regulations. Dynamic graphics must not simulate law enforcement emergency beacons (flashing red/blue lights).
          </div>

          <div className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A]">
            <strong className="text-white font-bold block mb-1">5. PRICING & PAYMENT TERMS</strong>
            All prices listed on cyberride.ae are displayed in United Arab Emirates Dirhams (AED) and include 5% UAE VAT where applicable. Payments are processed securely via Stripe 256-bit SSL, Telr, or Tabby BNPL.
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
            I UNDERSTAND & AGREE
          </button>
        </div>

      </div>
    </div>
  );
};
