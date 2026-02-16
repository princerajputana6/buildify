import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Minus, 
  Plus, 
  Truck, 
  Shield, 
  RotateCcw, 
  Award,
  ChevronLeft,
  ChevronRight,
  Check,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContextEnhanced';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { buildApiUrl, API_ENDPOINTS } from '../config/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, getCartItem, updateCartItem } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetchProduct();
    fetchRelatedProducts();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(buildApiUrl(API_ENDPOINTS.PRODUCT_BY_ID(id)));
      if (response.data.success) {
        setProduct(response.data.data.product);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      // Mock product data for development
      setProduct({
        _id: id,
        name: 'Portland Cement - Grade 53 - 50kg Premium Quality',
        description: 'High-quality Portland cement suitable for all construction needs. This premium grade cement offers excellent strength and durability for residential and commercial construction projects.',
        price: 350,
        discountPrice: 320,
        images: [
          { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600', alt: 'Cement Bag Front' },
          { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600', alt: 'Cement Bag Side' },
          { url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=600', alt: 'Cement Usage' },
          { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', alt: 'Construction Site' }
        ],
        category: { name: 'Cement & Concrete', _id: '1' },
        subcategory: { name: 'Portland Cement', _id: '1' },
        seller: { 
          name: 'BuildMart Supplies', 
          _id: 'seller1',
          rating: 4.8,
          totalSales: 15420
        },
        ratings: { average: 4.5, count: 125 },
        stock: 1000,
        unit: 'bag',
        specifications: {
          'Grade': 'Grade 53',
          'Weight': '50 kg',
          'Compressive Strength': '53 MPa',
          'Setting Time': '30 minutes (initial), 600 minutes (final)',
          'Fineness': '300 m²/kg',
          'Soundness': 'Less than 10mm',
          'Brand': 'BuildMart Premium',
          'Manufacturing Date': 'Within 30 days',
          'Shelf Life': '3 months from manufacturing'
        },
        features: [
          'High compressive strength',
          'Quick setting time',
          'Excellent durability',
          'Suitable for all weather conditions',
          'Low heat of hydration',
          'Consistent quality'
        ],
        reviews: [
          {
            _id: '1',
            user: { name: 'Rajesh Kumar', avatar: null },
            rating: 5,
            comment: 'Excellent quality cement. Used for my house construction and very satisfied with the strength.',
            date: '2024-10-15',
            verified: true
          },
          {
            _id: '2',
            user: { name: 'Priya Sharma', avatar: null },
            rating: 4,
            comment: 'Good quality product. Fast delivery and well packaged.',
            date: '2024-10-12',
            verified: true
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await axios.get(buildApiUrl(`${API_ENDPOINTS.PRODUCTS}?category=Cement & Concrete&limit=4`));
      if (response.data.success) {
        setRelatedProducts(response.data.data.products || []);
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
      // Mock related products
      setRelatedProducts([
        {
          _id: '2',
          name: 'Steel Rebar - Fe500 - 12mm',
          price: 45,
          images: [{ url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400' }],
          ratings: { average: 4.8, count: 89 }
        },
        {
          _id: '3',
          name: 'Red Clay Bricks - Standard Size',
          price: 8,
          images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' }],
          ratings: { average: 4.3, count: 67 }
        }
      ]);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    handleAddToCart();
    navigate('/app/checkout');
  };

  const nextImage = () => {
    if (product?.images) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/app/products" className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600">
        <Link to="/app" className="hover:text-primary-600">Home</Link>
        <span>/</span>
        <Link to="/app/products" className="hover:text-primary-600">Products</Link>
        <span>/</span>
        <Link to={`/app/products?category=${product.category?.name}`} className="hover:text-primary-600">
          {product.category?.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative bg-white rounded-xl border overflow-hidden">
            <img
              src={product.images?.[selectedImage]?.url || '/placeholder.jpg'}
              alt={product.images?.[selectedImage]?.alt || product.name}
              className="w-full h-96 object-cover"
            />
            
            {/* Image Navigation */}
            {product.images && product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {discountPercentage}% OFF
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
                    index === selectedImage ? 'border-primary-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title and Rating */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.ratings?.average || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  {product.ratings?.average} ({product.ratings?.count} reviews)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              {product.discountPrice ? (
                <>
                  <span className="text-3xl font-bold text-green-600">₹{product.discountPrice}</span>
                  <span className="text-xl text-gray-500 line-through">₹{product.price}</span>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                    Save ₹{product.price - product.discountPrice}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
              )}
              <span className="text-gray-600">per {product.unit}</span>
            </div>
            <p className="text-sm text-gray-600">Inclusive of all taxes</p>
          </div>

          {/* Seller Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sold by</p>
                <p className="font-semibold text-gray-900">{product.seller?.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{product.seller?.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-600">{product.seller?.totalSales}+ sales</span>
                </div>
              </div>
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-green-600 font-medium">In Stock ({product.stock} {product.unit}s available)</span>
              </>
            ) : (
              <>
                <X className="w-5 h-5 text-red-500" />
                <span className="text-red-600 font-medium">Out of Stock</span>
              </>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-50 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-50 transition-colors"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm text-gray-600">({product.unit}s)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isInCart(product._id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-colors ${
                  product.stock === 0 || isInCart(product._id)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {isInCart(product._id) ? 'Added to Cart' : 'Add to Cart'}
              </button>
              
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                  product.stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 py-6 border-t">
            <div className="text-center">
              <Truck className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Free Delivery</p>
              <p className="text-xs text-gray-600">Above ₹500</p>
            </div>
            <div className="text-center">
              <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Quality Assured</p>
              <p className="text-xs text-gray-600">Certified Products</p>
            </div>
            <div className="text-center">
              <RotateCcw className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Easy Returns</p>
              <p className="text-xs text-gray-600">7 Days Return</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="bg-white rounded-xl border">
        {/* Tab Headers */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'description', label: 'Description' },
              { id: 'specifications', label: 'Specifications' },
              { id: 'reviews', label: `Reviews (${product.reviews?.length || 0})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'description' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Product Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
              
              {product.features && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'specifications' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-900">{key}:</span>
                    <span className="text-gray-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Customer Reviews</h3>
                <button className="text-primary-600 hover:text-primary-700 font-medium">
                  Write a Review
                </button>
              </div>
              
              <div className="space-y-4">
                {product.reviews?.map((review) => (
                  <div key={review._id} className="border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="font-medium text-primary-600">
                          {review.user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.user.name}</span>
                          {review.verified && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct._id}
                to={`/app/products/${relatedProduct._id}`}
                className="bg-white rounded-xl shadow-md border hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={relatedProduct.images?.[0]?.url || '/placeholder.jpg'}
                  alt={relatedProduct.name}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {relatedProduct.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">
                      {relatedProduct.ratings?.average} ({relatedProduct.ratings?.count})
                    </span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    ₹{relatedProduct.price}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
