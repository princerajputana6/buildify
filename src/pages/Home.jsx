import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, Phone, ShoppingCart, Heart, Search, TrendingUp, Award, Users, Clock } from 'lucide-react';
import { useCart } from '../context/CartContextEnhanced';
import HeroSlider from '../components/home/HeroSlider';
import axios from 'axios';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch featured products and categories
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products?featured=true&limit=4`),
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories?limit=8`)
      ]);

      if (productsRes.data.success) {
        setFeaturedProducts(productsRes.data.data.products || []);
      }
      if (categoriesRes.data.success) {
        setCategories(categoriesRes.data.data.categories || []);
      }
    } catch (error) {
      if (error.code !== 'ERR_NETWORK') {
        console.error('Error fetching data:', error.message);
      }
      // Set empty arrays on error - will show "No products/categories found" message
      setFeaturedProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  return (
    <div className="space-y-12">
      {/* Animated Hero Slider */}
      <HeroSlider />

      {/* Quick Stats Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl text-white p-8 md:p-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="animate-fadeInUp">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold mb-1">50K+</div>
            <div className="text-primary-100">Happy Customers</div>
          </div>
          <div className="animate-fadeInUp animation-delay-200">
            <div className="flex items-center justify-center mb-2">
              <ShoppingCart className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold mb-1">1M+</div>
            <div className="text-primary-100">Products Sold</div>
          </div>
          <div className="animate-fadeInUp animation-delay-400">
            <div className="flex items-center justify-center mb-2">
              <Truck className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold mb-1">500+</div>
            <div className="text-primary-100">Cities Covered</div>
          </div>
          <div className="animate-fadeInUp animation-delay-600">
            <div className="flex items-center justify-center mb-2">
              <Award className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold mb-1">15+</div>
            <div className="text-primary-100">Years Experience</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Quality Assured</h3>
          <p className="text-gray-600">
            Premium construction materials from certified suppliers with quality guarantees
          </p>
          <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Truck className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
          <p className="text-gray-600">
            Quick and reliable delivery to your construction site across the city
          </p>
          <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
            <span>Track Orders</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Phone className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
          <p className="text-gray-600">
            Round-the-clock customer support for all your construction needs
          </p>
          <div className="mt-4 flex items-center text-purple-600 text-sm font-medium">
            <span>Contact Us</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
            <p className="text-gray-600">Find exactly what you need for your construction project</p>
          </div>
          <Link
            to="/products"
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category._id}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className="group bg-white rounded-xl shadow-md border hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={category.image || '/placeholder.jpg'}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-center group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
            <p className="text-gray-600">Top-rated construction materials chosen by professionals</p>
          </div>
          <Link
            to="/products"
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-md border hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img
                  src={product.images?.[0]?.url || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                {product.discountPrice && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                  </div>
                )}
                <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              <div className="p-4">
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">
                    {product.ratings?.average || 0} ({product.ratings?.count || 0})
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {product.discountPrice ? (
                      <>
                        <span className="text-lg font-bold text-green-600">₹{product.discountPrice}</span>
                        <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                    )}
                    <span className="text-sm text-gray-500">/{product.unit}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Link
                    to={`/products/${product._id}`}
                    className="flex-1 text-center px-3 py-2 text-sm border border-primary-600 text-primary-600 rounded hover:bg-primary-50 transition-colors"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={isInCart(product._id)}
                    className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
                      isInCart(product._id)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    {isInCart(product._id) ? 'In Cart' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-600 rounded-2xl p-8 md:p-12 text-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Trusted by Thousands</h2>
          <p className="text-primary-100 text-lg">Join the growing community of satisfied customers</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-yellow-400 mb-2">10K+</div>
            <div className="text-primary-100">Happy Customers</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-yellow-400 mb-2">500+</div>
            <div className="text-primary-100">Products</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-yellow-400 mb-2">50+</div>
            <div className="text-primary-100">Cities Served</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-yellow-400 mb-2">24/7</div>
            <div className="text-primary-100">Support</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Start Your Project?
        </h2>
        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
          Get access to premium construction materials with competitive pricing, 
          fast delivery, and expert support for all your building needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/products"
            className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Browse Products
          </Link>
          <Link
            to="/contact"
            className="border border-primary-600 text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
