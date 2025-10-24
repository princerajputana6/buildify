import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);

  const orderId = searchParams.get('orderId');
  const txnId = searchParams.get('txnId');

  useEffect(() => {
    // Fetch order details if orderId is available
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/customer/orders`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        const order = data.data.orders?.find(o => o._id === orderId);
        if (order) {
          setOrderDetails(order);
        }
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <CheckCircle className="mx-auto h-24 w-24 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Payment Successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your order has been placed successfully
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-4">
            {orderId && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Order ID</label>
                <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">
                  {orderId}
                </p>
              </div>
            )}

            {txnId && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">
                  {txnId}
                </p>
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">What's Next?</h3>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• You'll receive an order confirmation email shortly</li>
                <li>• Track your order status in the Orders section</li>
                <li>• Estimated delivery: 3-5 business days</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/orders')}
              className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
            >
              View Orders
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/products')}
              className="flex-1 border border-primary-600 text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact our support team
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
