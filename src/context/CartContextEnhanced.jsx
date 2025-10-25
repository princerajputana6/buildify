import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { buildApiUrl, API_ENDPOINTS, getApiConfig } from '../config/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart when component mounts or user authentication changes
  useEffect(() => {
    loadCart();
  }, [isAuthenticated, user]);

  // Load cart from appropriate source
  const loadCart = async () => {
    if (isAuthenticated) {
      // Load from database for authenticated users
      await loadCartFromDB();
    } else {
      // Load from session storage for guest users
      loadCartFromSession();
    }
  };

  // Load cart from database
  const loadCartFromDB = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        buildApiUrl(API_ENDPOINTS.CUSTOMER_CART),
        getApiConfig(token)
      );

      if (response.data.success) {
        setCart(response.data.data || []);
      }
    } catch (error) {
      if (error.code !== 'ERR_NETWORK') {
        console.error('Error loading cart from database:', error.message);
      }
      // Fallback to session storage if DB fails
      loadCartFromSession();
    } finally {
      setLoading(false);
    }
  };

  // Load cart from session storage
  const loadCartFromSession = () => {
    try {
      const savedCart = sessionStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error('Error parsing cart from session storage:', error);
      setCart([]);
    }
  };

  // Save cart to appropriate storage
  const saveCart = async (newCart) => {
    if (isAuthenticated) {
      // Save to database for authenticated users
      await saveCartToDB(newCart);
    } else {
      // Save to session storage for guest users
      saveCartToSession(newCart);
    }
  };

  // Save cart to database
  const saveCartToDB = async (cartData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        buildApiUrl(API_ENDPOINTS.CUSTOMER_CART),
        { cart: cartData },
        getApiConfig(token)
      );
    } catch (error) {
      console.error('Error saving cart to database:', error);
      // Fallback to session storage if DB fails
      saveCartToSession(cartData);
    }
  };

  // Save cart to session storage
  const saveCartToSession = (cartData) => {
    try {
      sessionStorage.setItem('cart', JSON.stringify(cartData));
    } catch (error) {
      console.error('Error saving cart to session storage:', error);
    }
  };

  // Migrate cart from session to database when user logs in
  const migrateCartToDatabase = async () => {
    try {
      const sessionCart = sessionStorage.getItem('cart');
      if (sessionCart && isAuthenticated) {
        const cartData = JSON.parse(sessionCart);
        if (cartData.length > 0) {
          // Merge session cart with any existing database cart
          const mergedCart = await mergeCartItems(cartData);
          await saveCartToDB(mergedCart);
          setCart(mergedCart);
          
          // Clear session storage after successful migration
          sessionStorage.removeItem('cart');
        }
      }
    } catch (error) {
      console.error('Error migrating cart to database:', error);
    }
  };

  // Merge cart items (combine quantities for same products)
  const mergeCartItems = async (sessionCart) => {
    try {
      // Get current database cart
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/customer/cart`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const dbCart = response.data.success ? response.data.data || [] : [];
      
      // Merge carts
      const mergedCart = [...dbCart];
      
      sessionCart.forEach(sessionItem => {
        const existingIndex = mergedCart.findIndex(
          dbItem => dbItem.product._id === sessionItem.product._id
        );
        
        if (existingIndex >= 0) {
          // Product exists, add quantities
          mergedCart[existingIndex].quantity += sessionItem.quantity;
        } else {
          // New product, add to cart
          mergedCart.push(sessionItem);
        }
      });

      return mergedCart;
    } catch (error) {
      console.error('Error merging cart items:', error);
      return sessionCart; // Return session cart if merge fails
    }
  };

  // Trigger migration when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      migrateCartToDatabase();
    }
  }, [isAuthenticated, user]);

  const addToCart = async (product, quantity = 1) => {
    const newCart = [...cart];
    const existingItemIndex = newCart.findIndex(item => item.product._id === product._id);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      newCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      newCart.push({
        product,
        quantity,
        addedAt: new Date().toISOString()
      });
    }
    
    setCart(newCart);
    await saveCart(newCart);
  };

  const updateCartItem = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    const newCart = cart.map(item =>
      item.product._id === productId
        ? { ...item, quantity }
        : item
    );
    
    setCart(newCart);
    await saveCart(newCart);
  };

  const removeFromCart = async (productId) => {
    const newCart = cart.filter(item => item.product._id !== productId);
    setCart(newCart);
    await saveCart(newCart);
  };

  const clearCart = async () => {
    setCart([]);
    await saveCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.product.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (productId) => {
    return cart.some(item => item.product._id === productId);
  };

  const getCartItem = (productId) => {
    return cart.find(item => item.product._id === productId);
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isInCart,
    getCartItem,
    itemsCount: getCartItemsCount(),
    total: getCartTotal()
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
