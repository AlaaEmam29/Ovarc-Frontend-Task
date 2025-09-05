// src/store/actions/storeActions.js
import {
  FETCH_STORES_REQUEST,
  FETCH_STORES_SUCCESS,
  FETCH_STORES_FAILURE,
  FETCH_STORE_REQUEST,
  FETCH_STORE_SUCCESS,
  FETCH_STORE_FAILURE
} from './types';
import storeApi from '../../network/storeApi';

// Create a map to store abort controllers for each request type
const abortControllers = {
  fetchStores: null,
  fetchStore: null
};

// Helper to abort previous requests of the same type
const abortPreviousRequest = (requestType) => {
  if (abortControllers[requestType]) {
    abortControllers[requestType].abort();
  }
  abortControllers[requestType] = new AbortController();
  return abortControllers[requestType].signal;
};

// Fetch all stores
export const fetchStores = () => async (dispatch) => {
  try {
    // Abort any previous fetchStores request
    const signal = abortPreviousRequest('fetchStores');
    
    dispatch({ type: FETCH_STORES_REQUEST });
    
    const response = await storeApi.getAll(signal);
    dispatch({
      type: FETCH_STORES_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    // Don't dispatch failure for aborted requests
    if (error.name === 'AbortError') return;
    
    dispatch({
      type: FETCH_STORES_FAILURE,
      payload: error.message
    });
  }
};

// Fetch a single store by ID
export const fetchStoreById = (id) => async (dispatch) => {
  try {
    // Abort any previous fetchStore request
    const signal = abortPreviousRequest('fetchStore');
    
    dispatch({ type: FETCH_STORE_REQUEST });
    
    const response = await storeApi.getById(id, signal);
    dispatch({
      type: FETCH_STORE_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    // Don't dispatch failure for aborted requests
    if (error.name === 'AbortError') return;
    
    dispatch({
      type: FETCH_STORE_FAILURE,
      payload: error.message
    });
  }
};