/**
 * CYBERRIDE API CLIENT SERVICE
 * Handles communication between React Frontend and Express REST API.
 * Includes graceful offline / local caching fallback.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('cyberride_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// ==========================================
// 1. PRODUCTS
// ==========================================
export async function getProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return data.products;
  } catch (err) {
    console.warn('[API] Fetch products failed, using local cache fallback:', err.message);
    const cached = localStorage.getItem('cyberride_admin_products');
    return cached ? JSON.parse(cached) : null;
  }
}

export async function updateProductStock(id, stock) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ stock })
    });
    return await res.json();
  } catch (err) {
    console.warn('[API] Update stock failed:', err);
    return { success: false, error: err.message };
  }
}

export async function createProduct(productData) {
  try {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    return await res.json();
  } catch (err) {
    console.warn('[API] Create product failed:', err);
    return { success: false, error: err.message };
  }
}

// ==========================================
// 2. CASH-ON-DELIVERY ORDERS
// ==========================================
export async function getOrders() {
  try {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    const data = await res.json();
    return data.orders;
  } catch (err) {
    console.warn('[API] Fetch orders failed, using local cache fallback:', err.message);
    const cached = localStorage.getItem('cyberride_admin_orders');
    return cached ? JSON.parse(cached) : null;
  }
}

export async function createCodOrder(orderData) {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) throw new Error('Order creation failed');
    return await res.json();
  } catch (err) {
    console.error('[API] Create COD order failed:', err);
    return { success: false, error: err.message };
  }
}

export async function updateOrderStatus(orderId, status) {
  try {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return await res.json();
  } catch (err) {
    console.error('[API] Update order status failed:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteOrder(orderId) {
  try {
    const res = await fetch(`${API_BASE}/orders/${orderId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return await res.json();
  } catch (err) {
    console.error('[API] Delete order failed:', err);
    return { success: false, error: err.message };
  }
}

// ==========================================
// 3. PUBLIC ARAMEX TRACKING HUD
// ==========================================
export async function getTrackingData(query) {
  try {
    const res = await fetch(`${API_BASE}/tracking/${encodeURIComponent(query)}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('[API] Tracking lookup failed:', err);
    return { success: false, error: err.message };
  }
}

// ==========================================
// 4. AUTHENTICATION & USERS
// ==========================================
export async function apiLogin(email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success && data.token) {
      localStorage.setItem('cyberride_token', data.token);
    }
    return data;
  } catch (err) {
    console.warn('[API] Login request failed:', err);
    return { success: false, error: 'Server unreachable. Using demo authentication.' };
  }
}

export async function apiRegister(userData) {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (data.success && data.token) {
      localStorage.setItem('cyberride_token', data.token);
    }
    return data;
  } catch (err) {
    console.warn('[API] Register request failed:', err);
    return { success: false, error: 'Server unreachable. Using demo authentication.' };
  }
}

export async function getUsers() {
  try {
    const res = await fetch(`${API_BASE}/auth/users`);
    if (!res.ok) throw new Error('Failed to fetch riders');
    const data = await res.json();
    return data.users;
  } catch (err) {
    console.warn('[API] Fetch riders failed, using local cache fallback:', err.message);
    const cached = localStorage.getItem('cyberride_admin_users');
    return cached ? JSON.parse(cached) : null;
  }
}

export async function updateUserProfile(userId, updateData) {
  try {
    const res = await fetch(`${API_BASE}/auth/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData)
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ==========================================
// 5. PROMOS, STATS & LOGS
// ==========================================
export async function validatePromo(code) {
  try {
    const res = await fetch(`${API_BASE}/promos/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function getAdminStats() {
  try {
    const res = await fetch(`${API_BASE}/admin/stats`);
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function getSystemLogs() {
  try {
    const res = await fetch(`${API_BASE}/logs`);
    if (!res.ok) throw new Error('Failed to fetch logs');
    const data = await res.json();
    return data.logs;
  } catch (err) {
    return null;
  }
}

export async function postSystemLog(text, type = 'info') {
  try {
    await fetch(`${API_BASE}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, type })
    });
  } catch (err) {}
}
