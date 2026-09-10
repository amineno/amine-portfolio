/**
 * CYBERRIDE PRODUCTION EXPRESS REST API SERVER
 * Persistent SQLite Database via Prisma ORM
 * Specialized for UAE Market & Cash-On-Delivery (COD) Logistics
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'cyberride_super_secure_jwt_secret_key_dxb_2026';

const prisma = new PrismaClient();

// Security & Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('dev'));

// Helper: JWT Verification Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
}

// Helper: Admin Role Guard
function requireAdmin(req, res, next) {
  authenticateToken(req, res, () => {
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    next();
  });
}

// Helper: Log System Event
async function logSystemEvent(text, type = 'info') {
  try {
    const timeStr = new Date().toTimeString().split(' ')[0];
    await prisma.systemLog.create({
      data: {
        text,
        type,
        time: timeStr
      }
    });
  } catch (err) {
    console.error('Failed to write system log:', err);
  }
}

// ==========================================
// 1. HEALTH & TELEMETRY ROUTES
// ==========================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    node: 'Dubai Origin Hub Server (d3)',
    engine: 'Prisma + SQLite Persistent Database',
    paymentMode: 'CASH ON DELIVERY (COD)',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/logs', async (req, res) => {
  try {
    const logs = await prisma.systemLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 25
    });
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/logs', async (req, res) => {
  try {
    const { text, type } = req.body;
    await logSystemEvent(text || 'System ping', type || 'info');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 2. AUTHENTICATION & USER ROUTES
// ==========================================
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const role = cleanEmail.includes('admin') ? 'ADMIN' : 'CUSTOMER';

    const newUser = await prisma.user.create({
      data: {
        email: cleanEmail,
        passwordHash,
        name: name || 'Rider',
        phone: phone || '+971 50 000 0000',
        role,
        zone: 'Dubai Marina'
      }
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    await logSystemEvent(`NEW RIDER REGISTERED: ${newUser.name} (${newUser.email})`, 'success');

    res.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        zone: newUser.zone
      },
      token
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    await logSystemEvent(`RIDER AUTHENTICATED: ${user.email} [${user.role}]`, 'info');

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        zone: user.zone
      },
      token
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, phone: true, role: true, zone: true, createdAt: true }
    });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/auth/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, phone: true, role: true, status: true, zone: true, createdAt: true }
    });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/auth/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { role, status, name, phone, zone } = req.body;
    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(role && { role }),
        ...(status && { status }),
        ...(name && { name }),
        ...(phone && { phone }),
        ...(zone && { zone })
      },
      select: { id: true, name: true, email: true, phone: true, role: true, status: true, zone: true }
    });
    await logSystemEvent(`USER PROFILE UPDATED: ${updated.email} [${updated.role}]`, 'warning');
    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 3. PRODUCTS ROUTES
// ==========================================
app.get('/api/products', async (req, res) => {
  try {
    const prods = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' }
    });

    // Parse JSON strings for frontend compatibility
    const formatted = prods.map(p => ({
      ...p,
      features: p.features ? JSON.parse(p.features) : [],
      colors: p.colors ? JSON.parse(p.colors) : [],
      gallery: p.gallery ? JSON.parse(p.gallery) : [],
      ledPresets: p.ledPresets ? JSON.parse(p.ledPresets) : []
    }));

    res.json({ success: true, products: formatted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const prod = await prisma.product.findFirst({
      where: { OR: [{ id }, { sku: id }] }
    });
    if (!prod) return res.status(404).json({ success: false, error: 'Product not found' });

    res.json({
      success: true,
      product: {
        ...prod,
        features: prod.features ? JSON.parse(prod.features) : [],
        colors: prod.colors ? JSON.parse(prod.colors) : [],
        gallery: prod.gallery ? JSON.parse(prod.gallery) : [],
        ledPresets: prod.ledPresets ? JSON.parse(prod.ledPresets) : []
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { id, sku, name, tagline, price, stock, category, badge, description, image } = req.body;
    const newProd = await prisma.product.create({
      data: {
        id: id || `cb-prod-${Date.now()}`,
        sku: (sku || `SKU-${Date.now()}`).toUpperCase(),
        name: name.toUpperCase(),
        tagline: tagline || '',
        price: Number(price) || 199,
        stock: Number(stock) || 10,
        category: category || 'HARDWARE',
        badge: badge || 'NEW ARRIVAL',
        description: description || '',
        image: image || '/assets/nexus-hero.png',
        features: JSON.stringify([]),
        colors: JSON.stringify([{ name: 'STEALTH BLACK', hex: '#0A0A0A' }]),
        gallery: JSON.stringify([{ title: 'OVERVIEW', file: image || '/assets/nexus-hero.png' }]),
        ledPresets: JSON.stringify([])
      }
    });
    await logSystemEvent(`NEW PRODUCT SKU CREATED: ${newProd.sku} (${newProd.name})`, 'success');
    res.json({ success: true, product: newProd });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { stock, price, name, tagline, description } = req.body;
    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(stock !== undefined && { stock: Math.max(0, Number(stock)) }),
        ...(price !== undefined && { price: Number(price) }),
        ...(name && { name }),
        ...(tagline && { tagline }),
        ...(description && { description })
      }
    });
    await logSystemEvent(`PRODUCT UPDATED: ${updated.sku} (Stock: ${updated.stock})`, 'info');
    res.json({ success: true, product: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.product.update({
      where: { id },
      data: { isActive: false }
    });
    await logSystemEvent(`PRODUCT SKU ARCHIVED: ${deleted.sku}`, 'warning');
    res.json({ success: true, message: 'Product archived' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 4. CASH-ON-DELIVERY ORDERS & DISPATCH
// ==========================================
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { orderItems: true }
    });
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    const orderId = orderData.id || `CR-DXB-${Math.floor(100000 + Math.random() * 900000)}`;
    const tracking = orderData.tracking || `ARM-DXB-${Math.floor(100000 + Math.random() * 900000)}`;

    const total = Number(orderData.total) || 349.0;
    const vatAmount = Math.round((total * 0.05) * 100) / 100;
    const subtotal = total - vatAmount;

    // Database transaction: Create order and decrement inventory
    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          id: orderId,
          customer: orderData.customer || 'Sheikh Rider',
          email: orderData.email || 'rider@dubai.ae',
          phone: orderData.phone || '+971 50 123 4567',
          items: orderData.items || 'CYBERRIDE NEXUS LED BACKPACK (x1)',
          color: orderData.color || 'STEALTH BLACK',
          led: orderData.led || 'RED PULSE EYES',
          subtotal: Math.round(subtotal * 100) / 100,
          shippingCost: Number(orderData.shippingCost) || 0,
          codFee: 0,
          vatAmount,
          total,
          paymentMethod: 'CASH ON DELIVERY',
          status: 'PENDING DISPATCH',
          emirate: orderData.emirate || 'Dubai',
          zone: orderData.zone || `${orderData.emirate || 'Dubai'} Express`,
          address: orderData.address || 'Dubai Marina, UAE',
          notes: orderData.notes || 'Payment in cash upon courier delivery',
          trackingNumber: tracking,
          courierService: orderData.emirate === 'Dubai' ? 'Aramex Same-Day Express' : 'Aramex Domestic'
        }
      });

      // Find products mentioned in order and decrement their stock atomically
      const allProducts = await tx.product.findMany();
      for (const prod of allProducts) {
        if (orderData.items && orderData.items.toLowerCase().includes(prod.name.toLowerCase())) {
          await tx.product.update({
            where: { id: prod.id },
            data: { stock: Math.max(0, prod.stock - 1) }
          });
        }
      }

      return order;
    });

    await logSystemEvent(
      `NEW LIVE COD ORDER ${newOrder.id} PLACED BY ${newOrder.customer} (${newOrder.total} AED CASH UPON DELIVERY)`,
      'success'
    );

    res.json({ success: true, order: newOrder });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.order.update({
      where: { id },
      data: { status }
    });

    await logSystemEvent(`ORDER #${id} STATUS CHANGED TO: ${status}`, 'info');
    res.json({ success: true, order: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.order.delete({ where: { id } });
    await logSystemEvent(`ORDER RECORD #${id} REMOVED BY ADMIN`, 'warning');
    res.json({ success: true, message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 5. PUBLIC LIVE TRACKING API (ARAMEX HUD)
// ==========================================
app.get('/api/tracking/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const clean = query.trim();

    // Look up by Order ID, Tracking Number, or Phone Number
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: { contains: clean } },
          { trackingNumber: { contains: clean } },
          { phone: { contains: clean.replace(/\s+/g, '') } }
        ]
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: `No consignment found for query "${clean}". Please verify your Order ID or Phone number.`
      });
    }

    // Build timeline milestones based on order status
    const statusMap = {
      'PENDING DISPATCH': 1,
      'CONFIRMED': 2,
      'SHIPPED': 3,
      'OUT FOR DELIVERY': 4,
      'DELIVERED': 5,
      'CANCELLED': 0
    };

    const currentStep = statusMap[order.status.toUpperCase()] || 1;

    const checkpoints = [
      {
        milestone: 'ORDER RECORDED & CONFIRMED',
        location: 'CyberRide Dubai Origin Hub (d3)',
        time: order.createdAt.toISOString().slice(0, 16).replace('T', ' '),
        done: currentStep >= 1
      },
      {
        milestone: 'PACKAGE PACKED & ARAMEX WAYBILL GENERATED',
        location: 'Dubai Logistics Center',
        time: currentStep >= 2 ? 'Same Day (Processed)' : 'In Queue',
        done: currentStep >= 2
      },
      {
        milestone: `DISPATCHED VIA ${order.courierService || 'Aramex Express'}`,
        location: `${order.emirate} Sorting Facility`,
        time: currentStep >= 3 ? 'Transit Active' : 'Scheduled',
        done: currentStep >= 3
      },
      {
        milestone: `OUT FOR DELIVERY — COURIER COLLECTING ${order.total} AED IN CASH`,
        location: `${order.address}, ${order.emirate}`,
        time: currentStep >= 4 ? 'En Route with Driver' : 'Pending Route Dispatch',
        done: currentStep >= 4
      },
      {
        milestone: 'DELIVERED & CASH SETTLED WITH COURIER',
        location: 'Customer Address',
        time: currentStep >= 5 ? 'Completed' : 'Pending Handover',
        done: currentStep >= 5
      }
    ];

    res.json({
      success: true,
      orderId: order.id,
      customer: order.customer,
      trackingNumber: order.trackingNumber,
      courierService: order.courierService,
      status: order.status,
      totalDueAED: order.total,
      paymentMethod: order.paymentMethod,
      emirate: order.emirate,
      address: order.address,
      date: order.createdAt,
      checkpoints
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 6. PROMO CODES & ADMIN ANALYTICS
// ==========================================
app.post('/api/promos/validate', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ success: false, error: 'Code is required' });

    const clean = code.trim().toUpperCase();
    const promo = await prisma.promoCode.findUnique({ where: { code: clean } });

    if (!promo || !promo.isActive) {
      return res.status(404).json({ success: false, message: 'Invalid or expired access code.' });
    }

    await prisma.promoCode.update({
      where: { id: promo.id },
      data: { usesCount: promo.usesCount + 1 }
    });

    res.json({
      success: true,
      discountPercent: promo.discountPercent,
      message: `${promo.discountPercent}% VIP DISCOUNT PROTOCOL ACTIVATED`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/admin/stats', async (req, res) => {
  try {
    const allOrders = await prisma.order.findMany();
    const allProducts = await prisma.product.findMany();
    const allUsers = await prisma.user.findMany();

    const totalRevenueAED = allOrders.reduce((sum, o) => sum + o.total, 0);
    const cashCollectedAED = allOrders
      .filter(o => o.status === 'DELIVERED')
      .reduce((sum, o) => sum + o.total, 0);
    const cashPendingAED = totalRevenueAED - cashCollectedAED;

    const lowStockCount = allProducts.filter(p => p.stock <= 5).length;

    res.json({
      success: true,
      stats: {
        totalOrders: allOrders.length,
        totalRevenueAED: Math.round(totalRevenueAED * 100) / 100,
        cashCollectedAED: Math.round(cashCollectedAED * 100) / 100,
        cashPendingAED: Math.round(cashPendingAED * 100) / 100,
        totalProducts: allProducts.length,
        lowStockCount,
        totalRiders: allUsers.length
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 CYBERRIDE API SERVER RUNNING ON PORT ${PORT}`);
  console.log(`📍 Origin Node: Dubai Design District (d3), UAE`);
  console.log(`💳 Payment Protocol: 100% Cash On Delivery (COD)`);
});

export default app;
