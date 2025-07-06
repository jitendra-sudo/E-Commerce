import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Register from "./Register";

const ProtectedRoute = ({ children }) => {
  const [showRegister, setShowRegister] = useState(true);
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return (
      <>
        <Register showModal={showRegister} setShowModal={setShowRegister} />
      </>
    );
  }

  // If user is already authenticated, allow access
  return children;
};

export default ProtectedRoute;
