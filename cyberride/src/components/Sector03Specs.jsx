import React, { useState } from 'react';
import { playClick, playBeep } from '../utils/audioSynth';
import { Cpu, ShieldAlert, BatteryCharging, Wind, Laptop, Layers, Activity, Clock, CheckCircle2 } from 'lucide-react';

export const Sector03Specs = () => {
  const [selectedHotspot, setSelectedHotspot] = useState(0);

  const hotspots = [
    {
      id: 0,
      title: 'DUAL LED EYE MATRIX (BLUETOOTH 5.2)',
      x: '50%',
      y: '28%',
      icon: Cpu,
      detail: 'Ultra-bright 60 FPS full-color LED matrix controlled via iOS/Android app. Supports 20+ pre-set eyes, custom drawings, text ticker, and signal animations.',
      metrics: 'Lumens: 850 cd/m² | Refresh: 60Hz | Protocol: BLE 5.2'
    },
    {
      id: 1,
      title: 'AERODYNAMIC IP54 HARD-SHELL EXOSKELETON',
      x: '30%',
      y: '50%',
      icon: ShieldAlert,
      detail: 'Faceted stealth-fighter geometry designed in wind-tunnels to reduce high-speed drag coefficient by 24% at 140 km/h on Dubai highways.',
      metrics: 'Material: Polycarbonate Composite | Rating: IP54 | Weight: 1.4kg'
    },
    {
      id: 2,
      title: '15.6" SHOCKPROOF LAPTOP & GEAR VAULT',
      x: '70%',
      y: '50%',
      icon: Laptop,
      detail: 'EVA memory foam internal sleeve fits 15.6" gaming laptops plus camera gear, passport vault, and helmet visor pocket.',
      metrics: 'Capacity: 22 Liters | Protection: 360° Shock Absorbing'
    },
    {
      id: 3,
      title: '8-HOUR POWER CELL & USB-C PASS-THROUGH',
      x: '40%',
      y: '75%',
      icon: BatteryCharging,
      detail: 'Integrated 8-hour battery pack with exterior waterproof USB-C quick-charge port for charging phone or helmet HUD on long desert rides.',
      metrics: 'Battery Life: 8 Hours | Input: 65W Fast Charge USB-C'
    },
    {
      id: 4,
      title: 'REFLECTIVE RIDING HARNESS & DESERT AIRFLOW',
      x: '60%',
      y: '75%',
      icon: Wind,
      detail: 'Breathing mesh back padding prevents sweat buildup during 50°C Dubai summers. Includes magnetic chest buckle and 3M Scotchlite safety strips.',
      metrics: 'Strap System: Ergonomic Riding Harness | Security: Lockable Zippers'
    }
  ];

  const timelineEvents = [
    { month: 'MONTH 01', phase: 'CONCEPT & AERODYNAMIC SCANNING', status: 'COMPLETED' },
    { month: 'MONTH 04', phase: 'DUBAI DESERT EXTREME DUST & IP54 TESTING', status: 'COMPLETED' },
    { month: 'MONTH 06', phase: 'SHEIKH ZAYED ROAD HIGH-SPEED HEAT TEST (50°C)', status: 'COMPLETED' },
    { month: 'MONTH 09', phase: 'APP MATRIX SYNC & BLUETOOTH OTA CERTIFICATION', status: 'COMPLETED' },
    { month: 'MONTH 12', phase: 'OFFICIAL DUBAI LAUNCH (349 AED)', status: 'ACTIVE IN DUBAI' }
  ];

  return (
    <section id="sector-3" className="min-h-screen py-20 px-4 md:px-8 bg-cyber-grid bg-[#0A0A0A] border-t border-[#E10600]/20 relative">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Section Header */}
        <div className="mb-12 border-b border-[#2A2A2A] pb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#FF1A1A] font-bold uppercase tracking-widest mb-1">
            <Activity className="w-4 h-4 text-[#E10600]" />
            SECTOR 03 :: CLASSIFIED TECHNICAL BLUEPRINT
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight">
            SPECS & <span className="text-[#E10600]">PROTOCOLS</span>
          </h2>
          <p className="text-sm font-sans text-gray-400 mt-2 max-w-2xl">
            Document Reference: <span className="font-mono text-white">DOC-CB-NEXUS-SPEC-2026</span>. Click component hotspots to inspect engineering telemetries.
          </p>
        </div>

        {/* Blueprint Viewer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Column: Interactive Schematic Canvas */}
          <div className="lg:col-span-7 cyber-glass rounded-xl p-6 border border-[#E10600]/30 relative min-h-[460px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-red-grid opacity-30 pointer-events-none" />

            {/* Central Schematic Illustration */}
            <div className="relative z-10 w-full max-w-md h-96 flex flex-col items-center justify-center border-2 border-dashed border-[#E10600]/40 rounded-2xl p-6 bg-black/60 shadow-[0_0_30px_rgba(225,6,0,0.15)]">
              <div className="w-40 h-52 rounded-2xl bg-[#141414] border-2 border-[#E10600] flex flex-col items-center justify-between p-4 shadow-[0_0_20px_rgba(255,26,26,0.4)] relative">
                {/* Simulated LED Eyes */}
                <div className="flex gap-4 mt-4">
                  <div className="w-8 h-8 rounded-full bg-[#FF1A1A] shadow-[0_0_12px_#FF1A1A] animate-ping" />
                  <div className="w-8 h-8 rounded-full bg-[#FF1A1A] shadow-[0_0_12px_#FF1A1A] animate-ping" />
                </div>
                <div className="w-20 h-2 rounded bg-[#FF1A1A] shadow-[0_0_8px_#FF1A1A]" />
                <div className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-2">
                  CB-NEXUS-01
                </div>
              </div>

              {/* Clickable Hotspot Pins */}
              {hotspots.map((hs) => {
                const IconComponent = hs.icon;
                const isSelected = selectedHotspot === hs.id;
                return (
                  <button
                    key={hs.id}
                    onClick={() => {
                      playBeep();
                      setSelectedHotspot(hs.id);
                    }}
                    style={{ left: hs.x, top: hs.y }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#E10600] text-white border-2 border-white scale-125 shadow-[0_0_20px_#FF1A1A] z-20'
                        : 'bg-black/90 text-[#FF1A1A] border border-[#E10600] hover:scale-110 z-10'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </button>
                );
              })}
            </div>

            {/* Bottom Callout Indicator */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-[11px] font-mono text-gray-400 bg-black/80 px-4 py-2 rounded border border-[#2A2A2A]">
              <span>SCHEMATIC INTERACTION: ACTIVE</span>
              <span className="text-[#FF1A1A] font-bold">CLICK HOTSPOT TO REVEAL TECHNICAL SPEC</span>
            </div>
          </div>

          {/* Right Column: Selected Hotspot Telemetry Detail */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="cyber-glass rounded-xl p-6 border border-[#E10600] shadow-xl">
              <div className="flex items-center gap-3 text-xs font-mono text-[#FF1A1A] font-bold mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF1A1A] animate-ping" />
                <span>HOTSPOT {hotspots[selectedHotspot].id + 1} OF 5 SELECTED</span>
              </div>

              <h3 className="font-display font-bold text-xl text-white uppercase tracking-wider mb-3">
                {hotspots[selectedHotspot].title}
              </h3>

              <p className="text-sm font-sans text-gray-300 leading-relaxed mb-4">
                {hotspots[selectedHotspot].detail}
              </p>

              <div className="bg-[#141414] p-3.5 rounded-lg border border-[#2A2A2A] font-mono text-xs text-[#FF1A1A] font-bold">
                {hotspots[selectedHotspot].metrics}
              </div>
            </div>

            {/* Live Telemetry Data Bars */}
            <div className="bg-[#141414] rounded-xl p-6 border border-[#2A2A2A] flex flex-col gap-4">
              <div className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                REAL-TIME TELEMETRY METRICS
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-gray-300 mb-1">
                  <span>BATTERY EFFICIENCY (8-HOUR DURATION)</span>
                  <span className="text-[#FF1A1A] font-bold">98.4%</span>
                </div>
                <div className="w-full h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
                  <div className="h-full bg-[#E10600] w-[98.4%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-gray-300 mb-1">
                  <span>AERODYNAMIC WIND DRAG REDUCTION</span>
                  <span className="text-[#FF1A1A] font-bold">-24.2%</span>
                </div>
                <div className="w-full h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF1A1A] w-[76%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-gray-300 mb-1">
                  <span>IP54 WATER & DUST RESISTANCE</span>
                  <span className="text-emerald-400 font-bold">CERTIFIED 100%</span>
                </div>
                <div className="w-full h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-full" />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Development Timeline: Dubai Protocol */}
        <div className="bg-[#141414] rounded-xl p-8 border border-[#2A2A2A]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#FF1A1A] font-bold uppercase mb-6">
            <Clock className="w-4 h-4 text-[#E10600]" />
            DEVELOPMENT PROTOCOL — DUBAI ROAD & TESTING MILESTONES
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {timelineEvents.map((evt, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A] relative flex flex-col justify-between">
                <div>
                  <div className="font-mono text-xs text-[#E10600] font-bold mb-1">{evt.month}</div>
                  <div className="font-display font-bold text-xs text-white uppercase">{evt.phase}</div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1F1F1F] flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{evt.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
