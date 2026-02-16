import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to OTP login with preserved state
  useEffect(() => {
    navigate('/app/otp-login', { 
      replace: true,
      state: location.state 
    });
  }, [navigate, location.state]);

  return null; // Component will redirect immediately
};

export default Login;
