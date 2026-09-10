import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { playClick, playBeep, playSuccess } from '../utils/audioSynth';
import confetti from 'canvas-confetti';
import { 
  X, 
  ShieldCheck, 
  Check, 
  Truck, 
  FileText, 
  ArrowRight, 
  Smartphone, 
  Banknote, 
  AlertCircle,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { generateTaxInvoiceHTML } from '../services/emailInvoiceService';

export const CheckoutModal = () => {
  const {
    cart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    clearCart,
    subtotalAED,
    shippingCostAED,
    vatAED,
    totalAED,
    createRealTimeOrder
  } = useCart();

  // 1: Customer Details, 2: SMS Verification (Anti-Fraud), 3: COD Review & Place Order, 4: Order Confirmed
  const [step, setStep] = useState(1); 
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: 'Sultan Al-Maktoum',
    email: 'sultan.rider@cyberride.ae',
    phone: '+971 50 123 4567',
    emirate: 'Dubai',
    address: 'Building 4, Dubai Marina Promenade, Apartment 1402',
    notes: 'Please call 15 minutes before arrival'
  });

  // OTP State
  const [generatedOtp, setGeneratedOtp] = useState('8829');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const [orderId, setOrderId] = useState('');
  const [lastCompletedOrder, setLastCompletedOrder] = useState(null);

  if (!isCheckoutOpen) return null;

  const handleProceedToOtp = (e) => {
    e.preventDefault();
    playClick();
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    setEnteredOtp('');
    setOtpError('');
    setStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (enteredOtp !== generatedOtp) {
      playBeep();
      setOtpError('INVALID VERIFICATION CODE. PLEASE CHECK OR USE AUTO-FILL.');
      return;
    }
    playSuccess();
    setStep(3);
  };

  const handleCompleteCodOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    playSuccess();

    const generatedId = 'CR-DXB-' + Math.floor(100000 + Math.random() * 900000);
    const trackingCode = `ARM-DXB-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);

    const orderItemsSummary = cart.map(i => `${i.product.name} (x${i.quantity})`).join(', ') || 'CYBERRIDE NEXUS LED BACKPACK (x1)';
    const firstItem = cart[0] || {};
    const finalTotalAED = totalAED > 0 ? totalAED : 349;

    const newOrderRecord = {
      id: generatedId,
      customer: formData.fullName || 'Sheikh Rider',
      email: formData.email || 'rider@dubai.ae',
      phone: formData.phone || '+971 50 123 4567',
      items: orderItemsSummary,
      color: firstItem.selectedColor || 'STEALTH BLACK',
      led: firstItem.selectedLed || 'RED PULSE EYES',
      subtotal: subtotalAED,
      shippingCost: shippingCostAED,
      codFee: 0,
      vatAmount: vatAED,
      total: finalTotalAED,
      paymentMethod: 'CASH ON DELIVERY',
      status: 'PENDING DISPATCH',
      emirate: formData.emirate,
      zone: `${formData.emirate} Express`,
      address: `${formData.address}, ${formData.emirate}, UAE`,
      notes: formData.notes || 'Pay cash to Aramex courier upon delivery',
      tracking: trackingCode,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setLastCompletedOrder(newOrderRecord);
    await createRealTimeOrder(newOrderRecord);
    setSubmitting(false);

    setStep(4);
    clearCart();

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {}
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#0A0A0A] border-2 border-[#E10600]/50 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <Banknote className="w-5 h-5 text-[#E10600]" />
            <div>
              <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">
                CASH ON DELIVERY CHECKOUT
              </h3>
              <p className="text-[10px] font-mono text-[#00ffcc]">الدفع عند الاستلام — DUBAI SAME-DAY EXPRESS</p>
            </div>
          </div>
          {step < 4 && (
            <button
              onClick={() => {
                playClick();
                setIsCheckoutOpen(false);
              }}
              className="p-1.5 rounded-xl bg-[#141414] border border-[#2A2A2A] text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Steps Progress Indicator */}
        {step < 4 && (
          <div className="flex items-center justify-between gap-2 mb-6 bg-[#141414] p-3 rounded-xl border border-[#2A2A2A] text-xs font-mono">
            {[
              { num: 1, label: '1. SHIPPING INFO' },
              { num: 2, label: '2. PHONE VERIFY' },
              { num: 3, label: '3. COD REVIEW' }
            ].map((s) => (
              <div
                key={s.num}
                className={`flex items-center gap-2 ${step >= s.num ? 'text-[#FF1A1A] font-bold' : 'text-gray-500'}`}
              >
                <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center border ${
                  step >= s.num ? 'bg-[#E10600] text-white border-[#FF1A1A]' : 'bg-[#0A0A0A] border-gray-700'
                }`}>
                  {s.num}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* STEP 1: Customer Contact & Dubai Shipping Info */}
        {step === 1 && (
          <form onSubmit={handleProceedToOtp} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase">FULL NAME</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-white focus:border-[#E10600] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase">EMAIL ADDRESS (FOR RECEIPT)</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-white focus:border-[#E10600] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase">UAE MOBILE NUMBER (+971)</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+971 50 123 4567"
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-white focus:border-[#E10600] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase">DESTINATION EMIRATE</label>
                <select
                  value={formData.emirate}
                  onChange={(e) => setFormData({ ...formData, emirate: e.target.value })}
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-white focus:border-[#E10600] focus:outline-none"
                >
                  <option value="Dubai">Dubai (Same-Day Express)</option>
                  <option value="Abu Dhabi">Abu Dhabi (Next Day)</option>
                  <option value="Sharjah">Sharjah (Next Day)</option>
                  <option value="Ajman">Ajman (Next Day)</option>
                  <option value="Ras Al Khaimah">Ras Al Khaimah (1-2 Days)</option>
                  <option value="Fujairah">Fujairah (1-2 Days)</option>
                  <option value="Umm Al Quwain">Umm Al Quwain (1-2 Days)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-gray-400 uppercase">DETAILED STREET ADDRESS / VILLA / APARTMENT</label>
              <textarea
                rows={2}
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Building Name, Flat/Villa Number, Street Name, Area..."
                className="w-full mt-1 px-4 py-3 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-white focus:border-[#E10600] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-gray-400 uppercase">INSTRUCTIONS FOR ARAMEX COURIER (OPTIONAL)</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="e.g. Call before arrival, leave with concierge if not available"
                className="w-full mt-1 px-4 py-3 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-white focus:border-[#E10600] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="cyber-button-primary w-full py-4 rounded-xl text-xs font-mono font-bold mt-2 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>VERIFY MOBILE NUMBER & PROCEED</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: Phone Verification (COD Anti-Fraud) */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5 py-2">
            <div className="p-4 rounded-xl bg-[#141414] border border-[#E10600]/40 flex items-start gap-3">
              <Smartphone className="w-5 h-5 text-[#FF1A1A] flex-shrink-0 mt-0.5" />
              <div className="text-xs font-mono">
                <div className="text-white font-bold mb-1">CASH ON DELIVERY FRAUD PROTECTION</div>
                <div className="text-gray-300">
                  To ensure smooth courier handover and reduce failed deliveries, we transmit a 4-digit verification code to:
                </div>
                <div className="text-[#FF1A1A] font-bold mt-1 text-sm">{formData.phone}</div>
              </div>
            </div>

            <div className="bg-black/60 p-4 rounded-xl border border-[#2A2A2A] flex flex-col items-center gap-3 text-center">
              <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>SIMULATED SMS TRANSMISSION CODE: <strong className="text-white text-base tracking-widest bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500">{generatedOtp}</strong></span>
              </div>

              <div className="w-full max-w-xs">
                <label className="text-[10px] font-mono text-gray-400 uppercase mb-1 block">ENTER 4-DIGIT CODE</label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="••••"
                  className="w-full text-center text-xl tracking-[0.4em] font-mono py-3 rounded-xl bg-[#141414] border border-[#2A2A2A] text-white focus:border-[#E10600] focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  playClick();
                  setEnteredOtp(generatedOtp);
                }}
                className="text-[11px] font-mono text-gray-400 hover:text-white underline cursor-pointer"
              >
                Auto-fill received code ({generatedOtp})
              </button>
            </div>

            {otpError && (
              <div className="p-3 rounded-xl bg-red-950 border border-red-500 text-red-300 text-xs font-mono text-center">
                {otpError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3.5 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-gray-300 cursor-pointer"
              >
                EDIT DETAILS
              </button>
              <button
                type="submit"
                className="cyber-button-primary flex-1 py-3.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>VERIFY & REVIEW ORDER</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: COD Order Review */}
        {step === 3 && (
          <form onSubmit={handleCompleteCodOrder} className="flex flex-col gap-4">
            {/* Cash on Delivery Notice Banner */}
            <div className="p-4 rounded-xl bg-[#1F1F1F] border-2 border-[#E10600] flex items-center gap-3 shadow-[0_0_20px_rgba(225,6,0,0.3)]">
              <Banknote className="w-6 h-6 text-[#FF1A1A] flex-shrink-0" />
              <div>
                <div className="font-display font-bold text-sm text-white uppercase">
                  PAYMENT METHOD: 100% CASH ON DELIVERY
                </div>
                <div className="text-xs font-mono text-gray-300">
                  No online payment required. Tender exact cash to the Aramex courier upon arrival.
                </div>
              </div>
            </div>

            {/* Delivery Destination Summary */}
            <div className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A] text-xs font-mono text-gray-300 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-[#FF1A1A] font-bold uppercase mb-1">
                <MapPin className="w-4 h-4" />
                <span>DELIVERY DESTINATION</span>
              </div>
              <div><strong>Recipient:</strong> {formData.fullName} ({formData.phone})</div>
              <div><strong>Address:</strong> {formData.address}, {formData.emirate}</div>
              <div><strong>Courier Service:</strong> {formData.emirate === 'Dubai' ? 'Aramex Same-Day Express (4 Hours)' : 'Aramex UAE Domestic Express'}</div>
              {formData.notes && <div className="text-gray-400"><strong>Driver Notes:</strong> {formData.notes}</div>}
            </div>

            {/* Price Itemization */}
            <div className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A] flex flex-col gap-2 text-xs font-mono text-gray-300">
              <div className="flex justify-between">
                <span>NET ITEMS SUBTOTAL:</span>
                <span className="text-white">{subtotalAED.toLocaleString()} AED</span>
              </div>
              <div className="flex justify-between">
                <span>COURIER SHIPPING:</span>
                <span className="text-white">{shippingCostAED === 0 ? 'FREE (PROMO)' : `${shippingCostAED} AED`}</span>
              </div>
              <div className="flex justify-between">
                <span>COD HANDLING CHARGE:</span>
                <span className="text-emerald-400 font-bold">0.00 AED (WAIVED)</span>
              </div>
              <div className="flex justify-between">
                <span>5% UAE VAT (FTA COMPLIANT):</span>
                <span className="text-white">{vatAED.toLocaleString()} AED</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#FF1A1A] pt-2 border-t border-[#2A2A2A]">
                <span>TOTAL CASH DUE AT HANDOVER:</span>
                <span>{totalAED.toLocaleString()} AED</span>
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-4 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-gray-300 cursor-pointer"
              >
                BACK
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="cyber-button-primary flex-1 py-4 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(225,6,0,0.6)] cursor-pointer disabled:opacity-50"
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span>{submitting ? 'RECORDING ORDER IN DATABASE...' : `CONFIRM CASH ON DELIVERY ORDER — ${totalAED.toLocaleString()} AED`}</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Transmission Complete Screen */}
        {step === 4 && (
          <div className="flex flex-col items-center text-center py-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#E10600] flex items-center justify-center text-white shadow-[0_0_30px_#FF1A1A] mb-4 animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="text-xs font-mono text-[#FF1A1A] font-bold uppercase tracking-widest mb-1">
              TRANSMISSION COMPLETE :: ARMED FOR DISPATCH
            </div>

            <h3 className="font-display font-black text-2xl text-white uppercase">
              ORDER CONFIRMED #{orderId}
            </h3>

            <p className="text-xs font-mono text-gray-300 mt-2 max-w-md">
              Thank you, {formData.fullName}! Your order has been recorded in the Cyberride database and sent to the Dubai Logistics Hub for packing and Aramex courier dispatch.
            </p>

            <div className="my-6 p-4 rounded-xl bg-[#141414] border border-[#2A2A2A] w-full max-w-md text-xs font-mono text-left text-gray-300 flex flex-col gap-2">
              <div>📄 <strong>ORDER ID:</strong> {orderId}</div>
              <div>🚚 <strong>ARAMEX TRACKING:</strong> {lastCompletedOrder?.tracking || 'ARM-DXB-LIVE'}</div>
              <div>📍 <strong>DELIVERY DESTINATION:</strong> {formData.address}, {formData.emirate}</div>
              <div>💵 <strong>PAYMENT:</strong> CASH ON DELIVERY (Tender {lastCompletedOrder?.total || 349} AED)</div>
              <div className="text-[10px] text-[#00ffcc] pt-1 border-t border-[#222]">
                FTA TAX REGISTRATION NUMBER: 100492817200003
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <button
                onClick={() => {
                  playClick();
                  const invoiceWindow = window.open('', '_blank');
                  if (invoiceWindow) {
                    const invoiceHtml = generateTaxInvoiceHTML(lastCompletedOrder || {
                      id: orderId,
                      customer: formData.fullName,
                      email: formData.email,
                      phone: formData.phone,
                      address: `${formData.address}, ${formData.emirate}`,
                      items: 'CYBERRIDE NEXUS LED SMART BACKPACK',
                      color: 'STEALTH BLACK',
                      led: 'RED PULSE EYES',
                      total: totalAED || 349,
                      tracking: lastCompletedOrder?.tracking
                    });
                    invoiceWindow.document.write(invoiceHtml);
                    invoiceWindow.document.close();
                    invoiceWindow.print();
                  }
                }}
                className="px-5 py-3.5 rounded-xl bg-[#141414] border border-[#E10600]/40 text-xs font-mono text-white hover:border-[#E10600] flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#FF1A1A]" />
                <span>DOWNLOAD TAX INVOICE (PDF)</span>
              </button>

              <button
                onClick={() => {
                  playClick();
                  setIsCheckoutOpen(false);
                  setStep(1);
                }}
                className="cyber-button-primary flex-1 py-3.5 rounded-xl text-xs font-mono font-bold cursor-pointer"
              >
                RETURN TO STOREFRONT
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
