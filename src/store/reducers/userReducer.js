// src/store/reducers/userReducer.js
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE,
  USER_LOGOUT
} from '../actions/types';

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
  isAuthenticated: false
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    // Login
    case USER_LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        currentUser: action.payload,
        isAuthenticated: true,
        error: null
      };
    case USER_LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false
      };
    
    // Logout
    case USER_LOGOUT:
      return {
        ...state,
        currentUser: null,
        isAuthenticated: false,
        error: null
      };

    default:
      return state;
  };
};

export default userReducer;