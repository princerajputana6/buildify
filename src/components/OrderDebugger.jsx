import React from 'react';
import { useCart } from '../context/CartContextEnhanced';
import { useAuth } from '../context/AuthContext';

const OrderDebugger = ({ formData }) => {
  const { cart } = useCart();
  const { user } = useAuth();

  const orderData = {
    items: cart.map(item => ({
      productId: item.product._id || item.product.id,
      quantity: item.quantity
    })),
    shippingAddress: {
      name: formData.fullName?.trim(),
      phone: formData.phone?.trim(),
      street: formData.address?.trim(),
      city: formData.city?.trim(),
      state: formData.state?.trim(),
      pincode: formData.pincode?.trim(),
      landmark: formData.landmark?.trim() || ''
    },
    paymentMethod: formData.paymentMethod === 'razorpay' || formData.paymentMethod === 'upi' ? 'online' : 'cod',
    customerNotes: formData.orderNotes?.trim() || ''
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-6">
      <h3 className="font-bold text-lg mb-4">Debug Information</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold">User Data:</h4>
          <pre className="text-xs bg-white p-2 rounded overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div>
          <h4 className="font-semibold">Cart Data:</h4>
          <pre className="text-xs bg-white p-2 rounded overflow-auto">
            {JSON.stringify(cart, null, 2)}
          </pre>
        </div>

        <div>
          <h4 className="font-semibold">Form Data:</h4>
          <pre className="text-xs bg-white p-2 rounded overflow-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>

        <div>
          <h4 className="font-semibold">Order Data (to be sent):</h4>
          <pre className="text-xs bg-white p-2 rounded overflow-auto">
            {JSON.stringify(orderData, null, 2)}
          </pre>
        </div>

        <div>
          <h4 className="font-semibold">Validation Check:</h4>
          <ul className="text-sm space-y-1">
            <li className={formData.fullName ? 'text-green-600' : 'text-red-600'}>
              ✓ Full Name: {formData.fullName || 'MISSING'}
            </li>
            <li className={formData.phone ? 'text-green-600' : 'text-red-600'}>
              ✓ Phone: {formData.phone || 'MISSING'}
            </li>
            <li className={formData.address ? 'text-green-600' : 'text-red-600'}>
              ✓ Address: {formData.address || 'MISSING'}
            </li>
            <li className={formData.city ? 'text-green-600' : 'text-red-600'}>
              ✓ City: {formData.city || 'MISSING'}
            </li>
            <li className={formData.state ? 'text-green-600' : 'text-red-600'}>
              ✓ State: {formData.state || 'MISSING'}
            </li>
            <li className={formData.pincode ? 'text-green-600' : 'text-red-600'}>
              ✓ Pincode: {formData.pincode || 'MISSING'}
            </li>
            <li className={cart && cart.length > 0 ? 'text-green-600' : 'text-red-600'}>
              ✓ Cart Items: {cart?.length || 0}
            </li>
            {cart && cart.length > 0 && (
              <li className={cart.every(item => item.product._id || item.product.id) ? 'text-green-600' : 'text-red-600'}>
                ✓ All products have valid IDs: {cart.every(item => item.product._id || item.product.id) ? 'YES' : 'NO'}
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderDebugger;
