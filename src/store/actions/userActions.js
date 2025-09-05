// src/store/actions/userActions.js
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE,
  USER_LOGOUT
} from './types';
import users from '../../mocks/data/users.json';

// Login action
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });
    
    // Simulate API call with timeout
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find user in mock data
    const user = users.find(
      user => user.email === email && user.password === password
    );
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Create user object without password for security
    const authenticatedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar
    };
    
    // Store user in localStorage
    localStorage.setItem('user', JSON.stringify(authenticatedUser));
    
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: authenticatedUser
    });
    
    return authenticatedUser;
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAILURE,
      payload: error.message
    });
    
    throw error;
  }
};

// Logout action
export const logout = () => (dispatch) => {
  // Remove user from localStorage
  localStorage.removeItem('user');
  
  dispatch({ type: USER_LOGOUT });
};

// Check if user is already logged in from localStorage
export const checkLoggedInUser = () => (dispatch) => {
  const userJson = localStorage.getItem("user");
  if (userJson) {
    try {
      const user = JSON.parse(userJson);
      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: user,
      });
      return user;
    } catch (error) {
      localStorage.removeItem("user");
    }
  }
  return null;
};
