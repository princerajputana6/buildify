import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Grid, List, ShoppingCart, Heart, Star } from 'lucide-react';
import { useCart } from '../context/CartContextEnhanced';
import axios from 'axios';
import { buildApiUrl, API_ENDPOINTS } from '../config/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  
  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(buildApiUrl(API_ENDPOINTS.PRODUCTS));
      if (response.data.success) {
        setProducts(response.data.data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Mock data for development
      setProducts([
        {
          _id: '1',
          name: 'Portland Cement - Grade 53 - 50kg',
          description: 'High-quality Portland cement suitable for all construction needs.',
          price: 350,
          discountPrice: 320,
          images: [{ url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400', alt: 'Cement' }],
          category: { name: 'Cement & Concrete' },
          seller: { name: 'BuildMart Supplies' },
          ratings: { average: 4.5, count: 125 },
          stock: 1000,
          unit: 'bag'
        },
        {
          _id: '2',
          name: 'Steel Rebar - Fe500 - 12mm',
          description: 'High tensile strength steel rebar for reinforced concrete construction.',
          price: 45,
          images: [{ url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400', alt: 'Steel Rebar' }],
          category: { name: 'Steel & Iron' },
          seller: { name: 'SteelMax Industries' },
          ratings: { average: 4.8, count: 89 },
          stock: 500,
          unit: 'meter'
        },
        {
          _id: '3',
          name: 'Red Clay Bricks - Standard Size',
          description: 'Premium quality red clay bricks for construction.',
          price: 8,
          images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', alt: 'Bricks' }],
          category: { name: 'Bricks & Blocks' },
          seller: { name: 'Brick Masters' },
          ratings: { average: 4.3, count: 67 },
          stock: 10000,
          unit: 'piece'
        },
        {
          _id: '4',
          name: 'Ceramic Floor Tiles - 60x60cm',
          description: 'Premium ceramic tiles for flooring with anti-slip surface.',
          price: 120,
          discountPrice: 100,
          images: [{ url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', alt: 'Tiles' }],
          category: { name: 'Tiles & Flooring' },
          seller: { name: 'Tile World' },
          ratings: { average: 4.6, count: 156 },
          stock: 800,
          unit: 'sqft'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(buildApiUrl(API_ENDPOINTS.CATEGORIES));
      if (response.data.success) {
        setCategories(response.data.data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Mock categories
      setCategories([
        { _id: '1', name: 'Cement & Concrete' },
        { _id: '2', name: 'Steel & Iron' },
        { _id: '3', name: 'Bricks & Blocks' },
        { _id: '4', name: 'Tiles & Flooring' }
      ]);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category?.name === selectedCategory;
    const matchesPrice = (!priceRange.min || product.price >= parseInt(priceRange.min)) &&
                        (!priceRange.max || product.price <= parseInt(priceRange.max));
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      case 'price-high':
        return (b.discountPrice || b.price) - (a.discountPrice || a.price);
      case 'rating':
        return (b.ratings?.average || 0) - (a.ratings?.average || 0);
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={product.images?.[0]?.url || '/placeholder.jpg'}
          alt={product.images?.[0]?.alt || product.name}
          className="w-full h-48 object-cover rounded-t-lg"
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
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
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
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Stock: {product.stock} {product.unit}s
          </span>
          <div className="flex gap-2">
            <Link
              to={`/products/${product._id}`}
              className="px-3 py-1 text-sm border border-primary-600 text-primary-600 rounded hover:bg-primary-50 transition-colors"
            >
              View
            </Link>
            <button
              onClick={() => handleAddToCart(product)}
              disabled={isInCart(product._id)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
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
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Price Range */}
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min Price"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setPriceRange({ min: '', max: '' });
              setSortBy('name');
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {sortedProducts.length} of {products.length} products
        </p>
      </div>

      {/* Products Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        {sortedProducts.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Products;
