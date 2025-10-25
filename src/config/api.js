// Smart API Configuration - Auto-detects environment
const getApiBaseUrl = () => {
  // Check if we have an environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Auto-detect based on current URL
  const currentUrl = window.location.hostname;
  
  // If running on localhost or 127.0.0.1, use local backend
  if (currentUrl === 'localhost' || currentUrl === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  
  // If running on Cloudflare Pages (*.pages.dev), use live backend
  if (currentUrl.includes('.pages.dev') || currentUrl.includes('buildify')) {
    return 'https://buildify-backend.princerajputana5.workers.dev';
  }
  
  // Default fallback to live backend
  return 'https://buildify-backend.princerajputana5.workers.dev';
};

const API_CONFIG = {
  baseURL: getApiBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// Razorpay Configuration
export const RAZORPAY_CONFIG = {
  key: import.meta.env.VITE_RAZORPAY_KEY_ID,
  currency: 'INR',
  name: 'Buildify',
  description: 'Construction Materials',
  theme: {
    color: '#3B82F6'
  }
};

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  SEND_OTP: '/api/auth/customer/send-otp',
  VERIFY_OTP: '/api/auth/customer/verify-otp',
  LOGIN: '/api/auth/customer/login',
  
  // Customer endpoints
  CUSTOMER_PROFILE: '/api/customer/profile',
  CUSTOMER_ADDRESSES: '/api/customer/addresses',
  CUSTOMER_CART: '/api/customer/cart',
  CUSTOMER_ORDERS: '/api/customer/orders',
  CUSTOMER_WISHLIST: '/api/customer/wishlist',
  
  // Product endpoints
  PRODUCTS: '/api/products',
  PRODUCT_BY_ID: (id) => `/api/products/${id}`,
  
  // Category endpoints
  CATEGORIES: '/api/categories',
  
  // Payment endpoints
  PAYMENT_CREATE_ORDER: '/api/payments/create-order',
  PAYMENT_VERIFY: '/api/payments/verify-payment',
  
  // Order endpoints
  ORDERS: '/api/orders',
  ORDER_BY_ID: (id) => `/api/orders/${id}`,
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.baseURL}${endpoint}`;
};

// Helper function to get API config with auth token
export const getApiConfig = (includeAuth = true) => {
  const config = { ...API_CONFIG };
  
  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      };
    }
  }
  
  return config;
};

// Export base URL for direct use
export const API_BASE_URL = API_CONFIG.baseURL;

export default API_CONFIG;
