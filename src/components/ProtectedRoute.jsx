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
          // Redirect to home page if they close the modal without logging in
          return <Navigate to="/" replace />;
        }} 
      />
      {/* Show a message that they need to log in */}
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
        <p className="mb-4">You need to be logged in to access this page.</p>
        <button
          onClick={() => setShowLoginModal(true)}
          className="bg-main text-white rounded px-4 py-2"
        >
          Sign In
        </button>
      </div>
    </>
  );
};

export default ProtectedRoute;