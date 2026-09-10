import React, { useState } from 'react';
import { playClick, playBeep } from '../utils/audioSynth';
import { MapPin, Navigation, Truck, CreditCard, ShieldCheck, Check, DollarSign, Globe2 } from 'lucide-react';

export const Sector04Routes = () => {
  const [selectedZone, setSelectedZone] = useState('DUBAI');

  const deliveryZones = [
    {
      id: 'DUBAI',
      name: 'DUBAI METRO & CITY',
      speed: 'SAME-DAY / 24H EXPRESS',
      fee: '35 AED (FREE OVER 1,500 AED)',
      time: 'Orders before 2 PM GST delivered same evening.',
      courier: 'CyberRide Express / Aramex Dubai'
    },
    {
      id: 'ABU_DHABI',
      name: 'ABU DHABI & SHARJAH',
      speed: 'NEXT-DAY GUARANTEED',
      fee: '45 AED (FREE OVER 1,500 AED)',
      time: 'Delivered within 24-36 hours across UAE.',
      courier: 'Aramex UAE Express'
    },
    {
      id: 'GCC',
      name: 'GCC (SAUDI ARABIA, OMAN, QATAR, KUWAIT, BAHRAIN)',
      speed: '3 - 5 BUSINESS DAYS',
      fee: '120 AED FLAT RATE',
      time: 'Customs cleared & air-shipped from Dubai DXB hub.',
      courier: 'DHL / Aramex International'
    },
    {
      id: 'GLOBAL',
      name: 'GLOBAL INTERNATIONAL',
      speed: '7 - 10 BUSINESS DAYS',
      fee: 'CALCULATED AT CHECKOUT',
      time: 'Worldwide door-to-door tracked delivery.',
      courier: 'FedEx Express'
    }
  ];

  const currentZone = deliveryZones.find(z => z.id === selectedZone) || deliveryZones[0];

  return (
    <section id="sector-4" className="min-h-screen py-20 px-4 md:px-8 bg-[#0A0A0A] border-t border-[#E10600]/20 relative">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Section Header */}
        <div className="mb-12 border-b border-[#2A2A2A] pb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#FF1A1A] font-bold uppercase tracking-widest mb-1">
            <Navigation className="w-4 h-4 text-[#E10600]" />
            SECTOR 04 :: LOGISTICS & BRAND ORIGIN
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight">
            GLOBAL <span className="text-[#E10600]">ROUTES</span> & DUBAI HUB
          </h2>
          <p className="text-sm font-sans text-gray-400 mt-2 max-w-2xl">
            Born on Sheikh Zayed Road. Engineered in Dubai for the global rider. Fast fulfillment from our Dubai distribution hub.
          </p>
        </div>

        {/* Dubai Origin Hub Graphic & Zone Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          
          {/* Left Column: Interactive Logistics Map Canvas */}
          <div className="lg:col-span-7 cyber-glass rounded-xl p-6 border border-[#E10600]/30 relative min-h-[400px] flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2 text-xs font-mono text-[#FF1A1A] font-bold">
                <MapPin className="w-4 h-4 text-[#E10600]" />
                <span>ORIGIN HUB: DUBAI (25.2048° N, 55.2708° E)</span>
              </div>
              <span className="text-xs font-mono text-gray-400 bg-black/60 px-3 py-1 rounded border border-[#2A2A2A]">
                LIVE LOGISTICS NETWORK
              </span>
            </div>

            {/* Stylized Vector Map Simulation */}
            <div className="my-8 relative h-64 w-full flex items-center justify-center bg-[#0E0E0E] rounded-xl border border-[#2A2A2A] overflow-hidden">
              {/* Animated perspective lines */}
              <div className="absolute inset-0 bg-red-grid opacity-20" />
              
              {/* Hub Node: Dubai */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#E10600] flex items-center justify-center shadow-[0_0_35px_#FF1A1A] animate-pulse">
                  <Globe2 className="w-7 h-7 text-white" />
                </div>
                <div className="font-display font-black text-sm text-white mt-2 uppercase tracking-widest">
                  DUBAI ORIGIN HUB
                </div>
                <div className="text-[10px] font-mono text-[#FF1A1A] font-bold">
                  SHEIKH ZAYED ROAD BASE
                </div>
              </div>

              {/* Connecting Shipping Pulse Beams */}
              <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 text-[10px] font-mono text-gray-400">
                <span className="w-3 h-3 rounded-full bg-white/60 animate-ping" />
                <span>GCC ROUTE</span>
              </div>
              <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 text-[10px] font-mono text-gray-400">
                <span className="w-3 h-3 rounded-full bg-white/60 animate-ping" />
                <span>GLOBAL AIR</span>
              </div>
            </div>

            {/* Hub Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 z-10">
              {[
                { label: 'DUBAI SAME-DAY', val: '24-HOUR' },
                { label: 'UAE EXPRESS', val: 'NEXT-DAY' },
                { label: 'GCC AIR FREIGHT', val: '3-5 DAYS' },
                { label: 'GLOBAL EXPRESS', val: '7-10 DAYS' }
              ].map((b, i) => (
                <div key={i} className="bg-black/70 p-2.5 rounded border border-[#2A2A2A] text-center">
                  <div className="text-[9px] font-mono text-gray-400">{b.label}</div>
                  <div className="font-mono text-xs font-bold text-[#FF1A1A]">{b.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Zone Shipping Calculator */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="cyber-glass rounded-xl p-6 border border-[#2A2A2A]">
              <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#E10600]" />
                SELECT YOUR DELIVERY DESTINATION
              </div>

              {/* Zone buttons */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                {deliveryZones.map(zone => (
                  <button
                    key={zone.id}
                    onClick={() => {
                      playClick();
                      setSelectedZone(zone.id);
                    }}
                    className={`p-3 rounded-lg text-left font-mono text-xs transition-all border ${
                      selectedZone === zone.id
                        ? 'bg-[#E10600] text-white border-[#FF1A1A] font-bold shadow-[0_0_15px_rgba(225,6,0,0.5)]'
                        : 'bg-[#141414] text-gray-300 border-[#2A2A2A] hover:border-gray-600'
                    }`}
                  >
                    {zone.id.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* Selected Zone Result Card */}
              <div className="bg-[#141414] p-5 rounded-lg border border-[#E10600]/40 flex flex-col gap-3">
                <div className="font-display font-bold text-lg text-white uppercase">
                  {currentZone.name}
                </div>
                
                <div className="flex justify-between items-center text-xs font-mono border-b border-[#2A2A2A] pb-2">
                  <span className="text-gray-400">ESTIMATED SPEED:</span>
                  <span className="text-[#FF1A1A] font-bold">{currentZone.speed}</span>
                </div>

                <div className="flex justify-between items-center text-xs font-mono border-b border-[#2A2A2A] pb-2">
                  <span className="text-gray-400">SHIPPING FEE:</span>
                  <span className="text-white font-bold">{currentZone.fee}</span>
                </div>

                <div className="text-xs font-sans text-gray-300">
                  {currentZone.time}
                </div>

                <div className="text-[11px] font-mono text-gray-400 flex items-center gap-1.5 pt-1">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>COURIER: {currentZone.courier}</span>
                </div>
              </div>
            </div>

            {/* Payment & Trust Badges */}
            <div className="bg-[#141414] p-6 rounded-xl border border-[#2A2A2A] flex flex-col gap-4">
              <div className="text-xs font-mono text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#E10600]" />
                LOCAL DUBAI PAYMENT GATEWAYS & TRUST SIGNALS
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono text-gray-300">
                <div className="p-3 rounded bg-black/60 border border-[#2A2A2A]">
                  <div className="text-[#FF1A1A] font-bold">TABBY & TAMARA</div>
                  <div className="text-[10px] text-gray-400">Pay 4x interest-free of 324.75 AED/mo</div>
                </div>
                <div className="p-3 rounded bg-black/60 border border-[#2A2A2A]">
                  <div className="text-white font-bold">CASH ON DELIVERY</div>
                  <div className="text-[10px] text-gray-400">Pay cash upon receipt in UAE (+20 AED)</div>
                </div>
                <div className="p-3 rounded bg-black/60 border border-[#2A2A2A]">
                  <div className="text-white font-bold">APPLE PAY & CARDS</div>
                  <div className="text-[10px] text-gray-400">Stripe & Telr AED encrypted gateway</div>
                </div>
                <div className="p-3 rounded bg-black/60 border border-[#2A2A2A]">
                  <div className="text-emerald-400 font-bold">2-YEAR WARRANTY</div>
                  <div className="text-[10px] text-gray-400">Full Dubai service center coverage</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
