import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to safely store data in localStorage
const safeSetLocalStorage = (key, value) => {
  try {
    if (value !== null && value !== undefined) {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    }
  } catch (error) {
    console.error(`Error storing ${key} in localStorage:`, error);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
        const parsedUser = JSON.parse(savedUser);
        console.log('✅ User loaded from localStorage:', parsedUser.phone || parsedUser.email);
        return parsedUser;
      }
      return null;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      localStorage.removeItem('user'); // Clear corrupted data
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('token');
    return (savedToken && savedToken !== 'undefined' && savedToken !== 'null') ? savedToken : null;
  });
  const [loading, setLoading] = useState(true);

  // Set axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Simple initialization - no complex auth checks that interfere
  useEffect(() => {
    // Just set loading to false after initial setup
    setLoading(false);
  }, []);

  // Ensure authentication state consistency
  useEffect(() => {
    if (user && token) {
      // Both user and token exist, ensure axios headers are set
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [user, token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        email,
        password
      });

      if (response.data.success) {
        const { user, token } = response.data.data;
        setUser(user);
        setToken(token);
        localStorage.setItem('token', token);
        return { success: true, user };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, userData);

      if (response.data.success) {
        const { user, token } = response.data.data;
        setUser(user);
        setToken(token);
        localStorage.setItem('token', token);
        return { success: true, user };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const otpLogin = async (phone, otp) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/customer/verify-otp`, {
        phone,
        otp
      });

      if (response.data.success) {
        const { user, token } = response.data.data;
        if (user && token) {
          setUser(user);
          setToken(token);
          safeSetLocalStorage('token', token);
          safeSetLocalStorage('user', user);
          return { success: true, user };
        } else {
          return { success: false, message: 'Invalid response data' };
        }
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'OTP verification failed' 
      };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/customer/profile`, updates);

      if (response.data.success) {
        setUser(response.data.data.user);
        return { success: true, user: response.data.data.user };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Profile update failed' 
      };
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/customer/cart`, {
        productId,
        quantity
      });

      if (response.data.success) {
        // Update user cart in context
        setUser(prev => ({
          ...prev,
          cart: response.data.data.cart
        }));
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add to cart' 
      };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/customer/cart/${productId}`);

      if (response.data.success) {
        setUser(prev => ({
          ...prev,
          cart: response.data.data.cart
        }));
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to remove from cart' 
      };
    }
  };

  const addToWishlist = async (productId) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/customer/wishlist`, {
        productId
      });

      if (response.data.success) {
        setUser(prev => ({
          ...prev,
          wishlist: response.data.data.wishlist
        }));
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add to wishlist' 
      };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/customer/wishlist/${productId}`);

      if (response.data.success) {
        setUser(prev => ({
          ...prev,
          wishlist: response.data.data.wishlist
        }));
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to remove from wishlist' 
      };
    }
  };

  // Authentication state ready

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    otpLogin,
    updateProfile,
    addToCart,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
    isAuthenticated: !!(user || (token && localStorage.getItem('user'))),
    isCustomer: user?.role === 'customer'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
