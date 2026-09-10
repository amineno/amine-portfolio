import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { playClick, playWipe, playBeep, setSoundEnabled, isSoundEnabled } from '../utils/audioSynth';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  ChevronRight, 
  Radio, 
  MapPin, 
  HelpCircle, 
  Sliders, 
  Zap,
  Globe,
  User,
  LogOut,
  Truck
} from 'lucide-react';

export const HeaderNav = ({ activeSector, setActiveSector }) => {
  const { 
    cart, 
    totalItemsCount, 
    subtotalAED, 
    setIsCartOpen, 
    user, 
    setIsAuthOpen, 
    setIsAdminOpen, 
    setIsTrackingOpen,
    logout 
  } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const toggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    setSoundEnabled(nextState);
    if (nextState) playClick();
  };

  const navSectors = [
    { id: 'sector-1', code: '01', name: 'BOOT SEQUENCE', subtitle: 'Hero Chamber & 3D WebGL' },
    { id: 'sector-2', code: '02', name: 'ARSENAL', subtitle: 'Products & 3D Matrix Creator' },
    { id: 'sector-3', code: '03', name: 'SPECS & PROTOCOLS', subtitle: 'Technical HUD & Dubai Testing' },
    { id: 'sector-4', code: '04', name: 'GLOBAL ROUTES', subtitle: 'Dubai Logistics & Same-Day AED' },
    { id: 'sector-5', code: '05', name: 'TERMINAL', subtitle: 'd3 Showroom & Network Join' }
  ];

  const handleNavClick = (sectorId) => {
    playWipe();
    setActiveSector(sectorId);
    setIsMenuOpen(false);
    const elem = document.getElementById(sectorId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-[64px] bg-[#0A0A0A]/85 backdrop-blur-md border-b border-[#E10600]/25 shadow-[0_4px_30px_rgba(0,0,0,0.8)] flex items-center justify-between px-4 md:px-8 [transform:translateZ(0)]">
        
        {/* Left: Brand Monogram Logo + Menu Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playClick();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="p-2 rounded bg-[#141414] border border-[#2A2A2A] hover:border-[#E10600] text-white transition-all flex items-center justify-center"
            title="Open Control System Menu"
          >
            {isMenuOpen ? <X className="w-5 h-5 text-[#FF1A1A]" /> : <Menu className="w-5 h-5 text-white" />}
          </button>

          {/* CR Monogram Logo with Scanner Ring Sweep */}
          <div 
            onClick={() => handleNavClick('sector-1')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative w-9 h-9 flex items-center justify-center">
              <svg className="w-full h-full animate-radar" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" stroke="#E10600" strokeWidth="6" fill="none" />
                <circle cx="50" cy="50" r="38" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="12 6" fill="none" opacity="0.6" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-display font-black text-xs">
                <span className="text-[#E10600]">C</span>
                <span className="text-white">R</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-lg md:text-xl tracking-wider leading-none">
                CYBER<span className="text-[#E10600] italic">RIDE</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-gray-400 uppercase -mt-0.5">
                DUBAI UAE • AED
              </span>
            </div>
          </div>
        </div>

        {/* Center: Dynamic HUD Sector Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-gray-300">
          <span className="w-2 h-2 rounded-full bg-[#E10600] animate-pulse" />
          <span className="text-gray-500 uppercase">SYSTEM SECTOR:</span>
          <span className="text-[#FF1A1A] font-bold uppercase tracking-wider">
            {navSectors.find(s => s.id === activeSector)?.code} :: {navSectors.find(s => s.id === activeSector)?.name}
          </span>
        </div>

        {/* Right: Audio Synth + Admin Button + Cart Trigger */}
        <div className="flex items-center gap-2.5">
          {/* Sound Synth Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded transition-all border ${
              soundOn ? 'bg-[#141414] border-[#E10600]/40 text-[#FF1A1A]' : 'bg-[#141414] border-[#2A2A2A] text-gray-500'
            }`}
            title={soundOn ? 'Mute Cyber Audio Synth' : 'Enable Cyber Audio Synth'}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* SIGN IN / USER AUTH GATEWAY BUTTON */}
          {!user ? (
            <button
              onClick={() => {
                playBeep();
                setIsAuthOpen(true);
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-[#141414] text-gray-200 border border-[#2A2A2A] hover:border-[#E10600] hover:text-white transition cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[#FF1A1A]" />
              <span>SIGN IN / JOIN</span>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono bg-[#141414] border border-[#2A2A2A]">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-white font-bold max-w-[110px] truncate">{user.name}</span>
                <button
                  onClick={() => {
                    playClick();
                    logout();
                  }}
                  title="Sign Out"
                  className="ml-1 text-gray-400 hover:text-red-400 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Track Order Button */}
          <button
            onClick={() => {
              playClick();
              setIsTrackingOpen(true);
            }}
            className="cyber-button-primary px-3.5 py-1.5 rounded text-xs flex items-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span className="font-mono font-bold">Track Order</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={() => {
              playClick();
              setIsCartOpen(true);
            }}
            className="cyber-button-primary px-3.5 py-1.5 rounded text-xs flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="font-mono font-bold">{subtotalAED.toLocaleString()} AED</span>
            {totalItemsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-[#E10600] font-black text-[10px] flex items-center justify-center">
                {totalItemsCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Slide-out Fullscreen Control Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/90 backdrop-blur-2xl flex flex-col pt-20 px-6 md:px-16 animate-fadeIn">
          <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 py-6">
            
            {/* Left Col: Navigation Sectors */}
            <div className="md:col-span-7 flex flex-col gap-3">
              <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#E10600]" /> CYBERRIDE SYSTEM NAVIGATION SECTORS
              </div>

              {navSectors.map((sector) => (
                <button
                  key={sector.id}
                  onClick={() => handleNavClick(sector.id)}
                  className={`group p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    activeSector === sector.id
                      ? 'bg-[#1F1F1F] border-[#E10600] shadow-[0_0_20px_rgba(225,6,0,0.3)]'
                      : 'bg-[#141414] border-[#2A2A2A] hover:border-[#E10600]/60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-lg text-[#E10600]">
                      {sector.code}
                    </span>
                    <div>
                      <div className="font-display font-bold text-lg text-white group-hover:text-[#FF1A1A] transition">
                        {sector.name}
                      </div>
                      <div className="text-xs font-mono text-gray-400">
                        {sector.subtitle}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-[#E10600] group-hover:translate-x-1 transition" />
                </button>
              ))}
            </div>

            {/* Right Col: Quick Access & Dubai Info */}
            <div className="md:col-span-5 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-[#2A2A2A] pt-6 md:pt-0 md:pl-8">
              <div className="cyber-glass rounded-xl p-5 border border-[#E10600]/30">
                <div className="flex items-center gap-2 text-sm font-display font-bold text-white mb-2">
                  <MapPin className="w-4 h-4 text-[#E10600]" /> DUBAI DESIGN DISTRICT (d3) SHOWROOM
                </div>
                <p className="text-xs font-mono text-gray-300">
                  Building 7, Suite 402, Dubai, UAE.<br/>
                  Open Mon–Sat: 10:00 AM – 10:00 PM GST.
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs font-mono text-[#FF1A1A]">
                  <Globe className="w-3.5 h-3.5" /> FREE DUBAI EXPRESS SAME-DAY DELIVERY
                </div>
              </div>

              <div className="bg-[#141414] p-5 rounded-xl border border-[#2A2A2A] flex flex-col gap-2">
                <div className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                  BRAND PROTOCOLS & LEGAL
                </div>
                <div className="text-xs font-mono text-gray-300 flex flex-col gap-1.5">
                  <div>• 2-Year Official UAE Service Warranty</div>
                  <div>• 30-Day Physical Dubai Return Policy</div>
                  <div>• 5% UAE VAT Included</div>
                  <div>• Cash on Delivery (COD) Available</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
