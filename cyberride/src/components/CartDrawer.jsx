import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { playClick, playWipe, playBeep } from '../utils/audioSynth';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight, Tag } from 'lucide-react';

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotalAED,
    discountAmountAED,
    freeDeliveryThreshold,
    freeShippingEligible,
    shippingCostAED,
    vatAED,
    totalAED,
    promoCode,
    setPromoCode,
    promoApplied,
    applyPromo,
    setIsCheckoutOpen
  } = useCart();

  const [promoMsg, setPromoMsg] = useState('');

  if (!isCartOpen) return null;

  const neededForFreeShipping = Math.max(0, freeDeliveryThreshold - subtotalAED);
  const progressPercent = Math.min(100, (subtotalAED / freeDeliveryThreshold) * 100);

  const handleApplyCode = (e) => {
    e.preventDefault();
    if (!promoCode) return;
    const res = applyPromo(promoCode);
    setPromoMsg(res.message);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-[#0A0A0A] border-l border-[#E10600]/30 h-full flex flex-col justify-between shadow-2xl relative">
        
        {/* Cart Header */}
        <div className="p-6 border-b border-[#2A2A2A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#E10600]" />
            <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">
              EQUIPMENT LOADOUT ({cart.reduce((a, b) => a + b.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={() => {
              playClick();
              setIsCartOpen(false);
            }}
            className="p-1.5 rounded bg-[#141414] border border-[#2A2A2A] text-gray-400 hover:text-white hover:border-[#E10600] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-[#141414] px-6 py-3 border-b border-[#2A2A2A]">
          <div className="flex justify-between items-center text-xs font-mono mb-1.5">
            <span className="text-gray-300">DUBAI EXPRESS FREE DELIVERY</span>
            <span className="text-[#FF1A1A] font-bold">
              {freeShippingEligible ? 'QUALIFIED FOR FREE DELIVERY' : `ADD ${neededForFreeShipping.toLocaleString()} AED`}
            </span>
          </div>
          <div className="w-full h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#E10600] to-[#FF1A1A] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-12">
              <ShoppingBag className="w-12 h-12 stroke-1 mb-3 text-[#2A2A2A]" />
              <p className="font-mono text-xs uppercase tracking-wider">LOADOUT IS CURRENTLY EMPTY</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div
                key={`${item.product.id}-${item.selectedColor}-${idx}`}
                className="bg-[#141414] p-4 rounded-xl border border-[#2A2A2A] flex gap-4 items-center relative"
              >
                {/* Visual Icon */}
                <div className="w-16 h-16 rounded-lg bg-black border border-[#E10600]/40 flex items-center justify-center text-[#FF1A1A] font-bold text-xs font-mono flex-shrink-0">
                  {item.product.sku}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-display font-bold text-xs text-white truncate">
                    {item.product.name}
                  </h4>
                  <div className="text-[10px] font-mono text-gray-400 mt-0.5">
                    COLOR: <span className="text-white">{item.selectedColor}</span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-[#2A2A2A] rounded bg-black">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedColor, -1)}
                        className="px-2 py-0.5 text-gray-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-mono font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedColor, 1)}
                        className="px-2 py-0.5 text-gray-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                      className="text-gray-500 hover:text-[#FF1A1A] text-xs transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="font-mono text-sm font-bold text-[#FF1A1A]">
                  {(item.product.price * item.quantity).toLocaleString()} <span className="text-[10px] text-white">AED</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer & Checkout */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-[#2A2A2A] bg-[#0E0E0E] flex flex-col gap-4">
            
            {/* Access Code Coupon */}
            <form onSubmit={handleApplyCode} className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="ENTER ACCESS CODE (e.g. DUBAI10)"
                className="flex-1 px-3 py-2 rounded bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-white placeholder-gray-500 uppercase focus:outline-none focus:border-[#E10600]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded bg-[#1F1F1F] border border-[#2A2A2A] text-xs font-mono font-bold text-white hover:border-[#E10600]"
              >
                APPLY
              </button>
            </form>
            {promoMsg && (
              <div className="text-[11px] font-mono text-[#FF1A1A] font-bold">{promoMsg}</div>
            )}

            {/* Price Calculations */}
            <div className="flex flex-col gap-1.5 text-xs font-mono text-gray-300 pt-2 border-t border-[#1F1F1F]">
              <div className="flex justify-between">
                <span>SUBTOTAL:</span>
                <span className="text-white">{subtotalAED.toLocaleString()} AED</span>
              </div>
              {discountAmountAED > 0 && (
                <div className="flex justify-between text-[#FF1A1A]">
                  <span>DISCOUNT:</span>
                  <span>-{discountAmountAED.toLocaleString()} AED</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>DUBAI DELIVERY:</span>
                <span className="text-white">{shippingCostAED === 0 ? 'FREE' : `${shippingCostAED} AED`}</span>
              </div>
              <div className="flex justify-between">
                <span>UAE VAT (5%):</span>
                <span className="text-white">{vatAED.toLocaleString()} AED</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-[#2A2A2A]">
                <span>TOTAL AED:</span>
                <span className="text-[#FF1A1A] font-mono font-black">{totalAED.toLocaleString()} AED</span>
              </div>
            </div>

            {/* Initiate Checkout CTA */}
            <button
              onClick={() => {
                playWipe();
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="cyber-button-primary w-full py-4 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(225,6,0,0.5)]"
            >
              <span>INITIATE CHECKOUT — {totalAED.toLocaleString()} AED</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
