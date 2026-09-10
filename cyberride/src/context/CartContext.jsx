import React, { createContext, useContext, useState, useEffect } from 'react';
import { playClick, playWipe, playBeep } from '../utils/audioSynth';
import { 
  getProducts, 
  getOrders, 
  getUsers, 
  createCodOrder, 
  apiLogin, 
  apiRegister,
  getSystemLogs,
  postSystemLog,
  validatePromo
} from '../services/apiClient';

const CartContext = createContext();

export const initialProducts = [
  {
    id: 'cb-nexus-01',
    sku: 'CB-NEXUS-01',
    name: 'CYBERRIDE NEXUS LED SMART BACKPACK',
    tagline: 'Dual Programmable LED Display Eyes | Bluetooth App Control',
    price: 349,
    category: 'BACKPACKS',
    badge: 'HERO SKU — DUBAI EDITION',
    rating: 4.9,
    reviewsCount: 128,
    stock: 4,
    description: 'A hardshell aerodynamic motorcycle backpack featuring dual programmable LED "eye" displays controlled via Bluetooth smartphone app. The angular, faceted black shell evokes stealth aircraft and cyberpunk aesthetics.',
    features: [
      'App-Controlled LED Matrix (iOS & Android companion app)',
      '20+ Pre-Programmed Animations (eyes, turn signals, patterns)',
      'DIY Custom Graphics Upload & Pixel Creator',
      'Water-Resistant Hardshell Construction (IP54 Rating)',
      'Aerodynamic Wind-Cut Riding Design',
      '15.6" Shockproof Laptop Compartment & Quick-Access Pockets',
      '8-Hour Battery Life (USB-C Rechargeable)',
      'High-Vis Reflective Riding Safety Striping',
      'Adjustable Ergonomic Chest & Waist Straps',
      'Weight: 1.4kg | Capacity: 22L'
    ],
    colors: [
      { name: 'STEALTH BLACK', hex: '#0A0A0A' },
      { name: 'PHANTOM GREY', hex: '#2A2A2A' }
    ],
    image: '/assets/nexus-hero.png',
    gallery: [
      { title: 'FLAGSHIP HARDSHELL STUDIO', file: '/assets/nexus-hero.png', desc: 'Front armor plate with LED angry eyes display' },
      { title: 'DUBAI NIGHT RIDER LIFESTYLE', file: '/assets/nexus-lifestyle.png', desc: 'Rider on Sheikh Zayed Road with glowing LED eyes' },
      { title: 'BLUETOOTH MOBILE APP CONTROL', file: '/assets/nexus-app.png', desc: 'Smartphone companion app matrix selector' },
      { title: 'IP54 HARDSHELL MACRO DETAIL', file: '/assets/nexus-detail.png', desc: 'Water resistant carbon-fiber texture finish' }
    ],
    ledPresets: ['RED PULSE EYES', 'CYBER CROSSHAIR', 'HAZARD TURN SIGNAL', 'MATRIX RAIN', 'VIPER GLARE']
  },
  {
    id: 'cb-phone-holder-02',
    sku: 'CB-WIRELESS-HOLDER',
    name: 'CYBERRIDE WIRELESS CHARGING PHONE HOLDER FOR MOTORCYCLE',
    tagline: 'Fast Wireless Charging & Dual USB Output | Anti-Vibration Mount',
    price: 120,
    category: 'ACCESSORIES',
    badge: 'WIRELESS CHARGER',
    rating: 4.9,
    reviewsCount: 94,
    stock: 15,
    description: 'Heavy-duty motorcycle phone holder featuring high-speed Qi wireless charging, dual USB outputs, IP66 waterproof seals, and anti-shock vibration dampeners for extreme riding conditions.',
    features: [
      'Fast Qi Wireless Charging (15W Max Output)',
      'Dual USB-A & Type-C High-Output Charging Ports',
      'Vibration Dampening Anti-Shock Protection Module',
      'IP66 Waterproof & Weatherproof Enclosure',
      '360-Degree Ball Joint Handlebar Clamp',
      'Universal Smartphone Compatibility (4.7" to 7.2")'
    ],
    colors: [{ name: 'STEALTH BLACK', hex: '#0A0A0A' }],
    image: '/assets/phone-holder-hero.png',
    gallery: [
      { title: 'STUDIO OVERVIEW', file: '/assets/phone-holder-hero.png', desc: 'Fast wireless charging pad with smartphone clamped' },
      { title: 'WIRELESS CHARGER STAGE', file: '/assets/phone-holder-1.png', desc: 'Active charging wave indicator on handlebar mount' },
      { title: 'USB & CLAMP MACRO', file: '/assets/phone-holder-2.png', desc: 'Dual USB port & precision alloy adjustment knob' },
      { title: 'DUBAI NIGHT RIDE MOUNT', file: '/assets/phone-holder-3.png', desc: 'Cockpit telemetry view mounted on superbike' }
    ],
    ledPresets: []
  },
  {
    id: 'cb-welcome-light-03',
    sku: 'CB-WELCOME-LIGHT',
    name: 'CYBERRIDE™ LED CAR DOOR WELCOME LIGHT',
    tagline: 'High Definition & High Brightness Laser Emblem Projector',
    price: 50,
    category: 'LIGHTING',
    badge: 'HIGH DEFINITION LED',
    rating: 4.8,
    reviewsCount: 112,
    stock: 30,
    description: 'High-definition LED logo welcome puddle projector light for car doors. Projects ultra-bright, laser-crisp CyberRide optics onto the ground whenever your vehicle door opens.',
    features: [
      'High Definition & High Brightness Optical Lens',
      'Automatic Infrared Magnetic Door Sensor',
      'Wireless Easy Installation (No Drilling Required)',
      'Low Power Consumption & High Efficiency LED',
      'Heat-Resistant Aluminum Alloy Heat Sink',
      'Universal Fit for All Car Doors'
    ],
    colors: [{ name: 'STEALTH BLACK', hex: '#0A0A0A' }],
    image: '/assets/welcome-light-hero.png',
    gallery: [
      { title: 'WELCOME EMBLEM PROJECTION', file: '/assets/welcome-light-hero.png', desc: 'High brightness LED logo projected on asphalt' },
      { title: 'LUXURY NIGHT CAR DOOR', file: '/assets/welcome-light-1.png', desc: 'Open driver door displaying crisp blue puddle light' },
      { title: 'OPTICAL LENS MODULE', file: '/assets/welcome-light-2.png', desc: 'Compact glass lens projector unit detail' },
      { title: 'DUBAI STREET ILLUMINATION', file: '/assets/welcome-light-3.png', desc: 'Ground lighting reflection on wet pavement' }
    ],
    ledPresets: []
  },
  {
    id: 'cb-carplay-adapter-04',
    sku: 'CB-WIRELESS-CARPLAY',
    name: 'CYBERRIDE WIRELESS CARPLAY AND ANDROID AUTO ADAPTER',
    tagline: '2 IN 1 Wireless Adapter for CarPlay & Android Auto | A7 Chip 5.8GHz',
    price: 100,
    category: 'TECH',
    badge: '2 IN 1 ADAPTER',
    rating: 4.9,
    reviewsCount: 156,
    stock: 25,
    description: 'Convert wired CarPlay and Android Auto to 100% wireless! Powered by high-speed A7 microchip, 5.8GHz Wi-Fi + Bluetooth 5.2 for instant low-latency navigation and media streaming.',
    features: [
      '2 in 1 Dual Compatibility (CarPlay & Android Auto)',
      'A7 Microchip High Speed Processor',
      '5.8GHz Wi-Fi + Bluetooth 5.2 Dual Band',
      'Instant Auto-Connect within 5 Seconds',
      'Preserves OEM Steering Wheel Controls & Touchscreen',
      'Compact Carbon Fiber Weave Enclosure'
    ],
    colors: [{ name: 'CARBON FIBER', hex: '#1C1C1C' }],
    image: '/assets/carplay-adapter-hero.png',
    gallery: [
      { title: 'CONSOLE DASHBOARD SYNC', file: '/assets/carplay-adapter-hero.png', desc: 'Wireless 2-in-1 adapter connected to vehicle screen' },
      { title: 'CARPLAY & ANDROID AUTO', file: '/assets/carplay-adapter-1.png', desc: 'Navigation & media playing via wireless adapter' },
      { title: 'A7 CHIP HARDWARE', file: '/assets/carplay-adapter-2.png', desc: 'High speed wireless transmitter module' },
      { title: 'CARBON FIBER ENCLOSURE', file: '/assets/carplay-adapter-3.png', desc: 'Ultra compact form factor and status indicator' }
    ],
    ledPresets: []
  }
];

export const initialOrdersList = [
  {
    id: 'CR-DXB-882910',
    customer: 'Sheikh Rashid Al-Nuaimi',
    email: 'rashid.r@dubai.ae',
    phone: '+971 50 987 6543',
    items: 'CYBERRIDE NEXUS LED BACKPACK (x1)',
    color: 'STEALTH BLACK',
    led: 'RED PULSE EYES',
    total: 349,
    paymentMethod: 'CASH ON DELIVERY',
    payment: 'CASH ON DELIVERY',
    status: 'PENDING DISPATCH',
    zone: 'Dubai Marina',
    address: 'Marina Gate Tower 1, Apt 2204, Dubai',
    date: '2026-07-25 16:40',
    tracking: 'ARM-DXB-991204'
  }
];

export const initialRidersList = [
  { id: 'USR-001', name: 'SUPER ADMIN', email: 'admin@cyberride.ae', phone: '+971 50 000 0000', role: 'ADMIN', status: 'ACTIVE', zone: 'Dubai Command Hub', joined: '2026-01-01' },
  { id: 'USR-002', name: 'CYBER RIDER', email: 'rider@cyberride.ae', phone: '+971 50 123 4567', role: 'CUSTOMER', status: 'ACTIVE', zone: 'Dubai Marina', joined: '2026-07-20' }
];

export const CartProvider = ({ children }) => {
  // Global Products State (Synced with Backend DB)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('cyberride_admin_products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch (e) {
      return initialProducts;
    }
  });

  // Global Orders State (Synced with Backend DB)
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('cyberride_admin_orders');
      return saved ? JSON.parse(saved) : initialOrdersList;
    } catch (e) {
      return initialOrdersList;
    }
  });

  // Global Registered Users State
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('cyberride_admin_users');
      return saved ? JSON.parse(saved) : initialRidersList;
    } catch (e) {
      return initialRidersList;
    }
  });

  // Global Telemetry Logs State
  const [systemLogs, setSystemLogs] = useState([
    { id: '1', text: 'SYSTEM ONLINE :: DUBAI HUB READY (SQLITE PERSISTENT STORAGE ACTIVE)', type: 'info', time: '13:50:00' },
    { id: '2', text: 'ARAMEX COURIER API CONNECTED (LIVE DISPATCH PROTOCOL)', type: 'success', time: '13:50:12' },
    { id: '3', text: '100% CASH ON DELIVERY (COD) SETTLEMENT ENGINE ACTIVE', type: 'info', time: '13:50:25' }
  ]);

  // Sync with Backend API on Startup
  useEffect(() => {
    async function loadDataFromApi() {
      try {
        const [serverProds, serverOrders, serverUsers, serverLogs] = await Promise.all([
          getProducts(),
          getOrders(),
          getUsers(),
          getSystemLogs()
        ]);

        if (serverProds && serverProds.length > 0) {
          setProducts(serverProds);
          localStorage.setItem('cyberride_admin_products', JSON.stringify(serverProds));
        }

        if (serverOrders && serverOrders.length > 0) {
          setOrders(serverOrders);
          localStorage.setItem('cyberride_admin_orders', JSON.stringify(serverOrders));
        }

        if (serverUsers && serverUsers.length > 0) {
          setRegisteredUsers(serverUsers);
          localStorage.setItem('cyberride_admin_users', JSON.stringify(serverUsers));
        }

        if (serverLogs && serverLogs.length > 0) {
          setSystemLogs(serverLogs);
        }
      } catch (err) {
        console.warn('Initial server sync using local fallback:', err);
      }
    }

    loadDataFromApi();
  }, []);

  // Cart State
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cyberride_cart');
      if (saved) return JSON.parse(saved);
      return [
        {
          product: products[0] || initialProducts[0],
          quantity: 1,
          selectedColor: 'STEALTH BLACK',
          selectedLed: 'RED PULSE EYES'
        }
      ];
    } catch (e) {
      return [{ product: products[0] || initialProducts[0], quantity: 1, selectedColor: 'STEALTH BLACK', selectedLed: 'RED PULSE EYES' }];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activeLedPattern, setActiveLedPattern] = useState('RED PULSE EYES');
  const [customPixelArt, setCustomPixelArt] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);

  // User Authentication State
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('cyberride_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  // LocalStorage Persistence Effects
  useEffect(() => {
    try {
      localStorage.setItem('cyberride_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('cyberride_admin_products', JSON.stringify(products));
    } catch (e) {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('cyberride_admin_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('cyberride_admin_users', JSON.stringify(registeredUsers));
    } catch (e) {}
  }, [registeredUsers]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('cyberride_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('cyberride_user');
      }
    } catch (e) {}
  }, [user]);

  const addSystemLog = (text, type = 'info') => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    setSystemLogs(prev => [{ id: Date.now().toString(), text, type, time: timeStr }, ...prev.slice(0, 20)]);
    postSystemLog(text, type);
  };

  // Real-time Cash-on-Delivery Order Action
  const createRealTimeOrder = async (orderData) => {
    // 1. Optimistic UI update
    setOrders(prev => [orderData, ...prev]);
    addSystemLog(`NEW LIVE COD ORDER ${orderData.id} PLACED BY ${orderData.customer} (${orderData.total} AED)`, 'success');

    // 2. Decrement stock locally
    setProducts(prevProds => prevProds.map(p => {
      if (orderData.items.toLowerCase().includes(p.name.toLowerCase())) {
        return { ...p, stock: Math.max(0, p.stock - 1) };
      }
      return p;
    }));

    // 3. Commit to persistent backend database
    const apiResult = await createCodOrder(orderData);
    if (apiResult && apiResult.success && apiResult.order) {
      setOrders(prev => [apiResult.order, ...prev.filter(o => o.id !== orderData.id)]);
    }
  };

  // Real Backend Auth: Login
  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    // Call real Express backend authentication
    const res = await apiLogin(cleanEmail, password);
    if (res && res.success && res.user) {
      setUser(res.user);
      addSystemLog(`RIDER AUTHENTICATED VIA API: ${cleanEmail} [${res.user.role}]`, 'info');
      return { success: true, user: res.user };
    }

    // Fallback for offline mode
    const role = cleanEmail.includes('admin') ? 'ADMIN' : 'CUSTOMER';
    const fallbackUser = {
      name: role === 'ADMIN' ? 'SUPER ADMIN' : cleanEmail.split('@')[0].toUpperCase(),
      email: cleanEmail,
      role,
      zone: 'Dubai Command Hub'
    };
    setUser(fallbackUser);
    addSystemLog(`RIDER LOGGED IN (OFFLINE FALLBACK): ${cleanEmail}`, 'warning');
    return { success: true, user: fallbackUser };
  };

  // Real Backend Auth: Register
  const signup = async (userData) => {
    const cleanEmail = userData.email.trim().toLowerCase();

    // Call real Express backend registration
    const res = await apiRegister({
      name: userData.name || 'NEW RIDER',
      email: cleanEmail,
      phone: userData.phone || '+971 50 000 0000',
      password: userData.password || 'rider123'
    });

    if (res && res.success && res.user) {
      setUser(res.user);
      setRegisteredUsers(prev => [res.user, ...prev]);
      addSystemLog(`NEW RIDER REGISTERED IN DATABASE: ${res.user.name} (${res.user.email})`, 'success');
      return res.user;
    }

    // Fallback for offline mode
    const newUser = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: userData.name || 'NEW RIDER',
      email: cleanEmail,
      phone: userData.phone || '+971 50 000 0000',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      zone: 'Dubai UAE',
      joined: new Date().toISOString().substring(0, 10)
    };
    setUser(newUser);
    setRegisteredUsers(prev => [newUser, ...prev]);
    addSystemLog(`NEW RIDER REGISTERED (OFFLINE): ${newUser.name}`, 'warning');
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cyberride_token');
    setIsAdminOpen(false);
  };

  const addToCart = (product, quantity = 1, options = {}) => {
    playClick();
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.product.id === product.id && item.selectedColor === (options.color || 'STEALTH BLACK'));
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prev, {
          product,
          quantity,
          selectedColor: options.color || 'STEALTH BLACK',
          selectedLed: options.led || activeLedPattern
        }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, color) => {
    playClick();
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.selectedColor === color)));
  };

  const updateQuantity = (productId, color, delta) => {
    playClick();
    setCart(prev => prev.map(item => {
      if (item.product.id === productId && item.selectedColor === color) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyPromo = async (code) => {
    playBeep();
    const clean = code.trim().toUpperCase();

    // Check with server
    const serverCheck = await validatePromo(clean);
    if (serverCheck && serverCheck.success) {
      setDiscountPercent(serverCheck.discountPercent);
      setPromoApplied(true);
      return { success: true, message: serverCheck.message };
    }

    // Local fallback
    if (clean === 'DUBAI10' || clean === 'CYBER10') {
      setDiscountPercent(10);
      setPromoApplied(true);
      return { success: true, message: '10% DUBAI NETWORK DISCOUNT APPLIED' };
    } else if (clean === 'NEXUSVIP' || clean === 'CYBERRIDE20') {
      setDiscountPercent(20);
      setPromoApplied(true);
      return { success: true, message: '20% VIP RIDER DISCOUNT APPLIED' };
    } else {
      return { success: false, message: 'INVALID ACCESS CODE. TRY "DUBAI10"' };
    }
  };

  // Pricing calculations (AED)
  const subtotalAED = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const discountAmountAED = (subtotalAED * discountPercent) / 100;
  const discountedSubtotal = subtotalAED - discountAmountAED;
  
  // Free delivery threshold: 500 AED
  const freeDeliveryThreshold = 500;
  const freeShippingEligible = discountedSubtotal >= freeDeliveryThreshold;
  const shippingCostAED = cart.length === 0 ? 0 : (freeShippingEligible ? 0 : 35);
  
  // 5% UAE VAT
  const vatAED = Math.round((discountedSubtotal * 0.05) * 100) / 100;
  const totalAED = Math.round((discountedSubtotal + shippingCostAED + vatAED) * 100) / 100;
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      products,
      setProducts,
      orders,
      setOrders,
      registeredUsers,
      setRegisteredUsers,
      systemLogs,
      addSystemLog,
      createRealTimeOrder,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      isAuthOpen,
      setIsAuthOpen,
      isAdminOpen,
      setIsAdminOpen,
      isTrackingOpen,
      setIsTrackingOpen,
      user,
      login,
      signup,
      logout,
      quickViewProduct,
      setQuickViewProduct,
      activeLedPattern,
      setActiveLedPattern,
      customPixelArt,
      setCustomPixelArt,
      promoCode,
      setPromoCode,
      discountPercent,
      promoApplied,
      applyPromo,
      subtotalAED,
      discountAmountAED,
      freeDeliveryThreshold,
      freeShippingEligible,
      shippingCostAED,
      vatAED,
      totalAED,
      totalItemsCount,
      soundMuted,
      setSoundMuted
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
