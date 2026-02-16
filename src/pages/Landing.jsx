import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, Package, Truck, Shield, Star, Phone, Mail, MapPin, 
  Menu, X, MessageCircle, CheckCircle, TrendingUp, Users, Award, 
  Zap, ArrowRight, Building2, Hammer, PaintBucket, Wrench, Search
} from 'lucide-react';
import logo from '../assets/logo.png';

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('customer');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const whatsappNumber = '916378078461';

  const openWhatsApp = (type) => {
    const message = type === 'customer' 
      ? 'Hi Buildify! I am interested in buying construction materials. Please share details about available products, pricing, and delivery options.'
      : 'Hi Buildify! I am a seller and interested in listing my construction materials on your platform. Please share the onboarding process and commission details.';
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/app/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Buildify" className="h-10 object-contain" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-blue-200 hover:text-white font-medium transition">Features</a>
              <a href="#categories" className="text-blue-200 hover:text-white font-medium transition">Categories</a>
              <a href="#sellers" className="text-blue-200 hover:text-white font-medium transition">For Sellers</a>
              <a href="#contact" className="text-blue-200 hover:text-white font-medium transition">Contact</a>
              <Link
                to="/app"
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-2.5 rounded-xl font-semibold border border-white/30 hover:bg-white/30 transition-all"
              >
                Open Store
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-blue-200 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-white/10">
              <div className="flex flex-col gap-4">
                <a href="#features" className="text-blue-200 hover:text-white font-medium" onClick={() => setMobileMenuOpen(false)}>Features</a>
                <a href="#categories" className="text-blue-200 hover:text-white font-medium" onClick={() => setMobileMenuOpen(false)}>Categories</a>
                <a href="#sellers" className="text-blue-200 hover:text-white font-medium" onClick={() => setMobileMenuOpen(false)}>For Sellers</a>
                <a href="#contact" className="text-blue-200 hover:text-white font-medium" onClick={() => setMobileMenuOpen(false)}>Contact</a>
                <Link
                  to="/app"
                  className="bg-white/20 text-white px-6 py-2.5 rounded-xl font-semibold text-center border border-white/30"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Open Store
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Zap className="w-4 h-4" />
                India's #1 Construction Materials Platform
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Build Smarter with
                <span className="block text-blue-700">
                  Quality Materials
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
                Get transparent pricing, doorstep delivery, and quality guarantee on 
                construction materials and sanitary items — all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/app"
                  className="bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-800 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Start Shopping
                </Link>
                <button
                  onClick={() => openWhatsApp('customer')}
                  className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-700 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat on WhatsApp
                </button>
              </div>
              <div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Best Prices Guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Quality Assured</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Fast Delivery</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="hidden lg:block relative">
              <div className="relative w-full h-[480px]">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200/40 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-200/30 rounded-full blur-3xl"></div>
                
                {/* Floating cards */}
                <div className="absolute top-8 right-8 bg-white rounded-2xl shadow-xl p-5 border border-gray-100 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Truck className="w-6 h-6 text-blue-700" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Free Delivery</p>
                      <p className="text-sm text-gray-500">Orders above ₹500</p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-40 left-0 bg-white rounded-2xl shadow-xl p-5 border border-gray-100 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-green-700" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">100% Genuine</p>
                      <p className="text-sm text-gray-500">Verified sellers only</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-16 right-16 bg-white rounded-2xl shadow-xl p-5 border border-gray-100 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">4.8 Rating</p>
                      <p className="text-sm text-gray-500">10K+ happy customers</p>
                    </div>
                  </div>
                </div>

                {/* Central icon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl flex items-center justify-center shadow-2xl rotate-6">
                    <Building2 className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-14 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10,000+', label: 'Products Available', icon: Package },
              { number: '500+', label: 'Verified Sellers', icon: Users },
              { number: '50+', label: 'Cities Covered', icon: MapPin },
              { number: '100%', label: 'Quality Assured', icon: Award }
            ].map((stat, idx) => (
              <div key={idx} className="text-white">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl mb-3">
                  <stat.icon className="w-6 h-6 text-yellow-400" />
                </div>
                <p className="text-3xl md:text-4xl font-bold mb-1">{stat.number}</p>
                <p className="text-blue-200 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need for your construction project
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {[
              { name: 'Cement & Steel', emoji: '🏗️', desc: 'Foundation essentials' },
              { name: 'Tiles & Marble', emoji: '🎨', desc: 'Flooring & walls' },
              { name: 'Sanitary Ware', emoji: '🚿', desc: 'Bathroom fittings' },
              { name: 'Plumbing', emoji: '🔧', desc: 'Pipes & fittings' },
              { name: 'Electrical', emoji: '⚡', desc: 'Wires & switches' },
              { name: 'Paints', emoji: '🖌️', desc: 'Interior & exterior' },
              { name: 'Doors & Windows', emoji: '🚪', desc: 'Wood & UPVC' },
              { name: 'Hardware', emoji: '🔨', desc: 'Tools & fasteners' }
            ].map((category, idx) => (
              <Link
                key={idx}
                to="/app/products"
                className="bg-gray-50 hover:bg-blue-50 rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-300 transition-all group hover:shadow-lg hover:-translate-y-1"
              >
                <div className="text-4xl mb-3">{category.emoji}</div>
                <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition mb-1">
                  {category.name}
                </p>
                <p className="text-sm text-gray-500">{category.desc}</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/app/products"
              className="inline-flex items-center gap-2 text-blue-700 font-semibold hover:text-blue-800 transition"
            >
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Why Choose Buildify?
            </h2>
            <p className="text-lg text-gray-600">
              Best-in-class features for a seamless shopping experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: ShoppingCart,
                title: 'Best Prices',
                description: 'Up to 20-40% cheaper than local dealers with complete price transparency.',
                iconBg: 'bg-blue-100',
                iconColor: 'text-blue-700'
              },
              {
                icon: Shield,
                title: 'Quality Guaranteed',
                description: 'All products from verified sellers with quality certifications and money-back guarantee.',
                iconBg: 'bg-green-100',
                iconColor: 'text-green-700'
              },
              {
                icon: Truck,
                title: 'Fast Delivery',
                description: 'Doorstep delivery within 24-48 hours with real-time tracking and installation support.',
                iconBg: 'bg-purple-100',
                iconColor: 'text-purple-700'
              },
              {
                icon: Star,
                title: 'Verified Sellers',
                description: 'Buy from trusted manufacturers and authorized dealers with proper GST certifications.',
                iconBg: 'bg-yellow-100',
                iconColor: 'text-yellow-700'
              },
              {
                icon: Zap,
                title: 'Bulk Discounts',
                description: 'Special pricing for contractors, builders, and bulk orders with credit facility.',
                iconBg: 'bg-orange-100',
                iconColor: 'text-orange-700'
              },
              {
                icon: Phone,
                title: '24/7 Support',
                description: 'Dedicated customer support via WhatsApp, phone, and email for all your queries.',
                iconBg: 'bg-cyan-100',
                iconColor: 'text-cyan-700'
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-7 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all group">
                <div className={`inline-flex items-center justify-center w-14 h-14 ${feature.iconBg} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Sellers Section */}
      <section id="sellers" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-3">
                  Sell on Buildify
                </h2>
                <p className="text-lg text-blue-200">
                  Join India's fastest-growing construction materials marketplace
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                  { title: 'Reach Millions', description: 'Access builders, contractors, and homeowners across India', icon: Users },
                  { title: 'Low Commission', description: 'Industry-lowest commission rates — free for the first 3 months', icon: TrendingUp },
                  { title: 'Easy Management', description: 'Simple dashboard to manage inventory, orders, and payments', icon: Package }
                ].map((benefit, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <benefit.icon className="w-8 h-8 text-yellow-400 mb-3" />
                    <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                    <p className="text-blue-200 text-sm">{benefit.description}</p>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={() => openWhatsApp('seller')}
                  className="bg-white text-blue-800 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all inline-flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Start Selling Today
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
            Ready to Transform Your Construction Shopping?
          </h2>
          <p className="text-lg text-gray-300 mb-10">
            Join thousands of builders, contractors, and homeowners who trust Buildify
          </p>

          <div className="flex items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveTab('customer')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === 'customer'
                  ? 'bg-white text-gray-900'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              I want to Buy
            </button>
            <button
              onClick={() => setActiveTab('seller')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === 'seller'
                  ? 'bg-white text-gray-900'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              I want to Sell
            </button>
          </div>

          {activeTab === 'customer' ? (
            <Link
              to="/app"
              className="bg-blue-700 text-white px-12 py-5 rounded-xl font-bold text-xl hover:bg-blue-800 hover:shadow-2xl transition-all inline-flex items-center gap-3"
            >
              <ShoppingCart className="w-6 h-6" />
              Browse Store
            </Link>
          ) : (
            <button
              onClick={() => openWhatsApp('seller')}
              className="bg-green-600 text-white px-12 py-5 rounded-xl font-bold text-xl hover:bg-green-700 hover:shadow-2xl transition-all inline-flex items-center gap-3"
            >
              <MessageCircle className="w-6 h-6" />
              Chat on WhatsApp
            </button>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-600">
              Have questions? We're here to help!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200 text-center hover:shadow-lg transition">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-700 rounded-xl mb-4">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">WhatsApp</h3>
              <p className="text-gray-600 mb-4">Chat with us instantly</p>
              <button
                onClick={() => openWhatsApp('customer')}
                className="bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-800 transition"
              >
                Start Chat
              </button>
            </div>

            <div className="bg-green-50 rounded-2xl p-8 border border-green-200 text-center hover:shadow-lg transition">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-600 rounded-xl mb-4">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600 mb-4">Call us for support</p>
              <a
                href="tel:+919876543210"
                className="inline-block bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                +91 98765 43210
              </a>
            </div>

            <div className="bg-purple-50 rounded-2xl p-8 border border-purple-200 text-center hover:shadow-lg transition">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-600 rounded-xl mb-4">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 mb-4">Send us your queries</p>
              <a
                href="mailto:support@buildify.in"
                className="inline-block bg-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                support@buildify.in
              </a>
            </div>
          </div>

          <div className="mt-10 bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-200 rounded-xl shrink-0">
                <MapPin className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Office Address</h3>
                <p className="text-gray-600">Ghaziabad, Delhi NCR, India - 201001</p>
                <p className="text-sm text-gray-500 mt-1">Mon - Sat: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="text-xl font-bold">Buildify</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                India's trusted e-commerce platform for construction materials and sanitary items.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#categories" className="hover:text-white transition">Categories</a></li>
                <li><a href="#sellers" className="hover:text-white transition">For Sellers</a></li>
                <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">For Sellers</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => openWhatsApp('seller')} className="hover:text-white transition">Become a Seller</button></li>
                <li><a href="#" className="hover:text-white transition">Seller Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Return Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Shipping Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Buildify. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <button
        onClick={() => openWhatsApp('customer')}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition hover:scale-110 z-50"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Landing;
