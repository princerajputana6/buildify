import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Star, 
  Package, 
  RefreshCw,
  ArrowLeft,
  Filter,
  Search
} from 'lucide-react';
import axios from 'axios';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/customer/wishlist`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setWishlist(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      setRemoving(productId);
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/customer/wishlist/${productId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setWishlist(wishlist.filter(item => item._id !== productId));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Failed to remove item from wishlist');
    } finally {
      setRemoving(null);
    }
  };

  const addToCart = async (product) => {
    try {
      // Add to cart logic here
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/products"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600">{wishlist.length} items saved</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchWishlist}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <Link
            to="/products"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Wishlist Content */}
      {wishlist.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">
            Save items you love to your wishlist and never lose track of them.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Package className="w-5 h-5" />
            <span>Browse Products</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-100">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                
                {/* Remove from Wishlist Button */}
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  disabled={removing === product._id}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                >
                  {removing === product._id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                  ) : (
                    <Trash2 className="w-4 h-4 text-red-600" />
                  )}
                </button>

                {/* Stock Status */}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <Link
                  to={`/products/${product._id}`}
                  className="block hover:text-primary-600 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                {/* Seller Info */}
                {product.seller && (
                  <p className="text-sm text-gray-600 mb-2">
                    by {product.seller.businessName || 'Unknown Seller'}
                  </p>
                )}

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-3">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= (product.rating || 4)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({product.reviewCount || 0})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xl font-bold text-gray-900">
                      ₹{product.price?.toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm font-medium text-green-600">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                  </button>
                  
                  <Link
                    to={`/products/${product._id}`}
                    className="w-full flex items-center justify-center space-x-2 border border-primary-600 text-primary-600 py-2 px-4 rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    <span>View Details</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {wishlist.length > 0 && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                wishlist.forEach(product => {
                  if (product.stock > 0) {
                    addToCart(product);
                  }
                });
              }}
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add All to Cart</span>
            </button>
            
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
                  wishlist.forEach(product => removeFromWishlist(product._id));
                }
              }}
              className="flex items-center space-x-2 border border-red-600 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Wishlist</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
