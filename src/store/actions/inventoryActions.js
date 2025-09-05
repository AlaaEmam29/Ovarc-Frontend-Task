// src/store/actions/inventoryActions.js
import {
  FETCH_INVENTORY_REQUEST,
  FETCH_INVENTORY_SUCCESS,
  FETCH_INVENTORY_FAILURE,
  FETCH_INVENTORY_ITEM_REQUEST,
  FETCH_INVENTORY_ITEM_SUCCESS,
  FETCH_INVENTORY_ITEM_FAILURE
} from './types';
import inventoryApi from '../../network/inventoryApi';

// Create a map to store abort controllers for each request type
const abortControllers = {
  fetchInventory: null,
  fetchInventoryItem: null
};

// Helper to abort previous requests of the same type
const abortPreviousRequest = (requestType) => {
  if (abortControllers[requestType]) {
    abortControllers[requestType].abort();
  }
  abortControllers[requestType] = new AbortController();
  return abortControllers[requestType].signal;
};

// Fetch all inventory items
export const fetchInventory = () => async (dispatch) => {
  try {
    // Abort any previous fetchInventory request
    const signal = abortPreviousRequest('fetchInventory');
    
    dispatch({ type: FETCH_INVENTORY_REQUEST });
    
    const response = await inventoryApi.getAll(signal);
    dispatch({
      type: FETCH_INVENTORY_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    // Don't dispatch failure for aborted requests
    if (error.name === 'AbortError') return;
    
    dispatch({
      type: FETCH_INVENTORY_FAILURE,
      payload: error.message
    });
  }
};

// Fetch a single inventory item by ID
export const fetchInventoryItemById = (id) => async (dispatch) => {
  try {
    // Abort any previous fetchInventoryItem request
    const signal = abortPreviousRequest('fetchInventoryItem');
    
    dispatch({ type: FETCH_INVENTORY_ITEM_REQUEST });
    
    const response = await inventoryApi.getById(id, signal);
    dispatch({
      type: FETCH_INVENTORY_ITEM_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    // Don't dispatch failure for aborted requests
    if (error.name === 'AbortError') return;
    
    dispatch({
      type: FETCH_INVENTORY_ITEM_FAILURE,
      payload: error.message
    });
  }
};