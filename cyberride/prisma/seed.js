import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('⚡ Seeding Cyberride Database...');

  // 1. Seed Users with securely hashed passwords
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const riderPasswordHash = await bcrypt.hash('rider123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@cyberride.ae' },
    update: {},
    create: {
      id: 'USR-001',
      email: 'admin@cyberride.ae',
      passwordHash: adminPasswordHash,
      name: 'SUPER ADMIN',
      phone: '+971 50 000 0000',
      role: 'ADMIN',
      status: 'ACTIVE',
      zone: 'Dubai Command Hub'
    }
  });

  const demoRider = await prisma.user.upsert({
    where: { email: 'rider@cyberride.ae' },
    update: {},
    create: {
      id: 'USR-002',
      email: 'rider@cyberride.ae',
      passwordHash: riderPasswordHash,
      name: 'CYBER RIDER',
      phone: '+971 50 123 4567',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      zone: 'Dubai Marina'
    }
  });

  const sheikh = await prisma.user.upsert({
    where: { email: 'rashid.r@dubai.ae' },
    update: {},
    create: {
      id: 'USR-003',
      email: 'rashid.r@dubai.ae',
      passwordHash: riderPasswordHash,
      name: 'Sheikh Rashid Al-Nuaimi',
      phone: '+971 50 987 6543',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      zone: 'Dubai Marina'
    }
  });

  console.log('✅ Users seeded: Admin (admin@cyberride.ae / admin123) & Riders');

  // 2. Seed Flagship Products
  const products = [
    {
      id: 'cb-nexus-01',
      sku: 'CB-NEXUS-01',
      name: 'CYBERRIDE NEXUS LED SMART BACKPACK',
      tagline: 'Dual Programmable LED Display Eyes | Bluetooth App Control',
      price: 349.0,
      stock: 4,
      category: 'BACKPACKS',
      badge: 'HERO SKU — DUBAI EDITION',
      rating: 4.9,
      reviewsCount: 128,
      image: '/assets/nexus-hero.png',
      description: 'A hardshell aerodynamic motorcycle backpack featuring dual programmable LED "eye" displays controlled via Bluetooth smartphone app. Angular faceted stealth black shell with IP54 water resistance.',
      features: JSON.stringify([
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
      ]),
      colors: JSON.stringify([
        { name: 'STEALTH BLACK', hex: '#0A0A0A' },
        { name: 'PHANTOM GREY', hex: '#2A2A2A' }
      ]),
      gallery: JSON.stringify([
        { title: 'FLAGSHIP HARDSHELL STUDIO', file: '/assets/nexus-hero.png', desc: 'Front armor plate with LED angry eyes display' },
        { title: 'DUBAI NIGHT RIDER LIFESTYLE', file: '/assets/nexus-lifestyle.png', desc: 'Rider on Sheikh Zayed Road with glowing LED eyes' },
        { title: 'BLUETOOTH MOBILE APP CONTROL', file: '/assets/nexus-app.png', desc: 'Smartphone companion app matrix selector' },
        { title: 'IP54 HARDSHELL MACRO DETAIL', file: '/assets/nexus-detail.png', desc: 'Water resistant carbon-fiber texture finish' }
      ]),
      ledPresets: JSON.stringify(['RED PULSE EYES', 'CYBER CROSSHAIR', 'HAZARD TURN SIGNAL', 'MATRIX RAIN', 'VIPER GLARE'])
    },
    {
      id: 'cb-phone-holder-02',
      sku: 'CB-WIRELESS-HOLDER',
      name: 'CYBERRIDE WIRELESS CHARGING PHONE HOLDER FOR MOTORCYCLE',
      tagline: 'Fast Wireless Charging & Dual USB Output | Anti-Vibration Mount',
      price: 120.0,
      stock: 15,
      category: 'ACCESSORIES',
      badge: 'WIRELESS CHARGER',
      rating: 4.9,
      reviewsCount: 94,
      image: '/assets/phone-holder-hero.png',
      description: 'Heavy-duty motorcycle phone holder featuring high-speed Qi wireless charging, dual USB outputs, IP66 waterproof seals, and anti-shock vibration dampeners for extreme riding conditions.',
      features: JSON.stringify([
        'Fast Qi Wireless Charging (15W Max Output)',
        'Dual USB-A & Type-C High-Output Charging Ports',
        'Vibration Dampening Anti-Shock Protection Module',
        'IP66 Waterproof & Weatherproof Enclosure',
        '360-Degree Ball Joint Handlebar Clamp',
        'Universal Smartphone Compatibility (4.7" to 7.2")'
      ]),
      colors: JSON.stringify([{ name: 'STEALTH BLACK', hex: '#0A0A0A' }]),
      gallery: JSON.stringify([
        { title: 'STUDIO OVERVIEW', file: '/assets/phone-holder-hero.png', desc: 'Fast wireless charging pad with smartphone clamped' },
        { title: 'WIRELESS CHARGER STAGE', file: '/assets/phone-holder-1.png', desc: 'Active charging wave indicator on handlebar mount' },
        { title: 'USB & CLAMP MACRO', file: '/assets/phone-holder-2.png', desc: 'Dual USB port & precision alloy adjustment knob' },
        { title: 'DUBAI NIGHT RIDE MOUNT', file: '/assets/phone-holder-3.png', desc: 'Cockpit telemetry view mounted on superbike' }
      ]),
      ledPresets: JSON.stringify([])
    },
    {
      id: 'cb-welcome-light-03',
      sku: 'CB-WELCOME-LIGHT',
      name: 'CYBERRIDE™ LED CAR DOOR WELCOME LIGHT',
      tagline: 'High Definition & High Brightness Laser Emblem Projector',
      price: 50.0,
      stock: 30,
      category: 'LIGHTING',
      badge: 'HIGH DEFINITION LED',
      rating: 4.8,
      reviewsCount: 112,
      image: '/assets/welcome-light-hero.png',
      description: 'High-definition LED logo welcome puddle projector light for car doors. Projects ultra-bright, laser-crisp CyberRide optics onto the ground whenever your vehicle door opens.',
      features: JSON.stringify([
        'High Definition & High Brightness Optical Lens',
        'Automatic Infrared Magnetic Door Sensor',
        'Wireless Easy Installation (No Drilling Required)',
        'Low Power Consumption & High Efficiency LED',
        'Heat-Resistant Aluminum Alloy Heat Sink',
        'Universal Fit for All Car Doors'
      ]),
      colors: JSON.stringify([{ name: 'STEALTH BLACK', hex: '#0A0A0A' }]),
      gallery: JSON.stringify([
        { title: 'WELCOME EMBLEM PROJECTION', file: '/assets/welcome-light-hero.png', desc: 'High brightness LED logo projected on asphalt' },
        { title: 'LUXURY NIGHT CAR DOOR', file: '/assets/welcome-light-1.png', desc: 'Open driver door displaying crisp blue puddle light' },
        { title: 'OPTICAL LENS MODULE', file: '/assets/welcome-light-2.png', desc: 'Compact glass lens projector unit detail' },
        { title: 'DUBAI STREET ILLUMINATION', file: '/assets/welcome-light-3.png', desc: 'Ground lighting reflection on wet pavement' }
      ]),
      ledPresets: JSON.stringify([])
    },
    {
      id: 'cb-carplay-adapter-04',
      sku: 'CB-WIRELESS-CARPLAY',
      name: 'CYBERRIDE WIRELESS CARPLAY AND ANDROID AUTO ADAPTER',
      tagline: '2 IN 1 Wireless Adapter for CarPlay & Android Auto | A7 Chip 5.8GHz',
      price: 100.0,
      stock: 25,
      category: 'TECH',
      badge: '2 IN 1 ADAPTER',
      rating: 4.9,
      reviewsCount: 156,
      image: '/assets/carplay-adapter-hero.png',
      description: 'Convert wired CarPlay and Android Auto to 100% wireless! Powered by high-speed A7 microchip, 5.8GHz Wi-Fi + Bluetooth 5.2 for instant low-latency navigation and media streaming.',
      features: JSON.stringify([
        '2 in 1 Dual Compatibility (CarPlay & Android Auto)',
        'A7 Microchip High Speed Processor',
        '5.8GHz Wi-Fi + Bluetooth 5.2 Dual Band',
        'Instant Auto-Connect within 5 Seconds',
        'Preserves OEM Steering Wheel Controls & Touchscreen',
        'Compact Carbon Fiber Weave Enclosure'
      ]),
      colors: JSON.stringify([{ name: 'CARBON FIBER', hex: '#1C1C1C' }]),
      gallery: JSON.stringify([
        { title: 'CONSOLE DASHBOARD SYNC', file: '/assets/carplay-adapter-hero.png', desc: 'Wireless 2-in-1 adapter connected to vehicle screen' },
        { title: 'CARPLAY & ANDROID AUTO', file: '/assets/carplay-adapter-1.png', desc: 'Navigation & media playing via wireless adapter' },
        { title: 'A7 CHIP HARDWARE', file: '/assets/carplay-adapter-2.png', desc: 'High speed wireless transmitter module' },
        { title: 'CARBON FIBER ENCLOSURE', file: '/assets/carplay-adapter-3.png', desc: 'Ultra compact form factor and status indicator' }
      ]),
      ledPresets: JSON.stringify([])
    }
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: { sku: prod.sku },
      update: prod,
      create: prod
    });
  }
  console.log('✅ 4 Products seeded with inventory and specifications');

  // 3. Seed Cash-On-Delivery Orders
  const initialOrders = [
    {
      id: 'CR-DXB-882910',
      customer: 'Sheikh Rashid Al-Nuaimi',
      email: 'rashid.r@dubai.ae',
      phone: '+971 50 987 6543',
      items: 'CYBERRIDE NEXUS LED BACKPACK (x1)',
      color: 'STEALTH BLACK',
      led: 'RED PULSE EYES',
      subtotal: 349.0,
      shippingCost: 0.0,
      codFee: 0.0,
      vatAmount: 17.45,
      total: 366.45,
      paymentMethod: 'CASH ON DELIVERY',
      status: 'PENDING DISPATCH',
      emirate: 'Dubai',
      zone: 'Dubai Marina',
      address: 'Marina Gate Tower 1, Apt 2204, Dubai Marina, UAE',
      notes: 'Call 15 mins before arrival',
      trackingNumber: 'ARM-DXB-991204',
      courierService: 'Aramex Same-Day Express'
    },
    {
      id: 'CR-DXB-882909',
      customer: 'Tariq Mansoor',
      email: 'tariq@cyberride.ae',
      phone: '+971 55 112 2334',
      items: 'CYBERRIDE NEXUS LED BACKPACK (x2)',
      color: 'PHANTOM GREY',
      led: 'CYBER CROSSHAIR',
      subtotal: 698.0,
      shippingCost: 0.0,
      codFee: 0.0,
      vatAmount: 34.90,
      total: 732.90,
      paymentMethod: 'CASH ON DELIVERY',
      status: 'SHIPPED',
      emirate: 'Abu Dhabi',
      zone: 'Corniche',
      address: 'Corniche Residence Tower B, Abu Dhabi, UAE',
      notes: 'Cash ready in envelope',
      trackingNumber: 'ARM-AUH-774102',
      courierService: 'Aramex Domestic Express'
    },
    {
      id: 'CR-DXB-882908',
      customer: 'Hamdan Al-Falasi',
      email: 'hamdan@gmail.com',
      phone: '+971 52 443 3221',
      items: 'CYBERRIDE NEXUS LED BACKPACK (x1)',
      color: 'STEALTH BLACK',
      led: 'HAZARD TURN SIGNAL',
      subtotal: 349.0,
      shippingCost: 35.0,
      codFee: 0.0,
      vatAmount: 17.45,
      total: 401.45,
      paymentMethod: 'CASH ON DELIVERY',
      status: 'OUT FOR DELIVERY',
      emirate: 'Sharjah',
      zone: 'Al Majaz',
      address: 'Corniche Street, Al Majaz 2, Sharjah, UAE',
      notes: 'Deliver before 5 PM',
      trackingNumber: 'ARM-SHJ-330192',
      courierService: 'Aramex Domestic Express'
    },
    {
      id: 'CR-DXB-882907',
      customer: 'Elena Rostova',
      email: 'elena.rider@gmail.com',
      phone: '+971 56 778 8990',
      items: 'CYBERRIDE NEXUS LED BACKPACK (x1)',
      color: 'STEALTH BLACK',
      led: 'MATRIX RAIN',
      subtotal: 349.0,
      shippingCost: 0.0,
      codFee: 0.0,
      vatAmount: 17.45,
      total: 366.45,
      paymentMethod: 'CASH ON DELIVERY',
      status: 'DELIVERED',
      emirate: 'Dubai',
      zone: 'Downtown d3',
      address: 'Dubai Design District, Building 5, Dubai, UAE',
      notes: 'Delivered and cash collected by driver',
      trackingNumber: 'ARM-DXB-102938',
      courierService: 'Aramex Same-Day Express'
    }
  ];

  for (const ord of initialOrders) {
    await prisma.order.upsert({
      where: { id: ord.id },
      update: ord,
      create: ord
    });
  }
  console.log('✅ Cash-on-Delivery Orders seeded with Aramex tracking numbers');

  // 4. Seed Active Promo Codes
  const promoCodes = [
    { code: 'DUBAI10', discountPercent: 10, isActive: true, usesCount: 142 },
    { code: 'NEXUSVIP', discountPercent: 20, isActive: true, usesCount: 49 },
    { code: 'CYBERRIDE20', discountPercent: 20, isActive: true, usesCount: 88 }
  ];

  for (const promo of promoCodes) {
    await prisma.promoCode.upsert({
      where: { code: promo.code },
      update: promo,
      create: promo
    });
  }
  console.log('✅ Promo codes seeded');

  // 5. Seed System Logs
  const logs = [
    { text: 'SYSTEM ONLINE :: DUBAI HUB READY (SQLITE PERSISTENT STORAGE ACTIVE)', type: 'info', time: '12:00:00' },
    { text: 'ARAMEX COURIER LOGISTICS SERVICE CONNECTED (LIVE DISPATCH)', type: 'success', time: '12:00:15' },
    { text: 'CASH ON DELIVERY (COD) SETTLEMENT PROTOCOL INITIALIZED', type: 'info', time: '12:00:30' },
    { text: 'TELEMETRY NODE #DXB-01 ONLINE :: MONITORED AT d3 SHOWROOM', type: 'info', time: '12:01:00' }
  ];

  await prisma.systemLog.deleteMany({});
  for (const log of logs) {
    await prisma.systemLog.create({ data: log });
  }
  console.log('✅ Telemetry logs seeded');

  console.log('🎉 Cyberride database successfully seeded!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
