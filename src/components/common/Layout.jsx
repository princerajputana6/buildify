import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Heart, 
  Package,
  LogOut,
  Settings,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContextEnhanced';
import CategoryNavigation from './CategoryNavigation';
import logo from '../../assets/logo.png';

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, loading } = useAuth();
  
  // Authentication state ready
  const { itemsCount } = useCart();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/app/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/app');
  };

  // Removed static navigation - now using dynamic categories

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 shadow-lg sticky top-0 z-50">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-700 text-white text-sm">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>+91 99999 99999</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <span>support@buildify.com</span>
                </div>
              </div>
              <div className="hidden md:block">
                <span>Free delivery on orders above ₹500</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/app" className="flex items-center space-x-2">
              <img 
                src={logo} 
                alt="Buildify" 
                className="w-full h-12 object-contain"
              />
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search construction materials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
                  />
                </div>
              </form>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link
                to="/app/cart"
                className="relative p-2 text-blue-200 hover:text-white transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {itemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemsCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              <div className="relative">
                {isAuthenticated ? (
                  <div>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 p-2 text-blue-200 hover:text-white transition-colors"
                    >
                      <User className="w-6 h-6" />
                      <span className="hidden md:block">{user?.name || user?.phone || 'Profile'}</span>
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                        <Link
                          to="/app/profile"
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Profile
                        </Link>
                        <Link
                          to="/app/orders"
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Package className="w-4 h-4" />
                          My Orders
                        </Link>
                        <Link
                          to="/app/wishlist"
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Heart className="w-4 h-4" />
                          Wishlist
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/app/otp-login"
                    className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300"
                  >
                    Login
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-blue-200 hover:text-white"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center py-4 border-t">
            <CategoryNavigation />
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </form>

              {/* Mobile Navigation */}
              <nav>
                <CategoryNavigation mobile={true} onLinkClick={() => setIsMenuOpen(false)} />
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 min-h-screen">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="text-2xl font-bold">Buildify</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your trusted partner for premium construction materials. 
                Building dreams with quality and reliability.
              </p>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/app/products" className="text-gray-400 hover:text-white transition-colors">All Products</Link></li>
                <li><Link to="/app/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/app/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/app/orders" className="text-gray-400 hover:text-white transition-colors">Track Order</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <ul className="space-y-2">
                <li><Link to="/app/products?category=Cement & Concrete" className="text-gray-400 hover:text-white transition-colors">Cement & Concrete</Link></li>
                <li><Link to="/app/products?category=Steel & Iron" className="text-gray-400 hover:text-white transition-colors">Steel & Iron</Link></li>
                <li><Link to="/app/products?category=Bricks & Blocks" className="text-gray-400 hover:text-white transition-colors">Bricks & Blocks</Link></li>
                <li><Link to="/app/products?category=Tiles & Flooring" className="text-gray-400 hover:text-white transition-colors">Tiles & Flooring</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>+91 99999 99999</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>support@buildify.com</span>
                </li>
              </ul>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Business Hours</h4>
                <p className="text-gray-400 text-sm">Mon - Sat: 9:00 AM - 6:00 PM</p>
                <p className="text-gray-400 text-sm">Sunday: Closed</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Buildify. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>

      {/* Click outside handler for dropdowns */}
      {(isUserMenuOpen || isMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsUserMenuOpen(false);
            setIsMenuOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Layout;
