import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { RotateCcw, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { playClick, playBeep } from '../utils/audioSynth';

export const Cyber3DScene = ({ interactive = true, activeColor = '#0A0A0A' }) => {
  const { activeLedPattern, setActiveLedPattern } = useCart();
  
  // 360 degree rotation angle (0 to 359 degrees)
  const [rotationAngle, setRotationAngle] = useState(45); // Start at 45° side rim angle (Image 2 style!)
  const [isAutoSpin, setIsAutoSpin] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartAngle = useRef(0);
  const autoSpinRef = useRef(null);

  // Array of high-fidelity commercial photography angles
  const angles = [
    {
      angle: 0,
      label: 'FRONT FACE (LED MATRIX DISPLAY)',
      image: '/assets/nexus-hero.png',
      hasLedOverlay: true
    },
    {
      angle: 45,
      label: '3/4 CONTOUR (METALLIC RED RIM LIGHT)',
      image: '/assets/nexus-360-side.png',
      hasLedOverlay: true
    },
    {
      angle: 90,
      label: 'CARBON SIDE WING & IP54 ZIPPER',
      image: '/assets/nexus-detail.png',
      hasLedOverlay: false
    },
    {
      angle: 180,
      label: 'AIRFLOW HARNESS & REFLECTIVE STRAPS',
      image: '/assets/nexus-360-back.png',
      hasLedOverlay: false
    },
    {
      angle: 270,
      label: 'DUBAI STREET NIGHT RIDER VIEW',
      image: '/assets/nexus-lifestyle.png',
      hasLedOverlay: false
    },
    {
      angle: 315,
      label: 'FRONT-LEFT STEALTH FACET SHIELD',
      image: '/assets/nexus-360-front-left.png',
      hasLedOverlay: true
    }
  ];

  // Find the closest shot angle based on rotationAngle
  const currentAngleObj = angles.reduce((prev, curr) => {
    const prevDiff = Math.abs(prev.angle - (rotationAngle % 360));
    const currDiff = Math.abs(curr.angle - (rotationAngle % 360));
    return currDiff < prevDiff ? curr : prev;
  });

  // Auto spin loop
  useEffect(() => {
    if (isAutoSpin && !isDragging) {
      autoSpinRef.current = setInterval(() => {
        setRotationAngle(prev => (prev + 1) % 360);
      }, 50);
    } else {
      clearInterval(autoSpinRef.current);
    }

    return () => clearInterval(autoSpinRef.current);
  }, [isAutoSpin, isDragging]);

  // Drag interaction handlers
  const handleMouseDown = (e) => {
    if (!interactive) return;
    setIsDragging(true);
    setIsAutoSpin(false);
    dragStartX.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    dragStartAngle.current = rotationAngle;
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !interactive) return;
    const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = currentX - dragStartX.current;
    // 1 pixel drag = 0.8 degrees of rotation
    let newAngle = (dragStartAngle.current - deltaX * 0.8) % 360;
    if (newAngle < 0) newAngle += 360;
    setRotationAngle(Math.round(newAngle));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetRotation = () => {
    playClick();
    setRotationAngle(45); // Reset to Image 2 3/4 angle
    setIsAutoSpin(false);
  };

  const toggleAutoSpin = () => {
    playClick();
    setIsAutoSpin(!isAutoSpin);
  };

  // Step rotation left/right by 45 degrees
  const stepRotation = (dir) => {
    playBeep();
    setIsAutoSpin(false);
    let next = (rotationAngle + dir * 45) % 360;
    if (next < 0) next += 360;
    setRotationAngle(next);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
      className={`relative w-full h-full min-h-[480px] flex items-center justify-center overflow-hidden rounded-2xl border border-[#E10600]/30 bg-radial-glow shadow-[0_0_50px_rgba(225,6,0,0.2)] group select-none ${
        interactive ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
    >
      {/* 360 Photorealistic Product Render Stage */}
      <div className="relative w-full h-full flex items-center justify-center p-6 transition-transform duration-300">
        
        {/* Active Angle Product Photography Image */}
        <img
          src={currentAngleObj.image}
          alt={currentAngleObj.label}
          className="max-h-[420px] w-auto object-contain transition-all duration-300 drop-shadow-[0_15px_35px_rgba(225,6,0,0.35)] scale-105 pointer-events-none"
        />

        {/* Dynamic Glowing LED Eye Indicator Overlay badge for front angle */}
        {currentAngleObj.hasLedOverlay && (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
            <div className="w-20 h-6 bg-[#FF1A1A]/30 rounded-full blur-md animate-led-pulse" />
          </div>
        )}

        {/* Dynamic Studio Radial Floor Light */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-72 h-8 bg-[#E10600]/25 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Top Right Action Controls: Reset Angle & Auto-Spin Toggle */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={toggleAutoSpin}
          title={isAutoSpin ? 'Pause 360° Auto Rotation' : 'Start 360° Auto Rotation'}
          className={`p-2.5 rounded-xl border backdrop-blur-md transition-all cursor-pointer shadow-md flex items-center gap-1 text-xs font-mono font-bold ${
            isAutoSpin
              ? 'bg-[#E10600] text-white border-[#FF1A1A] shadow-[0_0_15px_rgba(225,6,0,0.6)]'
              : 'bg-black/80 text-gray-300 border-[#2A2A2A] hover:border-[#FF1A1A] hover:text-white'
          }`}
        >
          {isAutoSpin ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span className="hidden sm:inline">{isAutoSpin ? 'PAUSE SPIN' : 'AUTO SPIN'}</span>
        </button>

        <button
          onClick={resetRotation}
          title="Reset 360° Camera Angle"
          className="p-2.5 rounded-xl bg-black/80 hover:bg-[#E10600] text-gray-300 hover:text-white border border-[#2A2A2A] hover:border-[#FF1A1A] transition-all backdrop-blur-md shadow-md cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Side Manual 45° Step Rotation Arrow Buttons */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          stepRotation(-1);
        }}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/80 hover:bg-[#E10600] text-gray-300 hover:text-white border border-[#2A2A2A] hover:border-[#FF1A1A] transition-all backdrop-blur-md shadow-xl cursor-pointer"
        title="Spin 45° Left"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          stepRotation(1);
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/80 hover:bg-[#E10600] text-gray-300 hover:text-white border border-[#2A2A2A] hover:border-[#FF1A1A] transition-all backdrop-blur-md shadow-xl cursor-pointer"
        title="Spin 45° Right"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
