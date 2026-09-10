import React from 'react';
import { Cyber3DScene } from './Cyber3DScene';
import { useCart } from '../context/CartContext';
import { playClick, playBeep } from '../utils/audioSynth';
import { ArrowDown, Shield, Zap, Sparkles, ChevronRight, Eye } from 'lucide-react';

export const Sector01Hero = ({ onExploreArsenal }) => {
  const { products, addToCart, setQuickViewProduct } = useCart();
  const heroProduct = products[0];

  return (
    <section id="sector-1" className="relative min-h-screen pt-20 pb-12 flex flex-col justify-between px-4 md:px-8 bg-cyber-grid overflow-hidden">
      
      {/* Background Neon ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(225,6,0,0.18)_0%,rgba(10,10,10,0)_70%)] pointer-events-none" />

      {/* Top Banner Status Bar */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-4 py-2 border-b border-[#E10600]/30 text-xs font-mono text-gray-400">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF1A1A] animate-ping" />
          <span className="text-[#FF1A1A] font-bold">SYSTEM ONLINE :: DUBAI ORIGIN HUB</span>
        </div>
        <div className="hidden sm:flex items-center gap-6">
          <span>CURRENCY: <strong className="text-white">AED (د.إ)</strong></span>
          <span>STOCK STATUS: <strong className="text-[#FF1A1A]">4 UNITS IN DUBAI WAREHOUSE</strong></span>
          <span>DELIVERY: <strong className="text-white">SAME-DAY EXPRESS</strong></span>
        </div>
      </div>

      {/* Main Grid: Typography Left, 3D WebGL Canvas Right */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-8">
        
        {/* Left Column: Hero Text & Imperative CTAs */}
        <div className="lg:col-span-6 flex flex-col items-start gap-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141414] border border-[#E10600]/40 text-xs font-mono text-[#FF1A1A] shadow-[0_0_15px_rgba(225,6,0,0.3)]">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>FLAGSHIP HERO SKU — SK-CB-NEXUS-01</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight leading-[0.95] text-white">
            COMMAND <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF1A1A] via-[#E10600] to-white">
              THE NIGHT.
            </span>
          </h1>

          <div className="font-display text-xl sm:text-2xl text-[#E10600] font-bold uppercase tracking-widest">
            "RIDE SMART. RIDE DIFFERENT."
          </div>

          <p className="text-sm md:text-base font-sans text-gray-300 max-w-xl leading-relaxed">
            The <strong className="text-white">CYBERRIDE NEXUS LED Smart Backpack</strong> features dual programmable Bluetooth app-controlled display eyes, an aerodynamic IP54 hardshell, and intense neon visibility engineered in Dubai for high-speed night riders.
          </p>

          {/* Pricing & Installments Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 bg-[#141414]/90 p-4 rounded-xl border border-[#2A2A2A] w-full max-w-md">
            <div>
              <div className="text-[10px] font-mono text-gray-400 uppercase">OFFICIAL DUBAI LAUNCH PRICE</div>
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#FF1A1A]">
                349 <span className="text-sm text-white">AED</span>
              </div>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l border-[#2A2A2A] pt-2 sm:pt-0 sm:pl-4 w-full sm:w-auto">
              <div className="text-[10px] font-mono text-gray-400 uppercase">TABBY / TAMARA BNPL</div>
              <div className="text-xs font-mono text-white">
                4x interest-free of <strong className="text-[#FF1A1A]">87.25 AED/mo</strong>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full pt-2">
            <button
              onClick={() => {
                playClick();
                addToCart(heroProduct);
              }}
              className="cyber-button-primary px-5 sm:px-7 py-3.5 sm:py-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(225,6,0,0.6)] cursor-pointer w-full sm:w-auto"
            >
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              <span>COMMAND YOUR GEAR — 349 AED</span>
            </button>

            <button
              onClick={() => {
                playBeep();
                setQuickViewProduct(heroProduct);
              }}
              className="cyber-button-secondary px-5 py-3.5 sm:py-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              <Eye className="w-4 h-4 text-[#FF1A1A]" />
              <span>3D INSPECTOR</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-xs font-mono text-gray-400">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#E10600]" />
              <span>2-YEAR UAE WARRANTY</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div>FREE SAME-DAY DUBAI SHIP</div>
            <span className="hidden sm:inline">•</span>
            <div>CASH ON DELIVERY</div>
          </div>
        </div>

        {/* Right Column: 3D Interactive WebGL Scene */}
        <div className="lg:col-span-6 h-[320px] sm:h-[440px] lg:h-[560px] w-full relative">
          <Cyber3DScene interactive={true} />
        </div>
      </div>

      {/* Bottom Scroll Prompt */}
      <div className="relative z-10 flex justify-center pt-4">
        <button
          onClick={() => {
            playClick();
            onExploreArsenal();
          }}
          className="flex flex-col items-center gap-1 text-xs font-mono text-gray-400 hover:text-[#FF1A1A] transition group cursor-pointer"
        >
          <span>ENTER ARSENAL SECTOR 02</span>
          <ArrowDown className="w-4 h-4 text-[#E10600] group-hover:translate-y-1 transition" />
        </button>
      </div>

    </section>
  );
};
