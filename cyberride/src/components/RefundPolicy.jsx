import React from 'react';
import { RotateCcw, X, Truck, CheckCircle2 } from 'lucide-react';
import { playClick } from '../utils/audioSynth';

export const RefundPolicy = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto animate-fadeIn select-none">
      <div className="w-full max-w-3xl bg-[#0A0A0A] border-2 border-[#E10600]/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(225,6,0,0.3)] relative text-white max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4 mb-4">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-6 h-6 text-[#FF1A1A]" />
            <div>
              <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-wider text-white">
                30-DAY RETURN & REFUND POLICY
              </h3>
              <p className="text-[10px] font-mono text-gray-400">UAE & GCC CONSUMER RIGHTS GUARANTEE</p>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 font-mono text-xs text-gray-300">
          
          <div className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A]">
            <strong className="text-[#FF1A1A] font-bold block mb-1">1. 30-DAY SATISFACTION GUARANTEE</strong>
            You may return any CyberRide product within 30 days of delivery for a full refund or exchange, provided the item is in unused condition with all original packaging, tags, and accessories intact.
          </div>

          <div className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A]">
            <strong className="text-white font-bold block mb-1">2. ARAMEX PICKUP WORKFLOW (UAE)</strong>
            To initiate a return:
            <ol className="list-decimal pl-5 mt-1 space-y-1 text-gray-400">
              <li>Contact support via email at <span className="text-white">returns@cyberride.ae</span> or via WhatsApp.</li>
              <li>Our team will generate an Aramex return shipping label.</li>
              <li>An Aramex courier will pick up the package directly from your address.</li>
            </ol>
          </div>

          <div className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A]">
            <strong className="text-white font-bold block mb-1">3. REFUND DISBURSEMENT TIMELINE</strong>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li><strong>Credit / Debit Card (Stripe / Telr):</strong> Refunded directly to your card within 5 to 10 business days.</li>
              <li><strong>Tabby BNPL:</strong> Future installments canceled and past payments refunded by Tabby.</li>
              <li><strong>Cash on Delivery (COD):</strong> Issued via direct UAE bank transfer or CyberRide store credit voucher.</li>
            </ul>
          </div>

          <div className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A]">
            <strong className="text-white font-bold block mb-1">4. DEFECTIVE PRODUCTS & EXPRESS REPLACEMENT</strong>
            If your product arrives damaged or exhibits LED panel failure, CyberRide will send a replacement unit via Dubai Same-Day Express at zero cost to you.
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
            GOT IT
          </button>
        </div>

      </div>
    </div>
  );
};
