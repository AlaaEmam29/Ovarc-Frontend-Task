// src/store/reducers/storeReducer.js
import {
  FETCH_STORES_REQUEST,
  FETCH_STORES_SUCCESS,
  FETCH_STORES_FAILURE,
  FETCH_STORE_REQUEST,
  FETCH_STORE_SUCCESS,
  FETCH_STORE_FAILURE
} from '../actions/types';

const initialState = {
  stores: [],
  currentStore: null,
  loading: false,
  error: null
};

const storeReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch all stores
    case FETCH_STORES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_STORES_SUCCESS:
      return {
        ...state,
        loading: false,
        stores: action.payload,
        error: null
      };
    case FETCH_STORES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Fetch single store
    case FETCH_STORE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_STORE_SUCCESS:
      return {
        ...state,
        loading: false,
        currentStore: action.payload,
        error: null
      };
    case FETCH_STORE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default storeReducer;