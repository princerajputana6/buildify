import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContextEnhanced';
import axios from 'axios';
import { buildApiUrl, API_ENDPOINTS, getApiConfig, RAZORPAY_CONFIG } from '../config/api';
import { MapPin, CreditCard, Truck, Shield, ArrowLeft, Smartphone, Banknote, CheckCircle, Plus, Home, Building, MapIcon } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, total, itemsCount, clearCart } = useCart();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  
  const [formData, setFormData] = useState({
    // Payment
    paymentMethod: 'cod',
    
    // Order Notes
    orderNotes: ''
  });

  const [newAddressData, setNewAddressData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    addressType: 'home',
    isDefault: false
  });

  // Fetch addresses when component mounts
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        buildApiUrl(API_ENDPOINTS.CUSTOMER_ADDRESSES),
        getApiConfig()
      );

      if (response.data.success) {
        const addressList = response.data.data;
        setAddresses(addressList);
        
        // Auto-select default address or first address
        const defaultAddress = addressList.find(addr => addr.isDefault) || addressList[0];
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddressData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addNewAddress = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        buildApiUrl(API_ENDPOINTS.CUSTOMER_ADDRESSES),
        newAddressData,
        getApiConfig()
      );

      if (response.data.success) {
        const updatedAddresses = response.data.data;
        setAddresses(updatedAddresses);
        
        // Select the newly added address
        const newAddress = updatedAddresses[updatedAddresses.length - 1];
        setSelectedAddress(newAddress);
        
        setShowAddAddress(false);
        resetNewAddressForm();
      }
    } catch (error) {
      console.error('Failed to add address:', error);
      alert('Failed to add address. Please try again.');
    }
  };

  const resetNewAddressForm = () => {
    setNewAddressData({
      name: user?.name || '',
      phone: user?.phone || '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
      addressType: 'home',
      isDefault: false
    });
  };

  const getAddressTypeIcon = (type) => {
    switch (type) {
      case 'home': return <Home className="w-4 h-4" />;
      case 'office': return <Building className="w-4 h-4" />;
      default: return <MapIcon className="w-4 h-4" />;
    }
  };

  const calculateTotals = () => {
    const subtotal = total;
    const tax = Math.round(subtotal * 0.18);
    const shipping = 0; // Free shipping
    const finalTotal = subtotal + tax + shipping;
    
    return { subtotal, tax, shipping, finalTotal };
  };

  const { subtotal, tax, shipping, finalTotal } = calculateTotals();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleOnlinePayment = async (orderData) => {
    try {
      console.log('Creating Razorpay payment order...');
      
      const response = await axios.post(
        buildApiUrl(API_ENDPOINTS.PAYMENT_CREATE_ORDER),
        {
          amount: finalTotal,
          currency: 'INR',
          receipt: `order_${Date.now()}`,
          orderData: orderData
        },
        getApiConfig()
      );

      if (response.data.success) {
        await handleRazorpayPayment(response.data.data, orderData);
      } else {
        throw new Error(response.data.message || 'Failed to create payment order');
      }
    } catch (error) {
      console.error('Payment creation error:', error);
      throw error;
    }
  };


  const handleRazorpayPayment = async (paymentData, orderData) => {
    try {
      console.log('Initiating Razorpay payment...');
      
      const { razorpayOrderId, amount, currency } = paymentData;
      
      const options = {
        key: RAZORPAY_CONFIG.key,
        amount: amount,
        currency: currency,
        name: RAZORPAY_CONFIG.name,
        description: RAZORPAY_CONFIG.description,
        order_id: razorpayOrderId,
        theme: RAZORPAY_CONFIG.theme,
        handler: async function (response) {
          try {
            console.log('Razorpay payment successful:', response);
            
            // Verify payment and create order
            const verifyResponse = await axios.post(
              buildApiUrl(API_ENDPOINTS.PAYMENT_VERIFY),
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: orderData
              },
              getApiConfig()
            );

            if (verifyResponse.data.success) {
              console.log('Order created successfully:', verifyResponse.data.data);
              setOrderNumber(verifyResponse.data.data._id);
              setOrderPlaced(true);
              clearCart();
            } else {
              throw new Error(verifyResponse.data.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: orderData.shippingAddress.name,
          email: user?.email || '',
          contact: orderData.shippingAddress.phone
        },
        theme: {
          color: '#3B82F6'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      return true;
    } catch (error) {
      console.error('Razorpay payment error:', error);
      
      // Provide more specific error messages
      if (error.response?.data?.error === 'RAZORPAY_NOT_CONFIGURED') {
        alert('Payment gateway is not configured. Please try Cash on Delivery or contact support.');
      } else if (error.response?.status === 401) {
        alert('Please login to continue with payment.');
        navigate('/login');
      } else if (error.response?.data?.message) {
        alert(`Payment Error: ${error.response.data.message}`);
      } else {
        alert('Failed to initiate payment. Please try again or use Cash on Delivery.');
      }
      return false;
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate selected address
      if (!selectedAddress) {
        alert('Please select a delivery address');
        setLoading(false);
        return;
      }

      if (!cart || cart.length === 0) {
        alert('Your cart is empty');
        setLoading(false);
        return;
      }

      // Prepare order data using selected address
      const orderData = {
        items: cart.map(item => ({
          productId: item.product._id || item.product.id,
          quantity: item.quantity
        })),
        shippingAddress: {
          name: selectedAddress.name.trim(),
          phone: selectedAddress.phone.trim(),
          street: selectedAddress.street.trim(),
          city: selectedAddress.city.trim(),
          state: selectedAddress.state.trim(),
          pincode: selectedAddress.pincode.trim(),
          landmark: selectedAddress.landmark?.trim() || ''
        },
        paymentMethod: formData.paymentMethod === 'razorpay' || formData.paymentMethod === 'upi' || formData.paymentMethod === 'online' ? 'online' : 'cod',
        customerNotes: formData.orderNotes?.trim() || ''
      };

      // Debug log
      console.log('Order data being sent:', orderData);
      console.log('Cart items:', cart);

      // Handle different payment methods
      if (formData.paymentMethod === 'razorpay' || formData.paymentMethod === 'upi' || formData.paymentMethod === 'online') {
        // Load Razorpay script
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          alert('Failed to load payment gateway. Please try again.');
          setLoading(false);
          return;
        }

        await handleOnlinePayment(orderData);
      } else {
        // Cash on Delivery - direct order placement
        const token = localStorage.getItem('token');
        const response = await axios.post(
          buildApiUrl(API_ENDPOINTS.CUSTOMER_ORDERS),
          orderData,
          getApiConfig()
        );

        if (response.data.success) {
          const newOrderNumber = response.data.data._id;
          setOrderNumber(newOrderNumber);
          setOrderPlaced(true);
          clearCart();
          
          // Redirect to order confirmation after 3 seconds
          setTimeout(() => {
            navigate(`/orders/${newOrderNumber}`);
          }, 3000);
        } else {
          throw new Error(response.data.message || 'Failed to place order');
        }
      }
    } catch (error) {
      console.error('Order placement error:', error);
      
      if (error.response?.data?.errors) {
        // Show validation errors
        const errorMessages = error.response.data.errors.map(err => err.msg).join('\n');
        alert(`Validation errors:\n${errorMessages}`);
      } else {
        alert(error.response?.data?.message || 'Failed to place order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Order Success Screen
  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your order. Your order number is <strong>{orderNumber}</strong>
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-green-800 mb-2">What's Next?</h3>
          <ul className="text-green-700 text-sm space-y-1 text-left">
            <li>• You'll receive an order confirmation email shortly</li>
            <li>• Track your order status in the Orders section</li>
            <li>• Estimated delivery: 3-5 business days</li>
          </ul>
        </div>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/orders')}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            View Orders
          </button>
          <button
            onClick={() => navigate('/products')}
            className="border border-primary-600 text-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      {/* Debug Information - Removed after fixing validation issue */}
      {/* <OrderDebugger formData={formData} /> */}

      <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-semibold">Shipping Address</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAddAddress(true)}
                className="flex items-center gap-2 px-3 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add New
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No Saved Addresses</p>
                <p className="text-sm mb-4">Add your first delivery address to continue</p>
                <button
                  type="button"
                  onClick={() => setShowAddAddress(true)}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Add Address
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <label
                    key={address._id}
                    className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                      selectedAddress?._id === address._id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="selectedAddress"
                      checked={selectedAddress?._id === address._id}
                      onChange={() => setSelectedAddress(address)}
                      className="w-5 h-5 text-primary-600 mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getAddressTypeIcon(address.addressType)}
                        <span className="font-semibold text-gray-900">{address.name}</span>
                        <span className="text-sm text-gray-500 capitalize">({address.addressType})</span>
                        {address.isDefault && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{address.phone}</p>
                      <p className="text-sm text-gray-700">
                        {address.street}
                        {address.landmark && `, ${address.landmark}`}
                      </p>
                      <p className="text-sm text-gray-700">
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md border p-6">
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-semibold">Payment Method</h2>
            </div>

            <div className="space-y-4">
              {/* Cash on Delivery */}
              <label className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-primary-600"
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Banknote className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Cash on Delivery</div>
                    <div className="text-sm text-gray-600">Pay when you receive your order</div>
                  </div>
                </div>
                <div className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  No extra charges
                </div>
              </label>

              {/* Razorpay Online Payment */}
              <label className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={formData.paymentMethod === 'razorpay'}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-primary-600"
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Pay Online</div>
                    <div className="text-sm text-gray-600">Credit/Debit Card, UPI, Net Banking, Wallets</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Secure
                  </div>
                  <Shield className="w-4 h-4 text-green-500" />
                </div>
              </label>

              {/* UPI Direct */}
              <label className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={formData.paymentMethod === 'upi'}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-primary-600"
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">UPI Payment</div>
                    <div className="text-sm text-gray-600">GPay, PhonePe, Paytm, BHIM & more</div>
                  </div>
                </div>
                <div className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                  Instant
                </div>
              </label>
            </div>

            {/* Payment Method Info */}
            {formData.paymentMethod === 'razorpay' && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Secure Online Payment</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <CreditCard className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                    <div className="text-xs font-medium">Cards</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <Smartphone className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                    <div className="text-xs font-medium">UPI</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <Banknote className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                    <div className="text-xs font-medium">Net Banking</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <CreditCard className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                    <div className="text-xs font-medium">Wallets</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-blue-700">
                  ✓ 256-bit SSL encryption ✓ PCI DSS compliant ✓ Instant refunds
                </div>
              </div>
            )}

            {formData.paymentMethod === 'upi' && (
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Smartphone className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-purple-900">UPI Payment</h4>
                </div>
                <div className="text-sm text-purple-700 mb-3">
                  You'll be redirected to your UPI app to complete the payment
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs bg-white rounded-lg px-3 py-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded text-white flex items-center justify-center text-xs font-bold">G</div>
                    <span>GPay</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs bg-white rounded-lg px-3 py-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded text-white flex items-center justify-center text-xs font-bold">P</div>
                    <span>PhonePe</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs bg-white rounded-lg px-3 py-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded text-white flex items-center justify-center text-xs font-bold">P</div>
                    <span>Paytm</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Notes */}
          <div className="bg-white rounded-lg shadow-md border p-6">
            <h2 className="text-xl font-semibold mb-4">Order Notes (Optional)</h2>
            <textarea
              name="orderNotes"
              value={formData.orderNotes}
              onChange={handleInputChange}
              rows={3}
              placeholder="Any special instructions for your order..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md border p-6 sticky top-6">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            
            {/* Order Items */}
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.product._id} className="flex items-center gap-3">
                  <img
                    src={item.product.images?.[0]?.url || '/placeholder.jpg'}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded border"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium line-clamp-1">
                      {item.product.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Qty: {item.quantity} × ₹{item.product.discountPrice || item.product.price}
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    ₹{((item.product.discountPrice || item.product.price) * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({itemsCount} items)</span>
                <span className="font-medium">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (18% GST)</span>
                <span className="font-medium">₹{tax.toLocaleString()}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-bold text-primary-600">
                    ₹{finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>

            <div className="mt-4 text-center text-xs text-gray-500">
              By placing your order, you agree to our Terms of Service and Privacy Policy
            </div>
          </div>
        </div>
      </form>

      {/* Add Address Modal */}
      {showAddAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add Delivery Address</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={newAddressData.name}
                    onChange={handleNewAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={newAddressData.phone}
                    onChange={handleNewAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Phone number"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                <input
                  type="text"
                  name="street"
                  value={newAddressData.street}
                  onChange={handleNewAddressChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="House no, street name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={newAddressData.city}
                    onChange={handleNewAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="City"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={newAddressData.state}
                    onChange={handleNewAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="State"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={newAddressData.pincode}
                    onChange={handleNewAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Pincode"
                    maxLength="6"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    name="addressType"
                    value={newAddressData.addressType}
                    onChange={handleNewAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="home">Home</option>
                    <option value="office">Office</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Landmark (Optional)</label>
                <input
                  type="text"
                  name="landmark"
                  value={newAddressData.landmark}
                  onChange={handleNewAddressChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Nearby landmark"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={newAddressData.isDefault}
                  onChange={handleNewAddressChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Set as default address</label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={addNewAddress}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add Address
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddAddress(false);
                  resetNewAddressForm();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
