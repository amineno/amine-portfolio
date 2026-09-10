import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { playClick, playBeep, playSuccess } from '../utils/audioSynth';
import { 
  ShieldCheck, 
  X, 
  TrendingUp, 
  Package, 
  Users, 
  AlertTriangle, 
  Printer, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  BarChart3,
  MapPin,
  Search,
  Download,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  UserPlus,
  Check,
  Lock,
  Radio,
  Sliders,
  ArrowUpRight,
  Zap,
  Tag,
  Truck,
  Activity,
  Terminal
} from 'lucide-react';

export const AdminDashboard = ({ isOpen, onClose }) => {
  const {
    orders,
    setOrders,
    products,
    setProducts,
    registeredUsers,
    setRegisteredUsers,
    systemLogs,
    addSystemLog,
    createRealTimeOrder
  } = useCart();

  const [activeTab, setActiveTab] = useState('ORDERS'); // 'ORDERS', 'PRODUCTS', 'RIDERS', 'ANALYTICS', 'SETTINGS'

  // Orders Search & Filter State
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [selectedOrderModal, setSelectedOrderModal] = useState(null);
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);

  // New Order Form State
  const [newOrderCustomer, setNewOrderCustomer] = useState('');
  const [newOrderEmail, setNewOrderEmail] = useState('');
  const [newOrderPhone, setNewOrderPhone] = useState('');
  const [newOrderZone, setNewOrderZone] = useState('Dubai Downtown');
  const [newOrderAddress, setNewOrderAddress] = useState('');
  const [newOrderQty, setNewOrderQty] = useState(1);
  const [newOrderPayment, setNewOrderPayment] = useState('CASH ON DELIVERY');

  // Products Search & Edit State
  const [productSearch, setProductSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(299);
  const [newProdStock, setNewProdStock] = useState(10);
  const [newProdDesc, setNewProdDesc] = useState('');

  // Riders Search State
  const [riderSearch, setRiderSearch] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState('USER');

  // Analytics timeframe
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('30DAYS');

  // Settings State
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [codEnabled, setCodEnabled] = useState(true);
  const [freeShipThreshold, setFreeShipThreshold] = useState(500);
  const [promoCodes, setPromoCodes] = useState([
    { code: 'DUBAI10', discount: 10, uses: 142, active: true },
    { code: 'NEXUSVIP', discount: 20, uses: 49, active: true },
    { code: 'CYBERRIDE20', discount: 20, uses: 88, active: true }
  ]);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState(15);

  if (!isOpen) return null;

  // Handlers for Orders
  const updateOrderStatus = (orderId, newStatus) => {
    playClick();
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    addSystemLog(`ORDER #${orderId} STATUS UPDATED TO: ${newStatus}`, 'info');
    if (selectedOrderModal && selectedOrderModal.id === orderId) {
      setSelectedOrderModal(prev => ({ ...prev, status: newStatus }));
    }
  };

  const deleteOrder = (orderId) => {
    playClick();
    setOrders(prev => prev.filter(o => o.id !== orderId));
    addSystemLog(`ORDER RECORD #${orderId} DELETED BY ADMIN`, 'warning');
    if (selectedOrderModal && selectedOrderModal.id === orderId) {
      setSelectedOrderModal(null);
    }
  };

  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (!newOrderCustomer || !newOrderEmail) return;
    playSuccess();
    const newId = `CR-DXB-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrd = {
      id: newId,
      customer: newOrderCustomer,
      email: newOrderEmail,
      phone: newOrderPhone || '+971 50 123 4567',
      items: `CYBERRIDE NEXUS LED BACKPACK (x${newOrderQty})`,
      color: 'STEALTH BLACK',
      led: 'RED PULSE EYES',
      total: 349 * newOrderQty,
      payment: newOrderPayment,
      status: 'PENDING DISPATCH',
      zone: newOrderZone,
      address: newOrderAddress || `${newOrderZone}, Dubai, UAE`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      tracking: `ARM-DXB-${Math.floor(100000 + Math.random() * 900000)}`
    };
    
    createRealTimeOrder(newOrd);
    setIsAddOrderOpen(false);
    setNewOrderCustomer('');
    setNewOrderEmail('');
    setNewOrderPhone('');
    setNewOrderAddress('');
  };

  const exportOrdersCSV = () => {
    playClick();
    const headers = ['Order ID', 'Customer', 'Email', 'Phone', 'Items', 'Total AED', 'Payment', 'Status', 'Zone', 'Date'];
    const rows = orders.map(o => [
      o.id,
      `"${o.customer}"`,
      o.email,
      o.phone,
      `"${o.items}"`,
      o.total,
      o.payment,
      o.status,
      `"${o.zone}"`,
      o.date
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CyberRide_Live_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handlers for Products
  const updateStock = (productId, newStock) => {
    playClick();
    const safeStock = Math.max(0, newStock);
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: safeStock } : p));
    const targetProd = products.find(p => p.id === productId);
    if (targetProd) {
      addSystemLog(`STOCK ADJUSTED: ${targetProd.name} → ${safeStock} UNITS`, 'info');
    }
  };

  const handleSaveProductEdit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    playSuccess();
    setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
    addSystemLog(`PRODUCT SKU UPDATED: ${editingProduct.sku} (${editingProduct.price} AED)`, 'info');
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId) => {
    playClick();
    const targetProd = products.find(p => p.id === productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
    if (targetProd) {
      addSystemLog(`SKU ARCHIVED: ${targetProd.name}`, 'warning');
    }
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProdName || !newProdSku) return;
    playSuccess();
    const newProd = {
      id: `cb-custom-${Date.now()}`,
      sku: newProdSku.toUpperCase(),
      name: newProdName.toUpperCase(),
      tagline: 'Custom CyberRide Gear',
      price: Number(newProdPrice),
      category: 'HARDWARE',
      badge: 'NEW ARRIVAL',
      rating: 5.0,
      stock: Number(newProdStock),
      description: newProdDesc || 'High-performance cyberpunk hardware accessory.'
    };
    setProducts(prev => [...prev, newProd]);
    addSystemLog(`NEW SKU CREATED: ${newProd.sku} (${newProd.name})`, 'success');
    setIsAddProductOpen(false);
    setNewProdName('');
    setNewProdSku('');
    setNewProdPrice(299);
    setNewProdStock(10);
    setNewProdDesc('');
  };

  // Handlers for Riders / Users
  const toggleRiderRole = (riderId) => {
    playClick();
    setRegisteredUsers(prev => prev.map(r => {
      if (r.id === riderId) {
        const nextRole = r.role === 'ADMIN' ? 'USER' : 'ADMIN';
        addSystemLog(`ROLE CHANGED FOR ${r.name}: ${nextRole}`, 'warning');
        return { ...r, role: nextRole };
      }
      return r;
    }));
  };

  const toggleRiderStatus = (riderId) => {
    playClick();
    setRegisteredUsers(prev => prev.map(r => {
      if (r.id === riderId) {
        const nextStatus = r.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        addSystemLog(`USER STATUS CHANGED FOR ${r.name}: ${nextStatus}`, 'warning');
        return { ...r, status: nextStatus };
      }
      return r;
    }));
  };

  const deleteRider = (riderId) => {
    playClick();
    const targetUser = registeredUsers.find(r => r.id === riderId);
    setRegisteredUsers(prev => prev.filter(r => r.id !== riderId));
    if (targetUser) {
      addSystemLog(`RIDER ACCOUNT REMOVED: ${targetUser.name}`, 'warning');
    }
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    playSuccess();
    const newRiderObj = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: newUserName,
      email: newUserEmail,
      phone: newUserPhone || '+971 50 123 4567',
      role: newUserRole,
      status: 'ACTIVE',
      zone: 'Dubai Hub',
      joined: new Date().toISOString().substring(0, 10)
    };
    setRegisteredUsers(prev => [newRiderObj, ...prev]);
    addSystemLog(`USER CREATED BY ADMIN: ${newRiderObj.name} (${newRiderObj.role})`, 'success');
    setIsAddUserOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
  };

  // Filtered Lists
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.email.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.zone.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesFilter = orderStatusFilter === 'ALL' || o.status.includes(orderStatusFilter);
    return matchesSearch && matchesFilter;
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredRiders = registeredUsers.filter(r =>
    r.name.toLowerCase().includes(riderSearch.toLowerCase()) ||
    r.email.toLowerCase().includes(riderSearch.toLowerCase()) ||
    r.phone.includes(riderSearch)
  );

  // Aggregated Real-time Stats
  const totalRevenueAED = orders.reduce((acc, o) => acc + o.total, 0);
  const pendingDispatchCount = orders.filter(o => o.status.includes('PENDING')).length;
  const lowStockProductsCount = products.filter(p => p.stock <= 5).length;
  const totalActiveRiders = registeredUsers.filter(r => r.status === 'ACTIVE').length;

  return (
    <div className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-2xl flex flex-col p-2 md:p-6 overflow-y-auto animate-fadeIn select-none">
      <div className="max-w-[1500px] mx-auto w-full flex-1 flex flex-col bg-[#0A0A0A] border-2 border-[#E10600]/40 rounded-2xl shadow-[0_0_80px_rgba(225,6,0,0.25)] relative overflow-hidden">
        
        {/* Neon Glow Header Line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FF1A1A] to-transparent animate-pulse" />

        {/* Top Control Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 md:p-6 border-b border-[#2A2A2A] bg-[#0E0E0E]/90">
          
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FF1A1A] to-[#990000] flex items-center justify-center text-white shadow-[0_0_25px_rgba(255,26,26,0.6)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-xl md:text-2xl text-white uppercase tracking-wider">
                  CYBERRIDE COMMAND HUB
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-[10px] font-mono text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  REAL-TIME SYNC
                </span>
              </div>
              <div className="text-xs font-mono text-gray-400 mt-0.5 flex items-center gap-2">
                <span>AUTHORIZATION: <strong className="text-[#FF1A1A]">SUPER COMMANDER</strong></span>
                <span>•</span>
                <span>REGION: <strong className="text-white">DUBAI DESIGN DISTRICT (d3)</strong></span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#141414] p-1.5 rounded-xl border border-[#2A2A2A]">
              {[
                { id: 'ORDERS', label: 'ORDERS & DISPATCH', icon: Package, badge: orders.length },
                { id: 'PRODUCTS', label: 'INVENTORY SKU', icon: Zap, badge: products.length },
                { id: 'RIDERS', label: 'RIDER NETWORK', icon: Users, badge: registeredUsers.length },
                { id: 'ANALYTICS', label: 'BUSINESS METRICS', icon: BarChart3 },
                { id: 'SETTINGS', label: 'SYSTEM CONFIG', icon: Sliders }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      playBeep();
                      setActiveTab(tab.id);
                    }}
                    className={`px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-[#E10600] text-white shadow-[0_0_15px_rgba(225,6,0,0.6)]'
                        : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    {tab.badge !== undefined && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[9px] ${
                        isActive ? 'bg-black text-white' : 'bg-[#2A2A2A] text-gray-300'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                playClick();
                onClose();
              }}
              className="p-2.5 rounded-xl bg-[#141414] border border-[#2A2A2A] text-gray-400 hover:text-white hover:border-[#E10600] hover:bg-red-950/40 transition cursor-pointer"
              title="Close Command Portal"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

        </div>

        {/* REAL-TIME LIVE TELEMETRY LOGS TICKER BAR */}
        <div className="bg-[#080808] border-b border-[#2A2A2A] px-6 py-2 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-4xl">
            <span className="flex items-center gap-1 text-[#FF1A1A] font-bold">
              <Activity className="w-3.5 h-3.5 animate-pulse" /> LIVE TELEMETRY:
            </span>
            {systemLogs.length > 0 && (
              <span className="text-gray-300 transition-all animate-fadeIn">
                <span className="text-gray-500 font-mono font-bold">[{systemLogs[0].time}]</span> {systemLogs[0].text}
              </span>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3 text-[10px] font-mono text-gray-400">
            <span>LIVE ORDERS: <strong className="text-white">{orders.length}</strong></span>
            <span>•</span>
            <span>SKU ITEMS: <strong className="text-white">{products.length}</strong></span>
            <span>•</span>
            <span>RIDERS: <strong className="text-emerald-400">{registeredUsers.length}</strong></span>
          </div>
        </div>

        {/* Top KPI Metric Cards Summary */}
        <div className="p-4 md:p-6 pb-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Revenue */}
          <div className="bg-gradient-to-br from-[#141414] to-[#0D0D0D] p-4 rounded-xl border border-[#2A2A2A] hover:border-[#E10600]/50 transition shadow-lg flex flex-col justify-between">
            <div className="flex justify-between items-start text-xs font-mono text-gray-400">
              <span className="uppercase tracking-wider">REAL-TIME GROSS REVENUE</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="font-mono text-3xl font-black text-white mt-2">
              {totalRevenueAED.toLocaleString()} <span className="text-xs text-[#FF1A1A]">AED</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 mt-2 flex items-center justify-between">
              <span>↑ Live calculated</span>
              <span className="text-gray-500">5% UAE VAT Included</span>
            </div>
          </div>

          {/* Card 2: Orders Count */}
          <div className="bg-gradient-to-br from-[#141414] to-[#0D0D0D] p-4 rounded-xl border border-[#2A2A2A] hover:border-[#E10600]/50 transition shadow-lg flex flex-col justify-between">
            <div className="flex justify-between items-start text-xs font-mono text-gray-400">
              <span className="uppercase tracking-wider">LIVE DISPATCH ORDERS</span>
              <Package className="w-4 h-4 text-[#FF1A1A]" />
            </div>
            <div className="font-mono text-3xl font-black text-white mt-2">
              {orders.length} <span className="text-xs text-gray-400">ORDERS</span>
            </div>
            <div className="text-[10px] font-mono text-amber-400 mt-2 flex items-center justify-between">
              <span>⚡ {pendingDispatchCount} Pending Dispatch</span>
              <span className="text-emerald-400">Dubai Express</span>
            </div>
          </div>

          {/* Card 3: Stock Inventory */}
          <div className={`p-4 rounded-xl border transition shadow-lg flex flex-col justify-between ${
            lowStockProductsCount > 0
              ? 'bg-gradient-to-br from-[#1A0A0A] to-[#141414] border-[#E10600]/60'
              : 'bg-[#141414] border-[#2A2A2A]'
          }`}>
            <div className="flex justify-between items-start text-xs font-mono text-gray-400">
              <span className="uppercase tracking-wider">LOW STOCK ALERTS</span>
              <AlertTriangle className={`w-4 h-4 ${lowStockProductsCount > 0 ? 'text-[#FF1A1A] animate-bounce' : 'text-emerald-400'}`} />
            </div>
            <div className="font-mono text-3xl font-black text-[#FF1A1A] mt-2">
              {lowStockProductsCount} <span className="text-xs text-white">LOW SKUs</span>
            </div>
            <div className="text-[10px] font-mono text-gray-400 mt-2 flex items-center justify-between">
              <span>Threshold: ≤ 5 units</span>
              <span className="text-[#FF1A1A] font-bold">Action Needed</span>
            </div>
          </div>

          {/* Card 4: Rider Network */}
          <div className="bg-gradient-to-br from-[#141414] to-[#0D0D0D] p-4 rounded-xl border border-[#2A2A2A] hover:border-emerald-500/50 transition shadow-lg flex flex-col justify-between">
            <div className="flex justify-between items-start text-xs font-mono text-gray-400">
              <span className="uppercase tracking-wider">REGISTERED RIDERS</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="font-mono text-3xl font-black text-emerald-400 mt-2">
              {totalActiveRiders} <span className="text-xs text-gray-400">ACTIVE</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 mt-2 flex items-center justify-between">
              <span>● {registeredUsers.filter(r => r.role === 'ADMIN').length} Super Commanders</span>
              <span className="text-gray-400">Synced Live</span>
            </div>
          </div>

        </div>

        {/* TAB CONTENTS AREA */}
        <div className="p-4 md:p-6 flex-1 flex flex-col overflow-hidden">
          
          {/* ========================================================================= */}
          {/* TAB 1: ORDERS & FULFILLMENT */}
          {/* ========================================================================= */}
          {activeTab === 'ORDERS' && (
            <div className="flex-1 bg-[#141414] rounded-xl border border-[#2A2A2A] p-5 flex flex-col overflow-hidden">
              
              {/* Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-[#2A2A2A]">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Search Bar */}
                  <div className="relative min-w-[240px]">
                    <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Search Order ID, Customer, Zone..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0A0A0A] border border-[#2A2A2A] text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#E10600]"
                    />
                  </div>

                  {/* Status Filter Dropdown */}
                  <div className="flex items-center gap-1 bg-[#0A0A0A] p-1 rounded-xl border border-[#2A2A2A]">
                    {['ALL', 'PENDING', 'PAID', 'SHIPPED', 'DELIVERED'].map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          playClick();
                          setOrderStatusFilter(st);
                        }}
                        className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition ${
                          orderStatusFilter === st
                            ? 'bg-[#E10600] text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={exportOrdersCSV}
                    className="px-3 py-2 rounded-xl bg-[#0A0A0A] border border-[#2A2A2A] hover:border-emerald-500 text-emerald-400 font-mono text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>EXPORT CSV</span>
                  </button>

                  <button
                    onClick={() => {
                      playClick();
                      setIsAddOrderOpen(true);
                    }}
                    className="cyber-button-primary px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>MANUAL ORDER</span>
                  </button>
                </div>
              </div>

              {/* Table Container */}
              <div className="flex-1 overflow-auto rounded-xl border border-[#2A2A2A] bg-[#0A0A0A]">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="sticky top-0 z-10 bg-[#141414] border-b border-[#2A2A2A] text-gray-400 uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">ORDER ID</th>
                      <th className="py-3 px-4">RIDER / CUSTOMER</th>
                      <th className="py-3 px-4">PURCHASED ITEMS</th>
                      <th className="py-3 px-4">TOTAL (AED)</th>
                      <th className="py-3 px-4">PAYMENT METHOD</th>
                      <th className="py-3 px-4">STATUS</th>
                      <th className="py-3 px-4 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1F1F1F] text-gray-300">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-gray-500 font-mono">
                          NO ORDERS MATCHING YOUR FILTER CRITERIA
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-[#141414] transition">
                          <td className="py-3.5 px-4 font-bold text-[#FF1A1A]">
                            <div className="flex items-center gap-1.5">
                              <span>{order.id}</span>
                            </div>
                            <div className="text-[9px] text-gray-500">{order.date}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">{order.customer}</div>
                            <div className="text-[10px] text-gray-400">{order.phone}</div>
                            <div className="text-[9px] text-emerald-400">{order.zone}</div>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="text-white font-medium truncate">{order.items}</div>
                            <div className="text-[9px] text-gray-400">Preset: {order.led} • Color: {order.color}</div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-white text-sm">
                            {order.total.toLocaleString()} AED
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-[#1F1F1F] border border-[#2A2A2A] text-[10px] text-gray-300">
                              {order.payment}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono focus:outline-none border cursor-pointer ${
                                order.status.includes('DELIVERED')
                                  ? 'bg-emerald-950 text-emerald-400 border-emerald-500'
                                  : order.status.includes('SHIPPED') || order.status.includes('PAID')
                                  ? 'bg-blue-950 text-blue-400 border-blue-500'
                                  : 'bg-amber-950 text-amber-400 border-amber-500'
                              }`}
                            >
                              <option value="PENDING DISPATCH">PENDING DISPATCH</option>
                              <option value="PAID & PACKED">PAID & PACKED</option>
                              <option value="SHIPPED (ARAMEX)">SHIPPED (ARAMEX)</option>
                              <option value="DELIVERED">DELIVERED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  playClick();
                                  setSelectedOrderModal(order);
                                }}
                                className="p-1.5 rounded-lg bg-[#1F1F1F] border border-[#2A2A2A] text-gray-300 hover:text-white hover:border-emerald-500 transition cursor-pointer"
                                title="View Order Telemetry Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              
                              <button
                                onClick={() => {
                                  playBeep();
                                  alert(`AIRWAY BILL PRINTING FOR ${order.id}\nCarrier: Aramex Express Dubai\nTracking: ${order.tracking}\nCustomer: ${order.customer}`);
                                }}
                                className="p-1.5 rounded-lg bg-[#1F1F1F] border border-[#2A2A2A] text-gray-300 hover:text-white hover:border-[#E10600] transition cursor-pointer"
                                title="Print Aramex Airway Bill Label"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => deleteOrder(order.id)}
                                className="p-1.5 rounded-lg bg-[#1F1F1F] border border-[#2A2A2A] text-gray-400 hover:text-red-400 hover:border-red-500 transition cursor-pointer"
                                title="Purge Order Record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: PRODUCTS & INVENTORY */}
          {/* ========================================================================= */}
          {activeTab === 'PRODUCTS' && (
            <div className="flex-1 bg-[#141414] rounded-xl border border-[#2A2A2A] p-5 flex flex-col overflow-hidden">
              
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-[#2A2A2A]">
                <div className="relative min-w-[280px]">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search Product Name, SKU..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0A0A0A] border border-[#2A2A2A] text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#E10600]"
                  />
                </div>

                <button
                  onClick={() => {
                    playClick();
                    setIsAddProductOpen(true);
                  }}
                  className="cyber-button-primary px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD NEW SKU PRODUCT</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-1">
                {filteredProducts.map((p) => (
                  <div 
                    key={p.id} 
                    className={`p-5 rounded-xl bg-[#0A0A0A] border transition-all flex flex-col justify-between relative overflow-hidden group ${
                      p.stock <= 5 ? 'border-[#E10600]/80 shadow-[0_0_20px_rgba(225,6,0,0.2)]' : 'border-[#2A2A2A] hover:border-[#E10600]/50'
                    }`}
                  >
                    {p.badge && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#141414] border border-[#E10600]/40 text-[9px] font-mono text-[#FF1A1A] font-bold">
                        {p.badge}
                      </span>
                    )}

                    <div>
                      <div className="text-[10px] font-mono text-[#FF1A1A] font-bold">{p.sku}</div>
                      <h4 className="font-display font-bold text-base text-white mt-1 pr-16">{p.name}</h4>
                      <p className="text-xs font-sans text-gray-400 mt-1 line-clamp-2">{p.description}</p>
                      
                      <div className="font-mono text-xl font-black text-white mt-3 flex items-baseline gap-1">
                        <span>{p.price.toLocaleString()}</span>
                        <span className="text-xs text-[#FF1A1A]">AED</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#1F1F1F] flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-mono text-gray-400">STOCK IN HAND:</div>
                        <div className={`font-mono text-sm font-bold flex items-center gap-1 ${
                          p.stock <= 5 ? 'text-[#FF1A1A]' : 'text-emerald-400'
                        }`}>
                          {p.stock <= 5 && <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />}
                          <span>{p.stock} UNITS</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Adjust Stock Buttons */}
                        <div className="flex items-center gap-1 bg-[#141414] p-1 rounded-lg border border-[#2A2A2A]">
                          <button
                            onClick={() => updateStock(p.id, p.stock - 1)}
                            className="w-6 h-6 rounded bg-[#1F1F1F] hover:bg-[#E10600] text-white flex items-center justify-center font-bold transition cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-7 text-center font-mono font-bold text-xs text-white">{p.stock}</span>
                          <button
                            onClick={() => updateStock(p.id, p.stock + 1)}
                            className="w-6 h-6 rounded bg-[#1F1F1F] hover:bg-[#E10600] text-white flex items-center justify-center font-bold transition cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Edit Button */}
                        <button
                          onClick={() => {
                            playClick();
                            setEditingProduct(p);
                          }}
                          className="p-2 rounded-lg bg-[#141414] border border-[#2A2A2A] hover:border-emerald-500 text-gray-300 hover:text-emerald-400 transition cursor-pointer"
                          title="Edit Product Details"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-2 rounded-lg bg-[#141414] border border-[#2A2A2A] hover:border-red-500 text-gray-400 hover:text-red-400 transition cursor-pointer"
                          title="Archive SKU"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: RIDER NETWORK (USER MANAGEMENT) */}
          {/* ========================================================================= */}
          {activeTab === 'RIDERS' && (
            <div className="flex-1 bg-[#141414] rounded-xl border border-[#2A2A2A] p-5 flex flex-col overflow-hidden">
              
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-[#2A2A2A]">
                <div className="relative min-w-[280px]">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={riderSearch}
                    onChange={(e) => setRiderSearch(e.target.value)}
                    placeholder="Search Rider Name, Email, Phone..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0A0A0A] border border-[#2A2A2A] text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#E10600]"
                  />
                </div>

                <button
                  onClick={() => {
                    playClick();
                    setIsAddUserOpen(true);
                  }}
                  className="cyber-button-primary px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>REGISTER NEW USER ACCOUNT</span>
                </button>
              </div>

              <div className="flex-1 overflow-auto rounded-xl border border-[#2A2A2A] bg-[#0A0A0A]">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="sticky top-0 z-10 bg-[#141414] border-b border-[#2A2A2A] text-gray-400 uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">USER ID</th>
                      <th className="py-3 px-4">RIDER NAME</th>
                      <th className="py-3 px-4">EMAIL & PHONE</th>
                      <th className="py-3 px-4">ROLE ACCREDITATION</th>
                      <th className="py-3 px-4">STATUS</th>
                      <th className="py-3 px-4">JOINED DATE</th>
                      <th className="py-3 px-4 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1F1F1F] text-gray-300">
                    {filteredRiders.map((r) => (
                      <tr key={r.id} className="hover:bg-[#141414] transition">
                        <td className="py-3.5 px-4 font-bold text-gray-400">{r.id}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{r.name}</div>
                          <div className="text-[10px] text-gray-500">{r.zone}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-white">{r.email}</div>
                          <div className="text-[10px] text-gray-400">{r.phone}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => toggleRiderRole(r.id)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono border cursor-pointer transition ${
                              r.role === 'ADMIN'
                                ? 'bg-[#E10600]/20 text-[#FF1A1A] border-[#FF1A1A]'
                                : 'bg-[#1F1F1F] text-gray-300 border-[#2A2A2A]'
                            }`}
                            title="Click to toggle Role (ADMIN / USER)"
                          >
                            {r.role === 'ADMIN' ? '🛡️ SUPER ADMIN' : '👤 RIDER USER'}
                          </button>
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => toggleRiderStatus(r.id)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono border cursor-pointer transition ${
                              r.status === 'ACTIVE'
                                ? 'bg-emerald-950 text-emerald-400 border-emerald-500'
                                : 'bg-red-950 text-red-400 border-red-500'
                            }`}
                            title="Click to toggle Status (ACTIVE / SUSPENDED)"
                          >
                            {r.status}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-gray-400 text-[11px]">{r.joined}</td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => deleteRider(r.id)}
                            className="p-1.5 rounded-lg bg-[#1F1F1F] border border-[#2A2A2A] text-gray-400 hover:text-red-400 hover:border-red-500 transition cursor-pointer"
                            title="Remove User Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: ANALYTICS & BUSINESS METRICS */}
          {/* ========================================================================= */}
          {activeTab === 'ANALYTICS' && (
            <div className="flex-1 bg-[#141414] rounded-xl border border-[#2A2A2A] p-5 flex flex-col gap-6 overflow-y-auto">
              
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#2A2A2A]">
                <div>
                  <h3 className="font-display font-bold text-base text-white uppercase">
                    DUBAI & UAE REGIONAL INTELLIGENCE
                  </h3>
                  <p className="text-xs font-mono text-gray-400">Live sales performance telemetry across UAE Emirates</p>
                </div>

                <div className="flex items-center gap-1 bg-[#0A0A0A] p-1 rounded-xl border border-[#2A2A2A]">
                  {['24HRS', '7DAYS', '30DAYS', 'YTD'].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => {
                        playClick();
                        setAnalyticsTimeframe(tf);
                      }}
                      className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition ${
                        analyticsTimeframe === tf
                          ? 'bg-[#E10600] text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid 1: Sales by Emirate & Payment Methods */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Regional Distribution */}
                <div className="p-5 rounded-xl bg-[#0A0A0A] border border-[#2A2A2A] flex flex-col gap-4">
                  <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                    <span>SALES BY EMIRATE / ZONE</span>
                    <MapPin className="w-4 h-4 text-[#FF1A1A]" />
                  </div>

                  <div className="flex flex-col gap-3 font-mono text-xs text-gray-300">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>DUBAI (MARINA, d3, DOWNTOWN, JBR)</span>
                        <span className="text-[#FF1A1A] font-bold">65% ({Math.round(totalRevenueAED * 0.65)} AED)</span>
                      </div>
                      <div className="w-full h-2 bg-[#1F1F1F] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#E10600] to-[#FF1A1A] w-[65%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span>ABU DHABI & YAS ISLAND</span>
                        <span className="text-emerald-400 font-bold">22% ({Math.round(totalRevenueAED * 0.22)} AED)</span>
                      </div>
                      <div className="w-full h-2 bg-[#1F1F1F] rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[22%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span>SHARJAH & NORTHERN EMIRATES</span>
                        <span className="text-amber-400 font-bold">8% ({Math.round(totalRevenueAED * 0.08)} AED)</span>
                      </div>
                      <div className="w-full h-2 bg-[#1F1F1F] rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 w-[8%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span>GCC AIR EXPORTS (SAUDI, OMAN, QATAR)</span>
                        <span className="text-blue-400 font-bold">5% ({Math.round(totalRevenueAED * 0.05)} AED)</span>
                      </div>
                      <div className="w-full h-2 bg-[#1F1F1F] rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[5%]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Gateway Distribution */}
                <div className="p-5 rounded-xl bg-[#0A0A0A] border border-[#2A2A2A] flex flex-col gap-4">
                  <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                    <span>PAYMENT METHOD PREFERENCE</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>

                  <div className="flex flex-col gap-3 font-mono text-xs text-gray-300">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>TABBY (BUY NOW PAY LATER)</span>
                        <span className="text-purple-400 font-bold">42%</span>
                      </div>
                      <div className="w-full h-2 bg-[#1F1F1F] rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 w-[42%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span>CASH ON DELIVERY (COD DUBAI)</span>
                        <span className="text-amber-400 font-bold">30%</span>
                      </div>
                      <div className="w-full h-2 bg-[#1F1F1F] rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 w-[30%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span>STRIPE / VISA / MASTERCARD</span>
                        <span className="text-[#FF1A1A] font-bold">18%</span>
                      </div>
                      <div className="w-full h-2 bg-[#1F1F1F] rounded-full overflow-hidden">
                        <div className="h-full bg-[#E10600] w-[18%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span>APPLE PAY / EXPRESS</span>
                        <span className="text-white font-bold">10%</span>
                      </div>
                      <div className="w-full h-2 bg-[#1F1F1F] rounded-full overflow-hidden">
                        <div className="h-full bg-white w-[10%]" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Key Metrics Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-gradient-to-br from-[#141414] to-[#0A0A0A] border border-[#2A2A2A] flex flex-col justify-between">
                  <div className="text-xs font-mono text-gray-400">AVERAGE ORDER VALUE (AOV)</div>
                  <div className="font-mono text-3xl font-black text-white mt-2">
                    {orders.length > 0 ? Math.round(totalRevenueAED / orders.length) : 349} <span className="text-xs text-[#FF1A1A]">AED</span>
                  </div>
                  <div className="text-[10px] font-sans text-gray-400 mt-1">Calculated from live order telemetry</div>
                </div>

                <div className="p-5 rounded-xl bg-gradient-to-br from-[#141414] to-[#0A0A0A] border border-[#2A2A2A] flex flex-col justify-between">
                  <div className="text-xs font-mono text-gray-400">TOP LED MATRIX PRESET PREFERENCE</div>
                  <div className="font-mono text-2xl font-black text-[#FF1A1A] mt-2">
                    RED PULSE EYES
                  </div>
                  <div className="text-[10px] font-sans text-gray-400 mt-1">Chosen in 64% of NEXUS orders</div>
                </div>

                <div className="p-5 rounded-xl bg-gradient-to-br from-[#141414] to-[#0A0A0A] border border-[#2A2A2A] flex flex-col justify-between">
                  <div className="text-xs font-mono text-gray-400">SAME-DAY DUBAI DISPATCH RATE</div>
                  <div className="font-mono text-3xl font-black text-emerald-400 mt-2">
                    98.4%
                  </div>
                  <div className="text-[10px] font-sans text-gray-400 mt-1">Average delivery time: 3.2 hours</div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: SYSTEM CONFIG & PROMO CODES */}
          {/* ========================================================================= */}
          {activeTab === 'SETTINGS' && (
            <div className="flex-1 bg-[#141414] rounded-xl border border-[#2A2A2A] p-5 flex flex-col gap-6 overflow-y-auto">
              
              <div className="pb-4 border-b border-[#2A2A2A]">
                <h3 className="font-display font-bold text-base text-white uppercase">
                  STORE CONFIGURATION & PROMO CODE MANAGER
                </h3>
                <p className="text-xs font-mono text-gray-400">Manage store operational rules, shipping thresholds and promotional vouchers</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Store Controls */}
                <div className="p-5 rounded-xl bg-[#0A0A0A] border border-[#2A2A2A] flex flex-col gap-4">
                  <h4 className="font-display font-bold text-sm text-white uppercase flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#FF1A1A]" /> OPERATIONAL TOGGLES
                  </h4>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-[#2A2A2A]">
                    <div>
                      <div className="font-mono text-xs font-bold text-white">MAINTENANCE MODE</div>
                      <div className="text-[10px] font-mono text-gray-400">Pause storefront checkout</div>
                    </div>
                    <button
                      onClick={() => {
                        playClick();
                        setMaintenanceMode(!maintenanceMode);
                        addSystemLog(`MAINTENANCE MODE: ${!maintenanceMode ? 'ENABLED' : 'DISABLED'}`, 'warning');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                        maintenanceMode ? 'bg-[#E10600] text-white' : 'bg-[#2A2A2A] text-gray-400'
                      }`}
                    >
                      {maintenanceMode ? 'ACTIVE' : 'OFF'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-[#2A2A2A]">
                    <div>
                      <div className="font-mono text-xs font-bold text-white">CASH ON DELIVERY (COD)</div>
                      <div className="text-[10px] font-mono text-gray-400">Enable COD for UAE addresses</div>
                    </div>
                    <button
                      onClick={() => {
                        playClick();
                        setCodEnabled(!codEnabled);
                        addSystemLog(`COD PAYMENT GATEWAY: ${!codEnabled ? 'ENABLED' : 'DISABLED'}`, 'info');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                        codEnabled ? 'bg-emerald-950 text-emerald-400 border border-emerald-500' : 'bg-[#2A2A2A] text-gray-400'
                      }`}
                    >
                      {codEnabled ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-[#141414] border border-[#2A2A2A] flex items-center justify-between">
                    <div>
                      <div className="font-mono text-xs font-bold text-white">FREE SHIPPING THRESHOLD</div>
                      <div className="text-[10px] font-mono text-gray-400">Minimum AED cart value</div>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-sm font-bold text-white">
                      <input
                        type="number"
                        value={freeShipThreshold}
                        onChange={(e) => setFreeShipThreshold(Number(e.target.value))}
                        className="w-20 px-2 py-1 rounded bg-[#0A0A0A] border border-[#2A2A2A] text-right font-mono text-xs text-white"
                      />
                      <span>AED</span>
                    </div>
                  </div>
                </div>

                {/* Promo Code Manager */}
                <div className="p-5 rounded-xl bg-[#0A0A0A] border border-[#2A2A2A] flex flex-col gap-4">
                  <h4 className="font-display font-bold text-sm text-white uppercase flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-400" /> PROMO CODES & DISCOUNT VOUCHERS
                  </h4>

                  {/* Add Code Bar */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newPromoCode}
                      onChange={(e) => setNewPromoCode(e.target.value)}
                      placeholder="NEW CODE (e.g. VIP25)..."
                      className="flex-1 px-3 py-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#E10600]"
                    />
                    <input
                      type="number"
                      value={newPromoDiscount}
                      onChange={(e) => setNewPromoDiscount(Number(e.target.value))}
                      placeholder="%"
                      className="w-16 px-3 py-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-white placeholder-gray-500 text-center focus:outline-none focus:border-[#E10600]"
                    />
                    <button
                      onClick={() => {
                        if (!newPromoCode) return;
                        playSuccess();
                        const codeStr = newPromoCode.toUpperCase();
                        setPromoCodes([...promoCodes, { code: codeStr, discount: Number(newPromoDiscount), uses: 0, active: true }]);
                        addSystemLog(`PROMO CODE GENERATED: ${codeStr} (${newPromoDiscount}%)`, 'success');
                        setNewPromoCode('');
                      }}
                      className="cyber-button-primary px-4 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer"
                    >
                      ADD
                    </button>
                  </div>

                  {/* Code List */}
                  <div className="flex flex-col gap-2">
                    {promoCodes.map((pc) => (
                      <div key={pc.code} className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-[#2A2A2A]">
                        <div>
                          <div className="font-mono text-xs font-bold text-[#FF1A1A]">{pc.code}</div>
                          <div className="text-[10px] font-mono text-gray-400">{pc.discount}% Discount • {pc.uses} redemptions</div>
                        </div>

                        <button
                          onClick={() => {
                            playClick();
                            setPromoCodes(promoCodes.filter(c => c.code !== pc.code));
                            addSystemLog(`PROMO CODE PURGED: ${pc.code}`, 'warning');
                          }}
                          className="p-1.5 rounded bg-[#1F1F1F] text-gray-400 hover:text-red-400 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: VIEW ORDER DETAILS */}
      {/* ========================================================================= */}
      {selectedOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#0A0A0A] border-2 border-[#E10600] rounded-2xl p-6 relative text-white shadow-2xl">
            <button
              onClick={() => setSelectedOrderModal(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-[#FF1A1A] mb-2 font-bold">
              <ShieldCheck className="w-4 h-4" /> ORDER TELEMETRY RECORD
            </div>

            <h3 className="font-display font-black text-2xl mb-1">{selectedOrderModal.id}</h3>
            <p className="text-xs font-mono text-gray-400 mb-4">{selectedOrderModal.date} • {selectedOrderModal.status}</p>

            <div className="flex flex-col gap-3 font-mono text-xs bg-[#141414] p-4 rounded-xl border border-[#2A2A2A]">
              <div><strong>CUSTOMER:</strong> {selectedOrderModal.customer}</div>
              <div><strong>EMAIL:</strong> {selectedOrderModal.email}</div>
              <div><strong>UAE PHONE:</strong> {selectedOrderModal.phone}</div>
              <div><strong>DELIVERY ZONE:</strong> {selectedOrderModal.zone}</div>
              <div><strong>PHYSICAL ADDRESS:</strong> {selectedOrderModal.address}</div>
              <div><strong>ARAMEX TRACKING:</strong> <span className="text-emerald-400">{selectedOrderModal.tracking}</span></div>
              <div className="pt-2 border-t border-[#2A2A2A]">
                <strong>ITEMS PURCHASED:</strong> {selectedOrderModal.items}
              </div>
              <div><strong>COLOR SPEC:</strong> {selectedOrderModal.color}</div>
              <div><strong>LED PRESET:</strong> {selectedOrderModal.led}</div>
              <div><strong>PAYMENT:</strong> {selectedOrderModal.payment}</div>
              <div className="text-base font-bold text-[#FF1A1A] pt-2 border-t border-[#2A2A2A]">
                TOTAL: {selectedOrderModal.total.toLocaleString()} AED
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => {
                  updateOrderStatus(selectedOrderModal.id, 'SHIPPED (ARAMEX)');
                }}
                className="flex-1 py-3 rounded-xl bg-[#E10600] font-mono text-xs font-bold text-white shadow-[0_0_15px_rgba(225,6,0,0.5)] cursor-pointer"
              >
                MARK SHIPPED (ARAMEX)
              </button>
              <button
                onClick={() => setSelectedOrderModal(null)}
                className="px-4 py-3 rounded-xl bg-[#141414] border border-[#2A2A2A] font-mono text-xs font-bold text-gray-300"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD MANUAL ORDER */}
      {/* ========================================================================= */}
      {isAddOrderOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleCreateOrder} className="max-w-md w-full bg-[#0A0A0A] border-2 border-[#E10600] rounded-2xl p-6 relative text-white shadow-2xl flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setIsAddOrderOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-black text-xl text-white uppercase">CREATE MANUAL ORDER</h3>
            
            <div>
              <label className="text-[10px] font-mono text-gray-400 uppercase">CUSTOMER FULL NAME</label>
              <input
                type="text"
                required
                value={newOrderCustomer}
                onChange={(e) => setNewOrderCustomer(e.target.value)}
                placeholder="Sheikh Hamdan..."
                className="w-full px-3 py-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-white focus:outline-none focus:border-[#E10600]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase">EMAIL</label>
                <input
                  type="email"
                  required
                  value={newOrderEmail}
                  onChange={(e) => setNewOrderEmail(e.target.value)}
                  placeholder="rider@dubai.ae"
                  className="w-full px-3 py-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-white focus:outline-none focus:border-[#E10600]"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase">UAE PHONE</label>
                <input
                  type="text"
                  value={newOrderPhone}
                  onChange={(e) => setNewOrderPhone(e.target.value)}
                  placeholder="+971 50 123 4567"
                  className="w-full px-3 py-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-white focus:outline-none focus:border-[#E10600]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-gray-400 uppercase">DELIVERY ZONE</label>
              <input
                type="text"
                value={newOrderZone}
                onChange={(e) => setNewOrderZone(e.target.value)}
                placeholder="Dubai Marina, JBR..."
                className="w-full px-3 py-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-white focus:outline-none focus:border-[#E10600]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase">NEXUS QTY</label>
                <input
                  type="number"
                  min="1"
                  value={newOrderQty}
                  onChange={(e) => setNewOrderQty(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-white focus:outline-none focus:border-[#E10600]"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase">PAYMENT METHOD</label>
                <select
                  value={newOrderPayment}
                  onChange={(e) => setNewOrderPayment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-white focus:outline-none focus:border-[#E10600]"
                >
                  <option value="CASH ON DELIVERY">CASH ON DELIVERY</option>
                  <option value="STRIPE (VISA)">STRIPE (VISA)</option>
                  <option value="TABBY BNPL">TABBY BNPL</option>
                  <option value="APPLE PAY">APPLE PAY</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="cyber-button-primary py-3 rounded-xl text-xs font-mono font-bold mt-2 shadow-[0_0_15px_rgba(225,6,0,0.5)] cursor-pointer"
            >
              CREATE MANUAL ORDER ({349 * newOrderQty} AED)
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EDIT PRODUCT */}
      {/* ========================================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleSaveProductEdit} className="max-w-md w-full bg-[#0A0A0A] border-2 border-[#E10600] rounded-2xl p-6 relative text-white shadow-2xl flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-black text-xl text-white uppercase">EDIT SKU: {editingProduct.sku}</h3>

            <div>
              <label className="text-[10px] font-mono text-gray-400 uppercase">PRODUCT NAME</label>
              <input
                type="text"
                required
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-white focus:outline-none focus:border-[#E10600]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase">PRICE (AED)</label>
                <input
                  type="number"
                  required
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-white focus:outline-none focus:border-[#E10600]"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase">STOCK UNITS</label>
                <input
                  type="number"
                  required
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-white focus:outline-none focus:border-[#E10600]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-gray-400 uppercase">DESCRIPTION</label>
              <textarea
                rows={3}
                value={editingProduct.description || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-white focus:outline-none focus:border-[#E10600]"
              />
            </div>

            <button
              type="submit"
              className="cyber-button-primary py-3 rounded-xl text-xs font-mono font-bold mt-2 cursor-pointer"
            >
              SAVE PRODUCT UPDATES
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ADD PRODUCT */}
      {/* ========================================================================= */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleCreateProduct} className="max-w-md w-full bg-[#0A0A0A] border-2 border-[#E10600] rounded-2xl p-6 relative text-white shadow-2xl flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setIsAddProductOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-black text-xl text-white uppercase">ADD NEW PRODUCT SKU</h3>

            <div>
              <label className="text-[10px] font-mono text-gray-400 uppercase">SKU CODE</label>
              <input
                type="text"
                required
                value={newProdSku}
                onChange={(e) => setNewProdSku(e.target.value)}
                placeholder="CB-HELMET-LED-01"
                className="w-full px-3 py-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-white focus:outline-none focus:border-[#E10600]"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-gray-400 uppercase">PRODUCT NAME</label>
              <input
                type="text"
                required
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                placeholder="CYBERRIDE MATRIX HELMET HUD"
                className="w-full px-3 py-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-white focus:outline-none focus:border-[#E10600]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase">PRICE (AED)</label>
                <input
                  type="number"
                  required
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-white focus:outline-none focus:border-[#E10600]"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase">INITIAL STOCK</label>
                <input
                  type="number"
                  required
                  value={newProdStock}
                  onChange={(e) => setNewProdStock(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-white focus:outline-none focus:border-[#E10600]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-gray-400 uppercase">DESCRIPTION</label>
              <textarea
                rows={2}
                value={newProdDesc}
                onChange={(e) => setNewProdDesc(e.target.value)}
                placeholder="High-tech cyberpunk product specifications..."
                className="w-full px-3 py-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-white focus:outline-none focus:border-[#E10600]"
              />
            </div>

            <button
              type="submit"
              className="cyber-button-primary py-3 rounded-xl text-xs font-mono font-bold mt-2 cursor-pointer"
            >
              CREATE PRODUCT SKU
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: ADD USER ACCOUNT */}
      {/* ========================================================================= */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleAddUser} className="max-w-md w-full bg-[#0A0A0A] border-2 border-[#E10600] rounded-2xl p-6 relative text-white shadow-2xl flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setIsAddUserOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-black text-xl text-white uppercase">REGISTER RIDER / ADMIN</h3>

            <div>
              <label className="text-[10px] font-mono text-gray-400 uppercase">NAME</label>
              <input
                type="text"
                required
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="Rider Name..."
                className="w-full px-3 py-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-white focus:outline-none focus:border-[#E10600]"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-gray-400 uppercase">EMAIL</label>
              <input
                type="email"
                required
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="rider@cyberride.ae"
                className="w-full px-3 py-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-white focus:outline-none focus:border-[#E10600]"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-gray-400 uppercase">ROLE</label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-white focus:outline-none focus:border-[#E10600]"
              >
                <option value="USER">RIDER USER</option>
                <option value="ADMIN">SUPER ADMIN</option>
              </select>
            </div>

            <button
              type="submit"
              className="cyber-button-primary py-3 rounded-xl text-xs font-mono font-bold mt-2 cursor-pointer"
            >
              ADD USER ACCOUNT
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
