import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContextEnhanced';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import OTPLogin from './pages/OTPLogin';
import About from './pages/About';
import Contact from './pages/Contact';

// Protected pages
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderSuccess from './pages/OrderSuccess';
import OrderTracking from './pages/OrderTracking';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public routes with layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:id" element={<ProductDetails />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              
              {/* Protected routes */}
              <Route
                path="cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="orders/:orderId"
                element={
                  <ProtectedRoute>
                    <OrderSuccess />
                  </ProtectedRoute>
                }
              />
              <Route
                path="track-order/:orderNumber"
                element={
                  <ProtectedRoute>
                    <OrderTracking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="wishlist"
                element={
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Payment result pages (without layout) */}
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/failure" element={<PaymentFailure />} />

            {/* Auth routes without layout */}
            <Route path="/login" element={<OTPLogin />} />
            <Route path="/otp-login" element={<OTPLogin />} />

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
