import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import LoginModal from './LoginModal';

// Higher-order component to protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = React.useState(!isAuthenticated);

  // If user is authenticated, render the children components
  if (isAuthenticated) {
    return children;
  }

  // If not authenticated, show login modal
  return (
    <>
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => {
          setShowLoginModal(false);
          return <Navigate to="/" replace />;
        }} 
      />
    </>
  );
};

export default ProtectedRoute;