import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { LedMatrixCreator } from './LedMatrixCreator';
import { playClick, playBeep } from '../utils/audioSynth';
import { ShoppingBag, Eye, Star, ShieldCheck, Zap, Filter, CheckCircle2 } from 'lucide-react';

export const Sector02Arsenal = () => {
  const { products, addToCart, setQuickViewProduct } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeTab, setActiveTab] = useState('PRODUCTS'); // 'PRODUCTS' or 'CONFIGURATOR'

  // Per product active selected gallery image tracking
  const [activeImages, setActiveImages] = useState({});

  const categories = ['ALL', 'BACKPACKS', 'ACCESSORIES', 'LIGHTING', 'TECH'];
  const filteredProducts = selectedCategory === 'ALL' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const getActiveImage = (product) => {
    if (activeImages[product.id]) return activeImages[product.id];
    return product.image || (product.gallery && product.gallery[0]?.file) || '/assets/nexus-hero.png';
  };

  return (
    <section id="sector-2" className="min-h-screen py-20 px-4 md:px-8 bg-[#0A0A0A] border-t border-[#E10600]/20 relative">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#2A2A2A]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#FF1A1A] font-bold uppercase tracking-widest mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E10600]" />
              SECTOR 02 :: HIGH-TECH GEAR ARSENAL
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight">
              CYBERRIDE <span className="text-[#E10600]">ARSENAL</span>
            </h2>
            <p className="text-sm font-sans text-gray-400 mt-2 max-w-xl">
              Engineered for stealth aerofoil precision, wireless power, laser projection, and Dubai street resilience.
            </p>
          </div>

          {/* Sub-tab Switcher: Catalog vs LED Configurator */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#141414] border border-[#2A2A2A]">
            <button
              onClick={() => {
                playClick();
                setActiveTab('PRODUCTS');
              }}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                activeTab === 'PRODUCTS'
                  ? 'bg-[#E10600] text-white shadow-[0_0_15px_rgba(225,6,0,0.5)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              GEAR CATALOG
            </button>
            <button
              onClick={() => {
                playBeep();
                setActiveTab('CONFIGURATOR');
              }}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'CONFIGURATOR'
                  ? 'bg-[#E10600] text-white shadow-[0_0_15px_rgba(225,6,0,0.5)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#FF1A1A]" />
              LED MATRIX CREATOR
            </button>
          </div>
        </div>

        {/* Content View: Products Catalog */}
        {activeTab === 'PRODUCTS' ? (
          <>
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-10">
              <span className="text-xs font-mono text-gray-500 mr-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> FILTER CATEGORY:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    playClick();
                    setSelectedCategory(cat);
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all border ${
                    selectedCategory === cat
                      ? 'bg-[#1F1F1F] text-white border-[#E10600] shadow-[0_0_12px_rgba(225,6,0,0.4)]'
                      : 'bg-[#141414] text-gray-400 border-[#2A2A2A] hover:border-gray-600'
                  }`}
                >
                  [{cat}]
                </button>
              ))}
            </div>

            {/* Product Cards Grid Stack */}
            <div className="flex flex-col gap-14">
              {filteredProducts.map((product) => {
                const currentImg = getActiveImage(product);
                const galleryList = product.gallery || [];

                return (
                  <div key={product.id} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-10 border-b border-[#1F1F1F] last:border-b-0">
                    
                    {/* Hero Product Main Stage Card */}
                    <div className="lg:col-span-7 cyber-glass rounded-2xl p-6 md:p-8 flex flex-col justify-between relative group border border-[#E10600]/40 shadow-2xl">
                      
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded bg-black/80 border border-[#E10600]/40 text-xs font-mono text-[#FF1A1A] font-bold">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#E10600]" />
                          <span>{product.badge}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 font-mono text-xs font-bold">
                          <Star className="w-4 h-4 fill-current" />
                          <span>{product.rating}</span>
                          <span className="text-gray-500">({product.reviewsCount} REVIEWS)</span>
                        </div>
                      </div>

                      {/* Product Name & Tagline */}
                      <div className="mb-2">
                        <h3 className="font-display font-black text-xl md:text-2xl text-white uppercase tracking-tight">
                          {product.name}
                        </h3>
                        <p className="text-xs font-mono text-[#FF1A1A] mt-1">{product.tagline}</p>
                      </div>

                      {/* Main Image Display Stage */}
                      <div className="relative w-full h-80 md:h-[400px] rounded-xl bg-radial-glow overflow-hidden flex items-center justify-center my-4 border border-[#1F1F1F]">
                        <img
                          src={currentImg}
                          alt={product.name}
                          className="w-full h-full object-contain p-4 transition-all duration-300 transform group-hover:scale-105"
                        />

                        {/* Top HUD Badge indicating active selected photo */}
                        <div className="absolute top-3 left-3 bg-black/80 px-3 py-1.5 rounded-lg border border-[#E10600]/40 text-[11px] font-mono text-[#FF1A1A] font-bold backdrop-blur-md shadow-md">
                          ACTIVE PHOTO: {galleryList.find(s => (s.file || s) === currentImg)?.title || 'STUDIO SHOT'}
                        </div>

                        {/* Inspector Launcher Button */}
                        <button
                          onClick={() => {
                            playBeep();
                            setQuickViewProduct(product);
                          }}
                          className="absolute bottom-3 right-3 bg-black/85 hover:bg-[#E10600] border border-[#2A2A2A] hover:border-[#FF1A1A] text-white px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all backdrop-blur-md cursor-pointer shadow-lg"
                        >
                          <Eye className="w-4 h-4 text-[#FF1A1A]" />
                          <span>INSPECT SPECIFICATIONS</span>
                        </button>
                      </div>

                      {/* Features Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-gray-300 my-4 p-4 rounded-xl bg-[#141414] border border-[#2A2A2A]">
                        {product.features?.slice(0, 6).map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 font-mono text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>

                      {/* Price & Add to Loadout */}
                      <div className="pt-4 border-t border-[#2A2A2A] flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <div className="text-[10px] font-mono text-gray-500">DUBAI LAUNCH PRICE</div>
                          <div className="font-mono text-3xl font-black text-[#FF1A1A]">
                            {product.price.toLocaleString()} <span className="text-sm text-white">AED</span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              playClick();
                              addToCart(product);
                            }}
                            className="cyber-button-primary px-6 py-3.5 rounded-xl text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(225,6,0,0.5)]"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            <span>ADD TO LOADOUT</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Commercial Product Photography Gallery Thumbnails (4 per product) */}
                    <div className="lg:col-span-5 flex flex-col gap-3.5">
                      <div className="text-xs font-mono text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                        <Eye className="w-4 h-4 text-[#E10600]" />
                        DUBAI PRODUCT PHOTOGRAPHY GALLERY
                      </div>

                      {galleryList.map((shotObj, idx) => {
                        const file = shotObj.file || shotObj;
                        const title = shotObj.title || `STUDIO SHOT 0${idx + 1}`;
                        const desc = shotObj.desc || `${product.name} detail view 0${idx + 1}`;
                        const isSelected = currentImg === file;

                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              playClick();
                              setActiveImages(prev => ({ ...prev, [product.id]: file }));
                            }}
                            className={`cyber-glass rounded-xl p-3.5 border transition-all flex items-center gap-4 cursor-pointer ${
                              isSelected
                                ? 'border-[#FF1A1A] bg-[#1c0a0a] shadow-[0_0_16px_rgba(255,26,26,0.4)] scale-[1.02]'
                                : 'border-[#2A2A2A] hover:border-gray-600 hover:bg-[#141414]'
                            }`}
                          >
                            <img
                              src={file}
                              alt={title}
                              className={`w-24 h-20 object-cover rounded-lg border bg-black transition-all ${
                                isSelected ? 'border-[#FF1A1A] ring-2 ring-[#FF1A1A]/60 scale-105' : 'border-[#E10600]/30'
                              }`}
                            />
                            <div className="flex-1">
                              <div className="font-display font-bold text-xs text-white uppercase flex items-center justify-between">
                                <span>{title}</span>
                                {isSelected && (
                                  <span className="text-[10px] font-mono text-[#FF1A1A] font-bold bg-[#E10600]/20 px-2 py-0.5 rounded border border-[#FF1A1A]/50 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-[#FF1A1A]" /> ACTIVE
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] font-mono text-gray-400 mt-1">{desc}</div>
                              <div className="text-[10px] font-mono text-[#FF1A1A] mt-1.5 font-bold">
                                {isSelected ? 'CURRENTLY DISPLAYED ON STAGE' : 'CLICK TO DISPLAY PHOTO'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Sub-tab View: Integrated LED Matrix Configurator */
          <div className="max-w-4xl mx-auto">
            <LedMatrixCreator />
          </div>
        )}

      </div>
    </section>
  );
};
