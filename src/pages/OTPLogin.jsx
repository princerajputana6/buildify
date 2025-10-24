import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Phone, ArrowRight, AlertCircle, CheckCircle, Timer } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const OTPLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { otpLogin } = useAuth();
  
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [formData, setFormData] = useState({
    phone: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);

  const from = location.state?.from?.pathname || '/';

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format phone number (remove non-digits)
    if (name === 'phone') {
      const phoneValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: phoneValue }));
    } else if (name === 'otp') {
      // Format OTP (only digits, max 6)
      const otpValue = value.replace(/\D/g, '').slice(0, 6);
      setFormData(prev => ({ ...prev, [name]: otpValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (error) setError('');
    if (success) setSuccess('');
  };

  const sendOTP = async (isResend = false) => {
    if (!formData.phone || formData.phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/customer/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: `+91${formData.phone}` }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(isResend ? 'OTP resent successfully!' : 'OTP sent successfully!');
        setStep('otp');
        setCountdown(60); // 60 seconds countdown
        
        // In development, show OTP in console
        if (data.otp) {
          console.log('Development OTP:', data.otp);
        }
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await otpLogin(`+91${formData.phone}`, formData.otp);

      if (result.success) {
        setSuccess('Login successful! Redirecting...');
        // Small delay to ensure AuthContext state is updated
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 100);
      } else {
        setError(result.message || 'Invalid OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 'phone') {
      await sendOTP();
    } else {
      await verifyOTP();
    }
  };

  const handleResendOTP = () => {
    if (countdown === 0) {
      sendOTP(true);
    }
  };

  const goBack = () => {
    setStep('phone');
    setFormData(prev => ({ ...prev, otp: '' }));
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="text-2xl font-bold text-primary-600">Buildify</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">
            {step === 'phone' ? 'Quick Login' : 'Verify OTP'}
          </h2>
          <p className="mt-2 text-gray-600">
            {step === 'phone' 
              ? 'Enter your phone number to get started' 
              : `We've sent a 6-digit code to +91 ${formData.phone}`
            }
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg border p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            )}

            {step === 'phone' ? (
              /* Phone Number Step */
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="absolute inset-y-0 left-10 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">+91</span>
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-20 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg tracking-wider"
                    placeholder="9876543210"
                    maxLength="10"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  We'll send you a verification code via SMS
                </p>
              </div>
            ) : (
              /* OTP Verification Step */
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  value={formData.otp}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
                  placeholder="000000"
                  maxLength="6"
                />
                
                {/* Resend OTP */}
                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={goBack}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    ← Change phone number
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={countdown > 0}
                    className="text-sm text-primary-600 hover:text-primary-500 font-medium disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    {countdown > 0 ? (
                      <>
                        <Timer className="w-4 h-4" />
                        Resend in {countdown}s
                      </>
                    ) : (
                      'Resend OTP'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  {step === 'phone' ? 'Send OTP' : 'Verify & Login'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>


        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-600">
          <div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-green-600 font-bold">⚡</span>
            </div>
            <p>Quick Login</p>
          </div>
          <div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-600 font-bold">🔒</span>
            </div>
            <p>Secure OTP</p>
          </div>
          <div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-purple-600 font-bold">📱</span>
            </div>
            <p>SMS Verification</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPLogin;
