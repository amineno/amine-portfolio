import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { playClick, playSuccess } from '../utils/audioSynth';
import { Terminal, Send, MapPin, Phone, Mail, Share2, Shield, ChevronRight, Check } from 'lucide-react';

export const Sector05Terminal = ({ onOpenAdmin, onOpenTerms, onOpenPrivacy, onOpenRefund }) => {
  const { products, addToCart } = useCart();
  const heroProduct = products[0];

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    playSuccess();
    setSubscribed(true);
  };

  return (
    <section id="sector-5" className="min-h-screen py-20 px-4 md:px-8 bg-[#0A0A0A] border-t border-[#E10600]/30 relative overflow-hidden">
      
      {/* Background radial neon highlight */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(225,6,0,0.15)_0%,rgba(10,10,10,0)_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#E10600]/40 text-xs font-mono text-[#FF1A1A] mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span>SECTOR 05 :: TERMINAL & NETWORK ACCESS</span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight">
            JOIN THE <span className="text-[#E10600]">CYBERRIDE</span> NETWORK
          </h2>

          <p className="text-sm md:text-base font-sans text-gray-300 mt-3 leading-relaxed">
            Subscribe for exclusive firmware updates, custom matrix drop alerts, and VIP rider events at our Dubai showroom.
          </p>

          {/* Newsletter Box */}
          <form onSubmit={handleSubscribe} className="mt-8 max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ENTER RIDER EMAIL ADDRESS..."
              className="flex-1 px-5 py-4 rounded-xl bg-[#141414] border border-[#E10600]/40 text-sm font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#E10600] focus:ring-1 focus:ring-[#E10600]"
            />
            <button
              type="submit"
              className="cyber-button-primary px-8 py-4 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(225,6,0,0.5)] cursor-pointer"
            >
              <span>JOIN NETWORK</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          {subscribed && (
            <div className="mt-4 p-3 rounded-lg bg-emerald-950/80 border border-emerald-500 text-emerald-300 font-mono text-xs flex items-center justify-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>TRANSMISSION RECEIVED. USE ACCESS CODE <strong className="text-white underline">DUBAI10</strong> FOR 10% OFF!</span>
            </div>
          )}
        </div>

        {/* Dubai Showroom & Physical Location Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          
          <div className="lg:col-span-6 cyber-glass rounded-xl p-8 border border-[#E10600]/30 flex flex-col gap-6">
            <div className="flex items-center gap-2 text-xs font-mono text-[#FF1A1A] font-bold uppercase">
              <MapPin className="w-4 h-4 text-[#E10600]" />
              DUBAI SHOWROOM & EXPERIENCE CENTER
            </div>

            <h3 className="font-display font-black text-2xl text-white uppercase">
              DUBAI DESIGN DISTRICT (d3)
            </h3>

            <p className="text-sm font-sans text-gray-300 leading-relaxed">
              Visit our Flagship Experience Center in d3 to test out the NEXUS LED matrix in person, get custom fit adjustments, and experience our full urban armor line.
            </p>

            <div className="bg-[#141414] p-4 rounded-lg border border-[#2A2A2A] font-mono text-xs text-gray-300 flex flex-col gap-2">
              <div>📍 <strong>LOCATION:</strong> Building 7, Suite 402, Dubai Design District (d3), Dubai, UAE</div>
              <div>📞 <strong>TEL:</strong> +971 4 800 29237 (CYBER)</div>
              <div>💬 <strong>WHATSAPP:</strong> +971 50 998 8123</div>
              <div>⏰ <strong>HOURS:</strong> Monday – Saturday: 10:00 AM – 10:00 PM GST</div>
            </div>
          </div>

          {/* Mass Final Call-to-Action */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#141414] via-[#1F1F1F] to-[#0A0A0A] rounded-xl p-8 border-2 border-[#E10600] flex flex-col items-center text-center justify-center gap-6 shadow-[0_0_40px_rgba(225,6,0,0.3)]">
            <div className="text-xs font-mono text-gray-400 uppercase tracking-widest">
              READY TO UPGRADE YOUR RIDE?
            </div>

            <h3 className="font-display font-black text-3xl sm:text-4xl text-white uppercase leading-tight">
              CYBERRIDE NEXUS <br />
              <span className="text-[#FF1A1A]">349 AED</span>
            </h3>

            <p className="text-xs font-sans text-gray-300 max-w-md">
              Includes Dual LED Matrix, Bluetooth iOS/Android companion app, 8-hour power unit, and 2-year Dubai official warranty.
            </p>

            <button
              onClick={() => {
                playClick();
                addToCart(heroProduct);
              }}
              className="cyber-button-primary px-8 py-4 rounded-xl text-sm font-mono font-bold w-full max-w-sm flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,26,26,0.8)] cursor-pointer"
            >
              <span>SECURE YOUR NEXUS NOW</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Footer */}
        <footer className="pt-12 border-t border-[#2A2A2A] text-xs font-mono text-gray-400 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <div className="font-display font-bold text-white text-base">
              CYBER<span className="text-[#E10600] italic">RIDE</span> UAE
            </div>
            <div>© 2026 CYBERRIDE LOGISTICS FZ-LLC. ALL RIGHTS RESERVED.</div>
            <div className="text-[10px] text-gray-500">TRN: 100492817200003 • COMPLIANT WITH UAE CONSUMER PROTECTION LAW & 5% UAE VAT REGULATION.</div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button onClick={onOpenPrivacy} className="hover:text-white transition cursor-pointer">
              PRIVACY POLICY
            </button>
            <span className="text-gray-700">•</span>
            <button onClick={onOpenTerms} className="hover:text-white transition cursor-pointer">
              TERMS OF SERVICE
            </button>
            <span className="text-gray-700">•</span>
            <button onClick={onOpenRefund} className="hover:text-white transition cursor-pointer">
              RETURN POLICY
            </button>
          </div>
        </footer>

      </div>
    </section>
  );
};
