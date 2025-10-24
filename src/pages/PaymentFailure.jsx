import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get('orderId');
  const reason = searchParams.get('reason');

  const handleRetryPayment = () => {
    // Navigate back to checkout to retry payment
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <XCircle className="mx-auto h-24 w-24 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Payment Failed
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Unfortunately, your payment could not be processed
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

            {reason && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Failure Reason</label>
                <p className="mt-1 text-sm text-gray-900 bg-red-50 p-2 rounded border border-red-200">
                  {decodeURIComponent(reason)}
                </p>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">What can you do?</h3>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Check your payment details and try again</li>
                <li>• Ensure sufficient balance in your account</li>
                <li>• Try a different payment method</li>
                <li>• Contact your bank if the issue persists</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRetryPayment}
              className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Payment
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
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

export default PaymentFailure;
