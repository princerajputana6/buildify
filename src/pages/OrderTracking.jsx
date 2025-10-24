import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ArrowLeft,
  Download,
  Star
} from 'lucide-react';
import axios from 'axios';

const OrderTracking = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderNumber) {
      fetchOrderDetails();
    }
  }, [orderNumber]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // First try to get order by order number
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        const foundOrder = response.data.data.orders.find(
          order => order.orderNumber === orderNumber
        );
        
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          setError('Order not found');
        }
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status, isActive = false) => {
    const iconClass = `w-6 h-6 ${isActive ? 'text-primary-600' : 'text-gray-400'}`;
    
    switch (status) {
      case 'pending': return <Clock className={iconClass} />;
      case 'confirmed': return <CheckCircle className={iconClass} />;
      case 'processing': return <Package className={iconClass} />;
      case 'shipped': return <Truck className={iconClass} />;
      case 'delivered': return <CheckCircle className={iconClass} />;
      case 'cancelled': return <XCircle className={iconClass} />;
      default: return <Clock className={iconClass} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-purple-600 bg-purple-100';
      case 'shipped': return 'text-indigo-600 bg-indigo-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTrackingSteps = () => {
    const steps = [
      { key: 'pending', label: 'Order Placed', description: 'Your order has been received' },
      { key: 'confirmed', label: 'Order Confirmed', description: 'Seller has confirmed your order' },
      { key: 'processing', label: 'Processing', description: 'Your order is being prepared' },
      { key: 'shipped', label: 'Shipped', description: 'Your order is on the way' },
      { key: 'delivered', label: 'Delivered', description: 'Order delivered successfully' }
    ];

    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(order?.status);

    return steps.map((step, index) => ({
      ...step,
      isCompleted: index <= currentIndex,
      isActive: index === currentIndex,
      isCancelled: order?.status === 'cancelled'
    }));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-gray-600 mb-6">{error || 'The order you are looking for does not exist.'}</p>
        <button
          onClick={() => navigate('/orders')}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          View All Orders
        </button>
      </div>
    );
  }

  const trackingSteps = getTrackingSteps();

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/orders')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Tracking</h1>
            <p className="text-gray-600">Order #{order.orderNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Ordered on {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      {/* Order Status Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h2>
        
        {order.status === 'cancelled' ? (
          <div className="text-center py-8">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Order Cancelled</h3>
            <p className="text-gray-600">This order has been cancelled.</p>
          </div>
        ) : (
          <div className="relative">
            {trackingSteps.map((step, index) => (
              <div key={step.key} className="relative flex items-center pb-8 last:pb-0">
                {/* Connector Line */}
                {index < trackingSteps.length - 1 && (
                  <div className={`absolute left-3 top-8 w-0.5 h-16 ${
                    step.isCompleted ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
                
                {/* Step Icon */}
                <div className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full border-2 ${
                  step.isCompleted 
                    ? 'bg-primary-600 border-primary-600' 
                    : step.isActive 
                      ? 'bg-white border-primary-600' 
                      : 'bg-white border-gray-300'
                }`}>
                  {step.isCompleted && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                  {step.isActive && !step.isCompleted && (
                    <div className="w-2 h-2 bg-primary-600 rounded-full" />
                  )}
                </div>
                
                {/* Step Content */}
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-medium ${
                        step.isCompleted || step.isActive ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.label}
                      </h3>
                      <p className={`text-sm ${
                        step.isCompleted || step.isActive ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                    {step.isCompleted && order.timeline && (
                      <div className="text-right">
                        {(() => {
                          const timelineEvent = order.timeline.find(event => event.status === step.key);
                          return timelineEvent ? (
                            <p className="text-sm text-gray-500">
                              {formatDate(timelineEvent.timestamp)}
                            </p>
                          ) : null;
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                <p className="text-gray-600">{order.shippingAddress.street}</p>
                <p className="text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
                {order.shippingAddress.landmark && (
                  <p className="text-gray-600">Landmark: {order.shippingAddress.landmark}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <p className="text-gray-600">{order.shippingAddress.phone || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">₹{order.pricing.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-900">₹{order.pricing.shippingCharges}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-900">₹{order.pricing.tax}</span>
            </div>
            {order.pricing.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="text-green-600">-₹{order.pricing.discount}</span>
              </div>
            )}
            <div className="border-t pt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-semibold text-gray-900">₹{order.pricing.totalAmount}</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Payment Method: <span className="font-medium">{order.paymentMethod.toUpperCase()}</span>
              </p>
              <p className="text-sm text-gray-600">
                Payment Status: <span className="font-medium">{order.paymentStatus}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                {item.productSnapshot.image ? (
                  <img
                    src={item.productSnapshot.image}
                    alt={item.productSnapshot.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Package className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.productSnapshot.name}</h3>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-sm text-gray-600">Unit Price: ₹{item.unitPrice}</p>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(item.status)}`}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">₹{item.totalPrice}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Notes */}
      {order.notes?.customerNotes && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Notes</h2>
          <p className="text-gray-600">{order.notes.customerNotes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => navigate('/orders')}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Back to Orders
        </button>
        {order.status === 'delivered' && (
          <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2">
            <Star className="w-4 h-4" />
            <span>Rate Order</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
