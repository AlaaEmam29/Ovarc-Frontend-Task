// src/hooks/useAuth.js
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, checkLoggedInUser } from '../store/actions/userActions';

const useAuth = () => {
  const dispatch = useDispatch();
  const { currentUser, loading, error, isAuthenticated } = useSelector(state => state.user);
  
  // Check if user is already logged in from localStorage on hook initialization
  useEffect(() => {
    dispatch(checkLoggedInUser());
  }, [dispatch]);

  // Login function
  const handleLogin = useCallback((username, password) => {
    return dispatch(login(username, password));
  }, [dispatch]);

  // Logout function
  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return {
    // State
    currentUser,
    loading,
    error,
    isAuthenticated,
    
    // Actions
    login: handleLogin,
    logout: handleLogout
  };
};

export default useAuth;