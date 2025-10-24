import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContextEnhanced';

const Cart = () => {
  const { cart, updateCartItem, removeFromCart, total, itemsCount, clearCart } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateCartItem(productId, newQuantity);
    }
  };

  const calculateItemTotal = (item) => {
    const price = item.product.discountPrice || item.product.price;
    return price * item.quantity;
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg shadow-md border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Cart Items ({itemsCount})</h2>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="divide-y">
              {cart.map((item) => (
                <div key={item.product._id} className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.product.images?.[0]?.url || '/placeholder.jpg'}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.product._id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-primary-600 line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {item.product.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-gray-500">
                          Seller: {item.product.seller?.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          Unit: {item.product.unit}
                        </span>
                      </div>
                    </div>

                    {/* Price and Quantity */}
                    <div className="flex flex-col items-end gap-4">
                      {/* Price */}
                      <div className="text-right">
                        {item.product.discountPrice ? (
                          <div>
                            <span className="text-lg font-bold text-green-600">
                              ₹{item.product.discountPrice}
                            </span>
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ₹{item.product.price}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            ₹{item.product.price}
                          </span>
                        )}
                        <div className="text-sm text-gray-500">per {item.product.unit}</div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                          className="p-1 rounded-full border border-gray-300 hover:bg-gray-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                          className="p-1 rounded-full border border-gray-300 hover:bg-gray-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          ₹{calculateItemTotal(item).toLocaleString()}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1 mt-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md border p-6 sticky top-6">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({itemsCount} items)</span>
                <span className="font-medium">₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (18% GST)</span>
                <span className="font-medium">₹{Math.round(total * 0.18).toLocaleString()}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-bold text-primary-600">
                    ₹{Math.round(total * 1.18).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium text-center block"
            >
              Proceed to Checkout
            </Link>

            <div className="mt-4 text-center">
              <Link
                to="/products"
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
            <h4 className="font-semibold text-green-800 mb-2">Free Delivery</h4>
            <p className="text-green-700 text-sm">
              Free delivery on orders above ₹500. Your order qualifies for free delivery!
            </p>
          </div>

          {/* Security Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-blue-800 mb-2">Secure Checkout</h4>
            <p className="text-blue-700 text-sm">
              Your payment information is processed securely. We do not store credit card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
