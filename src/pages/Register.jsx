import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, ArrowRight } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();

  // Redirect to OTP login since customers don't register via email
  useEffect(() => {
    navigate('/app/otp-login', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/app" className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="text-2xl font-bold text-primary-600">Buildify</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Get Started</h2>
          <p className="mt-2 text-gray-600">Redirecting to phone verification...</p>
        </div>

        {/* Redirect Message */}
        <div className="bg-white rounded-xl shadow-lg border p-8 text-center">
          <Phone className="w-16 h-16 mx-auto mb-4 text-primary-600" />
          <h3 className="text-lg font-semibold mb-2">Quick & Easy Signup</h3>
          <p className="text-gray-600 mb-6">
            We've simplified the process! Just use your phone number to get started.
          </p>
          
          <Link
            to="/app/otp-login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Continue with Phone
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
