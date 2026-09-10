import React, { useState } from 'react';
import { getTrackingData } from '../services/apiClient';
import { playClick, playBeep, playSuccess } from '../utils/audioSynth';
import { 
  Search, 
  X, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  ShieldCheck, 
  Package, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { generateTaxInvoiceHTML } from '../services/emailInvoiceService';

export const OrderTrackingModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    playClick();
    setLoading(true);
    setErrorMsg('');
    setTrackingResult(null);

    const result = await getTrackingData(query.trim());
    setLoading(false);

    if (result && result.success) {
      playSuccess();
      setTrackingResult(result);
    } else {
      playBeep();
      setErrorMsg(result?.error || 'No shipment record found. Verify Order ID (e.g. CR-DXB-882910) or Phone (+971...).');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#0A0A0A] border-2 border-[#E10600]/50 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(225,6,0,0.3)] relative">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <Truck className="w-5 h-5 text-[#E10600]" />
            <div>
              <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">
                ARAMEX LIVE CONSIGNMENT TRACKING
              </h3>
              <p className="text-[10px] font-mono text-gray-400">DUBAI ORIGIN HUB TELEMETRY (d3)</p>
            </div>
          </div>

          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-gray-400 hover:text-white hover:border-[#E10600] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ENTER ORDER ID (CR-DXB-...) OR UAE PHONE (+971...)"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#E10600]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cyber-button-primary px-6 py-3 rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'LOCATING...' : 'TRACK'}
          </button>
        </form>

        {/* Error Notice */}
        {errorMsg && (
          <div className="p-3 mb-6 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tracking Result View */}
        {trackingResult && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            {/* Shipment Overview Card */}
            <div className="p-4 rounded-xl bg-[#141414] border border-[#E10600]/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="text-[10px] font-mono text-gray-400 uppercase">ORDER ID & WAYBILL</div>
                <div className="font-mono text-base font-bold text-white flex items-center gap-2">
                  <span>{trackingResult.orderId}</span>
                  <span className="text-xs text-[#FF1A1A]">({trackingResult.trackingNumber})</span>
                </div>
                <div className="text-xs font-sans text-gray-300 mt-1">
                  Recipient: <strong className="text-white">{trackingResult.customer}</strong> • {trackingResult.emirate}
                </div>
              </div>

              <div className="sm:text-right w-full sm:w-auto p-3 sm:p-0 rounded-lg bg-black/40 sm:bg-transparent">
                <div className="text-[10px] font-mono text-gray-400 uppercase">CASH AMOUNT DUE AT DELIVERY</div>
                <div className="font-mono text-xl font-extrabold text-[#FF1A1A]">
                  {trackingResult.totalDueAED} <span className="text-xs text-white">AED</span>
                </div>
                <div className="text-[10px] font-mono text-emerald-400 font-bold">
                  PAY CASH TO ARAMEX COURIER
                </div>
              </div>
            </div>

            {/* Live Milestones Stepper */}
            <div className="p-5 rounded-xl bg-[#111] border border-[#222]">
              <div className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#E10600]" />
                LIVE COURIER RADAR TIMELINE
              </div>

              <div className="flex flex-col gap-4 relative pl-4 border-l-2 border-[#2A2A2A]">
                {trackingResult.checkpoints?.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-3">
                    {/* Checkpoint Node Icon */}
                    <div className={`absolute -left-[23px] top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      step.done 
                        ? 'bg-[#E10600] border-[#FF1A1A] text-white shadow-[0_0_10px_#FF1A1A]' 
                        : 'bg-[#141414] border-gray-700 text-transparent'
                    }`}>
                      {step.done && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                    </div>

                    <div className="flex-1">
                      <div className={`text-xs font-mono font-bold ${step.done ? 'text-white' : 'text-gray-500'}`}>
                        {step.milestone}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-gray-400 mt-0.5">
                        <span>📍 {step.location}</span>
                        <span>•</span>
                        <span className="text-gray-500">{step.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar: Download Invoice */}
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  playClick();
                  const invoiceWindow = window.open('', '_blank');
                  if (invoiceWindow) {
                    const invoiceHtml = generateTaxInvoiceHTML({
                      id: trackingResult.orderId,
                      customer: trackingResult.customer,
                      address: trackingResult.address,
                      total: trackingResult.totalDueAED,
                      tracking: trackingResult.trackingNumber
                    });
                    invoiceWindow.document.write(invoiceHtml);
                    invoiceWindow.document.close();
                    invoiceWindow.print();
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-[#141414] border border-[#2A2A2A] hover:border-[#E10600] text-xs font-mono text-gray-300 hover:text-white transition flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#FF1A1A]" />
                <span>DOWNLOAD OFFICIAL TAX INVOICE (FTA)</span>
              </button>

              <button
                onClick={() => {
                  playClick();
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#1F1F1F] text-xs font-mono text-white hover:bg-gray-700 cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
