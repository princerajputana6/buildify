import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  X, 
  Eye, 
  RotateCcw, 
  Filter,
  Search,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Star,
  Download,
  RefreshCw,
  AlertCircle,
  ShoppingBag
} from 'lucide-react';
import axios from 'axios';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      if (response.data.success) {
        setOrders(response.data.data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Mock data for development
      setOrders([
        {
          _id: '1',
          orderNumber: 'ORD-2024-001',
          status: 'delivered',
          total: 4130,
          itemsCount: 3,
          createdAt: '2024-10-15T10:30:00Z',
          estimatedDelivery: '2024-10-20T18:00:00Z',
          deliveredAt: '2024-10-19T16:30:00Z',
          items: [
            {
              product: {
                _id: '1',
                name: 'Portland Cement - Grade 53 - 50kg',
                images: [{ url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400' }]
              },
              quantity: 10,
              unitPrice: 320
            },
            {
              product: {
                _id: '2',
                name: 'Steel Rebar - Fe500 - 12mm',
                images: [{ url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400' }]
              },
              quantity: 20,
              unitPrice: 45
            }
          ],
          shippingAddress: {
            fullName: 'John Doe',
            address: '123 Main St, City, State 123456'
          },
          paymentMethod: 'cod'
        },
        {
          _id: '2',
          orderNumber: 'ORD-2024-002',
          status: 'shipped',
          total: 1180,
          itemsCount: 1,
          createdAt: '2024-10-18T14:20:00Z',
          estimatedDelivery: '2024-10-23T18:00:00Z',
          trackingNumber: 'TRK123456789',
          items: [
            {
              product: {
                _id: '4',
                name: 'Ceramic Floor Tiles - 60x60cm',
                images: [{ url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400' }]
              },
              quantity: 10,
              unitPrice: 100
            }
          ],
          shippingAddress: {
            fullName: 'John Doe',
            address: '123 Main St, City, State 123456'
          },
          paymentMethod: 'card'
        },
        {
          _id: '3',
          orderNumber: 'ORD-2024-003',
          status: 'processing',
          total: 944,
          itemsCount: 2,
          createdAt: '2024-10-20T09:15:00Z',
          estimatedDelivery: '2024-10-25T18:00:00Z',
          items: [
            {
              product: {
                _id: '3',
                name: 'Red Clay Bricks - Standard Size',
                images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' }]
              },
              quantity: 100,
              unitPrice: 8
            }
          ],
          shippingAddress: {
            fullName: 'John Doe',
            address: '123 Main St, City, State 123456'
          },
          paymentMethod: 'upi'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <X className="w-5 h-5 text-red-500" />;
      case 'returned':
        return <RotateCcw className="w-5 h-5 text-orange-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'returned':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const orderCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <Link
          to="/products"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Order Filters */}
      <div className="bg-white rounded-lg shadow-md border p-6">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Orders' },
            { key: 'pending', label: 'Pending' },
            { key: 'processing', label: 'Processing' },
            { key: 'shipped', label: 'Shipped' },
            { key: 'delivered', label: 'Delivered' },
            { key: 'cancelled', label: 'Cancelled' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label} ({orderCounts[key]})
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md border p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? "You haven't placed any orders yet."
              : `No orders with status "${filter}" found.`
            }
          </p>
          <Link
            to="/products"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md border">
              {/* Order Header */}
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="font-semibold text-lg">Order #{order.orderNumber}</h3>
                      <p className="text-gray-600 text-sm">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-semibold ml-2">₹{order.pricing?.totalAmount?.toLocaleString() || order.total?.toLocaleString() || '0'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Items:</span>
                    <span className="font-semibold ml-2">{order.itemsCount} items</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment:</span>
                    <span className="font-semibold ml-2 uppercase">{order.paymentMethod}</span>
                  </div>
                </div>

                {/* Delivery Information */}
                {order.status === 'shipped' && (
                  <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center gap-2 text-purple-800">
                      <Truck className="w-4 h-4" />
                      <span className="font-medium">In Transit</span>
                    </div>
                    <p className="text-purple-700 text-sm mt-1">
                      Expected delivery: {formatDate(order.estimatedDelivery)}
                    </p>
                    {order.trackingNumber && (
                      <p className="text-purple-700 text-sm">
                        Tracking: {order.trackingNumber}
                      </p>
                    )}
                  </div>
                )}

                {order.status === 'delivered' && order.deliveredAt && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">Delivered</span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      Delivered on {formatDate(order.deliveredAt)}
                    </p>
                  </div>
                )}

                {order.status === 'processing' && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-800">
                      <Package className="w-4 h-4" />
                      <span className="font-medium">Being Prepared</span>
                    </div>
                    <p className="text-blue-700 text-sm mt-1">
                      Your order is being prepared for shipment
                    </p>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="p-6">
                <h4 className="font-medium mb-4">Order Items</h4>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <img
                        src={item.product.images?.[0]?.url || '/placeholder.jpg'}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <div className="flex-1">
                        <Link
                          to={`/products/${item.product._id}`}
                          className="font-medium text-gray-900 hover:text-primary-600 line-clamp-2"
                        >
                          {item.product.name}
                        </Link>
                        <div className="text-sm text-gray-600 mt-1">
                          Quantity: {item.quantity} × ₹{item.unitPrice}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          ₹{(item.quantity * item.unitPrice).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Actions */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Deliver to: {order.shippingAddress.fullName}<br />
                    {order.shippingAddress.address}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/track-order/${order.orderNumber}`)}
                      className="inline-flex items-center gap-1 px-3 py-2 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                    >
                      <Truck className="w-4 h-4" />
                      Track Order
                    </button>
                    <Link
                      to={`/orders/${order.orderNumber}`}
                      className="inline-flex items-center gap-1 px-3 py-2 text-sm border border-primary-600 text-primary-600 rounded hover:bg-primary-50 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Link>
                    {order.status === 'delivered' && (
                      <button className="inline-flex items-center gap-1 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                        Reorder
                      </button>
                    )}
                    {(order.status === 'pending' || order.status === 'confirmed') && (
                      <button className="inline-flex items-center gap-1 px-3 py-2 text-sm border border-red-600 text-red-600 rounded hover:bg-red-50 transition-colors">
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="flex items-center justify-center mt-8">
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <span className="px-4 py-2 text-sm bg-primary-600 text-white rounded">1</span>
            <button className="px-3 py-2 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
