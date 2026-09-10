import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { playClick, playBeep } from '../utils/audioSynth';
import { X, ShoppingBag, Star, Check, Eye, Image as ImageIcon } from 'lucide-react';

export const ProductQuickViewModal = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, setIsCheckoutOpen } = useCart();
  const [selectedColor, setSelectedColor] = useState('STEALTH BLACK');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('/assets/nexus-hero.png');
  const [viewMode, setViewMode] = useState('IMAGE');

  useEffect(() => {
    if (quickViewProduct) {
      const firstImg = quickViewProduct.image || 
        (quickViewProduct.gallery && (quickViewProduct.gallery[0]?.file || quickViewProduct.gallery[0])) || 
        '/assets/nexus-hero.png';
      setSelectedImage(firstImg);
      setViewMode('IMAGE');
      setSelectedColor(quickViewProduct.colors?.[0]?.name || 'STEALTH BLACK');
      setQuantity(1);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const galleryList = (quickViewProduct.gallery && quickViewProduct.gallery.length > 0)
    ? quickViewProduct.gallery.map((g, idx) => typeof g === 'string' ? { title: `SHOT 0${idx + 1}`, file: g } : { title: g.title, file: g.file })
    : [{ title: 'STUDIO OVERVIEW', file: quickViewProduct.image || '/assets/nexus-hero.png' }];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-5xl bg-[#0A0A0A] border border-[#E10600]/40 rounded-2xl p-6 md:p-8 shadow-2xl relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => {
            playClick();
            setQuickViewProduct(null);
          }}
          className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-gray-400 hover:text-white hover:border-[#E10600] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left 60%: Selected Image Display */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          
          {/* Gallery Header Badge */}
          <div className="flex items-center justify-between bg-[#141414] p-1.5 px-3 rounded-xl border border-[#2A2A2A]">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white">
              <ImageIcon className="w-3.5 h-3.5 text-[#E10600]" />
              <span>PHOTO GALLERY</span>
            </div>
            <span className="text-[10px] font-mono text-gray-500 uppercase px-2">DUBAI HUB</span>
          </div>

          {/* Viewer Stage */}
          <div className="h-[380px] lg:h-[440px] w-full relative rounded-xl overflow-hidden border border-[#2A2A2A] bg-black">
            <div className="w-full h-full flex items-center justify-center p-4 bg-radial-glow">
              <img
                src={selectedImage}
                alt={quickViewProduct.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Quick Photo Thumbnail Row */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {galleryList.map((img, i) => (
              <button
                key={i}
                onClick={() => {
                  playClick();
                  setSelectedImage(img.file);
                  setViewMode('IMAGE');
                }}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-mono border transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer ${
                  viewMode === 'IMAGE' && selectedImage === img.file
                    ? 'bg-[#E10600]/20 text-[#FF1A1A] border-[#FF1A1A] font-bold shadow-[0_0_10px_rgba(255,26,26,0.4)]'
                    : 'bg-[#141414] text-gray-400 border-[#2A2A2A] hover:border-gray-600'
                }`}
              >
                <img src={img.file} alt={img.title} className="w-5 h-5 object-cover rounded border border-gray-700" />
                <span>{img.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right 40%: Specs & Purchase Controls */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-5">
          
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#FF1A1A] font-bold mb-1">
              <span className="w-2 h-2 rounded-full bg-[#E10600]" />
              <span>SKU: {quickViewProduct.sku}</span>
            </div>

            <h2 className="font-display font-black text-2xl text-white uppercase leading-tight">
              {quickViewProduct.name}
            </h2>

            <div className="flex items-center gap-3 text-xs font-mono text-gray-400 mt-2">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{quickViewProduct.rating}</span>
              </div>
              <span>•</span>
              <span className="text-emerald-400 font-bold">IN STOCK ({quickViewProduct.stock || 4} UNITS IN DUBAI)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A] flex justify-between items-center">
            <div>
              <div className="text-[10px] font-mono text-gray-500">DUBAI LAUNCH PRICE</div>
              <div className="font-mono text-2xl font-black text-[#FF1A1A]">
                {quickViewProduct.price.toLocaleString()} <span className="text-xs text-white">AED</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-mono text-gray-500">TABBY 4X INSTALLMENTS</div>
              <div className="text-xs font-mono text-white font-bold">
                {Math.round((quickViewProduct.price / 4) * 100) / 100} AED/mo
              </div>
            </div>
          </div>

          {/* Color Switcher */}
          {quickViewProduct.colors && (
            <div>
              <div className="text-xs font-mono text-gray-400 uppercase mb-2">
                COLOR VARIANT: <strong className="text-white">{selectedColor}</strong>
              </div>
              <div className="flex gap-2">
                {quickViewProduct.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      playClick();
                      setSelectedColor(c.name);
                    }}
                    className={`px-3 py-2 rounded-xl font-mono text-xs transition-all border cursor-pointer ${
                      selectedColor === c.name
                        ? 'bg-[#E10600] text-white border-[#FF1A1A] font-bold shadow-[0_0_10px_rgba(225,6,0,0.5)]'
                        : 'bg-[#141414] text-gray-400 border-[#2A2A2A] hover:border-gray-600'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                playClick();
                addToCart(quickViewProduct, quantity, { color: selectedColor });
                setQuickViewProduct(null);
              }}
              className="cyber-button-primary flex-1 py-4 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(225,6,0,0.5)]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ADD TO LOADOUT</span>
            </button>

            <button
              onClick={() => {
                playClick();
                addToCart(quickViewProduct, quantity, { color: selectedColor });
                setQuickViewProduct(null);
                setIsCheckoutOpen(true);
              }}
              className="cyber-button-secondary py-4 px-5 rounded-xl text-xs font-mono font-bold cursor-pointer"
            >
              BUY NOW
            </button>
          </div>

          {/* Key Features List */}
          <div className="text-xs font-sans text-gray-300 flex flex-col gap-1.5 pt-2 border-t border-[#2A2A2A]">
            {quickViewProduct.features?.slice(0, 4).map((f, i) => (
              <div key={i} className="flex items-start gap-2 font-mono text-[11px]">
                <Check className="w-3.5 h-3.5 text-[#E10600] flex-shrink-0 mt-0.5" />
                <span>{f}</span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
