import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { playClick, playBeep } from '../utils/audioSynth';
import { Sparkles, RefreshCw, Smartphone, Check, Zap } from 'lucide-react';

export const LedMatrixCreator = () => {
  const { activeLedPattern, setActiveLedPattern } = useCart();
  const GRID_SIZE = 10;
  
  // Default matrix state (Cyber Eye Shape)
  const defaultEyeGrid = () => {
    const grid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
    // Eye outer ring
    [2,3,4,5,6,7].forEach(c => { grid[2][c] = 1; grid[7][c] = 1; });
    [3,4,5,6].forEach(r => { grid[r][2] = 1; grid[r][7] = 1; });
    // Center pupil
    grid[4][4] = 1; grid[4][5] = 1; grid[5][4] = 1; grid[5][5] = 1;
    return grid;
  };

  const [grid, setGrid] = useState(defaultEyeGrid);
  const [selectedColor, setSelectedColor] = useState('#FF1A1A');

  const togglePixel = (r, c) => {
    playClick();
    const newGrid = grid.map((row, ri) =>
      row.map((val, ci) => (ri === r && ci === c ? (val === 1 ? 0 : 1) : val))
    );
    setGrid(newGrid);
    setActiveLedPattern('DIY CUSTOM PATTERN');
  };

  const loadPreset = (presetName) => {
    playBeep();
    setActiveLedPattern(presetName);
    const newGrid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
    
    if (presetName === 'CYBER CROSSHAIR') {
      for (let i = 0; i < GRID_SIZE; i++) {
        newGrid[i][4] = 1;
        newGrid[i][5] = 1;
        newGrid[4][i] = 1;
        newGrid[5][i] = 1;
      }
    } else if (presetName === 'HAZARD TURN SIGNAL') {
      // Draw right arrow
      [2,3,4,5,6,7].forEach(r => newGrid[r][2] = 1);
      [3,4,5,6].forEach(r => newGrid[r][4] = 1);
      [4,5].forEach(r => newGrid[r][6] = 1);
      newGrid[4][8] = 1; newGrid[5][8] = 1;
    } else if (presetName === 'MATRIX RAIN') {
      [0,2,4,6,8].forEach(c => {
        const r = Math.floor(Math.random() * 8);
        newGrid[r][c] = 1;
        newGrid[r+1]?.[c] && (newGrid[r+1][c] = 1);
      });
    } else {
      // Red Pulse Eyes
      setGrid(defaultEyeGrid());
      return;
    }
    setGrid(newGrid);
  };

  const clearGrid = () => {
    playClick();
    setGrid(Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0)));
  };

  return (
    <div className="cyber-glass rounded-xl p-6 border border-[#E10600]/30 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-[#FF1A1A]" />
            <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">
              CYBERRIDE BLUETOOTH APP MATRIX CREATOR
            </h3>
          </div>
          <p className="text-xs font-mono text-gray-400 mt-1">
            Draw custom pixel art or sync live turn signals directly to your NEXUS LED display.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF1A1A] animate-ping" />
          <span className="text-xs font-mono text-[#FF1A1A] font-bold">APP SYNCED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Column: Preset Buttons */}
        <div className="md:col-span-4 flex flex-col gap-2.5">
          <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#E10600]" /> 20+ PRESET ANIMATIONS
          </div>
          {[
            { id: 'RED PULSE EYES', label: 'RED PULSE EYES' },
            { id: 'CYBER CROSSHAIR', label: 'TARGET CROSSHAIR' },
            { id: 'HAZARD TURN SIGNAL', label: 'RIGHT TURN SIGNAL' },
            { id: 'MATRIX RAIN', label: 'DUBAI MATRIX RAIN' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => loadPreset(p.id)}
              className={`w-full text-left font-mono text-xs px-3.5 py-2.5 rounded transition-all flex items-center justify-between border ${
                activeLedPattern === p.id
                  ? 'bg-[#E10600] text-white border-[#FF1A1A] shadow-[0_0_15px_rgba(225,6,0,0.5)]'
                  : 'bg-[#141414] text-gray-300 border-[#2A2A2A] hover:border-[#E10600]/50'
              }`}
            >
              <span>{p.label}</span>
              {activeLedPattern === p.id && <Check className="w-4 h-4" />}
            </button>
          ))}
          <button
            onClick={clearGrid}
            className="mt-2 text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1.5 justify-center py-2 border border-dashed border-[#2A2A2A] rounded hover:border-gray-600 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> CLEAR PIXEL CANVAS
          </button>
        </div>

        {/* Right Column: 10x10 LED Matrix Pixel Grid */}
        <div className="md:col-span-8 flex flex-col items-center justify-center bg-black/60 p-4 rounded-lg border border-[#2A2A2A]">
          <div className="grid grid-cols-10 gap-1.5 p-2 bg-[#0E0E0E] rounded border border-[#E10600]/30 shadow-inner">
            {grid.map((row, r) =>
              row.map((val, c) => (
                <button
                  key={`${r}-${c}`}
                  onClick={() => togglePixel(r, c)}
                  className={`w-6 h-6 md:w-7 md:h-7 rounded-sm transition-all duration-150 border ${
                    val === 1
                      ? 'bg-[#FF1A1A] border-[#FFFFFF] shadow-[0_0_10px_#FF1A1A]'
                      : 'bg-[#141414] border-[#222222] hover:bg-[#2A2A2A]'
                  }`}
                  title={`Pixel (${r},${c})`}
                />
              ))
            )}
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs font-mono text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#FF1A1A] border border-white inline-block" />
              <span>ACTIVE LED (ON)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#141414] border border-[#333] inline-block" />
              <span>OFF</span>
            </div>
            <span className="text-[#FF1A1A] font-bold">STATUS: LIVE STREAMING TO BACKPACK</span>
          </div>
        </div>
      </div>
    </div>
  );
};
