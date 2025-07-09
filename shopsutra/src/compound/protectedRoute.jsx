import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/login' && token) {
      navigate('/', { replace: true });
    }

    if (!token && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }

    if (!token && !location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [token, location.pathname, navigate]);

  if (!token && location.pathname !== '/login') {
    return null;
  }

  return children;
};

export default ProtectedRoute;
