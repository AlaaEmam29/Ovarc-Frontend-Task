// src/store/actions/inventoryActions.js
import {
  FETCH_INVENTORY_REQUEST,
  FETCH_INVENTORY_SUCCESS,
  FETCH_INVENTORY_FAILURE,
  FETCH_INVENTORY_ITEM_REQUEST,
  FETCH_INVENTORY_ITEM_SUCCESS,
  FETCH_INVENTORY_ITEM_FAILURE,
  FETCH_STORE_INVENTORY_REQUEST,
  FETCH_STORE_INVENTORY_SUCCESS,
  FETCH_STORE_INVENTORY_FAILURE,
  ADD_INVENTORY_ITEM_REQUEST,
  ADD_INVENTORY_ITEM_SUCCESS,
  ADD_INVENTORY_ITEM_FAILURE,
  UPDATE_INVENTORY_ITEM_REQUEST,
  UPDATE_INVENTORY_ITEM_SUCCESS,
  UPDATE_INVENTORY_ITEM_FAILURE,
  DELETE_INVENTORY_ITEM_REQUEST,
  DELETE_INVENTORY_ITEM_SUCCESS,
  DELETE_INVENTORY_ITEM_FAILURE
} from './types';
import inventoryApi from '../../network/inventoryApi';

// Create a map to store abort controllers for each request type
const abortControllers = {
  fetchInventory: null,
  fetchInventoryItem: null,
  fetchStoreInventory: null,
  addInventoryItem: null,
  updateInventoryItem: null,
  deleteInventoryItem: null
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

// Fetch inventory for a specific store
export const fetchStoreInventory = (storeId) => async (dispatch) => {
  try {
    // Abort any previous fetchStoreInventory request
    const signal = abortPreviousRequest('fetchStoreInventory');
    
    dispatch({ type: FETCH_STORE_INVENTORY_REQUEST });
    
    const response = await inventoryApi.getByStoreId(storeId, signal);
    dispatch({
      type: FETCH_STORE_INVENTORY_SUCCESS,
      payload: response.data
    });
    return response.data;
  } catch (error) {
    // Don't dispatch failure for aborted requests
    if (error.name === 'AbortError') return;
    
    dispatch({
      type: FETCH_STORE_INVENTORY_FAILURE,
      payload: error.message
    });
    throw error;
  }
};

// Add a new inventory item
export const addInventoryItem = (inventoryData) => async (dispatch) => {
  try {
    // Abort any previous addInventoryItem request
    const signal = abortPreviousRequest('addInventoryItem');
    
    dispatch({ type: ADD_INVENTORY_ITEM_REQUEST });
    
    const response = await inventoryApi.create(inventoryData, signal);
    
    // After successful creation, refresh the store inventory if store_id is present
    if (inventoryData.store_id) {
      dispatch(fetchStoreInventory(inventoryData.store_id));
    }
    
    dispatch({
      type: ADD_INVENTORY_ITEM_SUCCESS,
      payload: response.data
    });
    return response.data;
  } catch (error) {
    // Don't dispatch failure for aborted requests
    if (error.name === 'AbortError') return;
    
    dispatch({
      type: ADD_INVENTORY_ITEM_FAILURE,
      payload: error.message
    });
    throw error;
  }
};

// Update an inventory item
export const updateInventoryItem = (id, inventoryData, storeId) => async (dispatch) => {
  try {
    // Abort any previous updateInventoryItem request
    const signal = abortPreviousRequest('updateInventoryItem');
    
    dispatch({ type: UPDATE_INVENTORY_ITEM_REQUEST });
    
    const response = await inventoryApi.update(id, inventoryData, signal, storeId);
    
    // After successful update, refresh the store inventory if storeId is present
    if (storeId) {
      dispatch(fetchStoreInventory(storeId));
    }
    
    dispatch({
      type: UPDATE_INVENTORY_ITEM_SUCCESS,
      payload: response.data
    });
    return response.data;
  } catch (error) {
    // Don't dispatch failure for aborted requests
    if (error.name === 'AbortError') return;
    
    dispatch({
      type: UPDATE_INVENTORY_ITEM_FAILURE,
      payload: error.message
    });
    throw error;
  }
};

// Delete an inventory item
export const deleteInventoryItem = (id, storeId) => async (dispatch) => {
  try {
    // Abort any previous deleteInventoryItem request
    const signal = abortPreviousRequest('deleteInventoryItem');
    
    dispatch({ type: DELETE_INVENTORY_ITEM_REQUEST });
    
    await inventoryApi.delete(id, signal, storeId);
    
    // After successful deletion, refresh the store inventory if storeId is present
    if (storeId) {
      dispatch(fetchStoreInventory(storeId));
    }
    
    dispatch({
      type: DELETE_INVENTORY_ITEM_SUCCESS,
      payload: id
    });
  } catch (error) {
    // Don't dispatch failure for aborted requests
    if (error.name === 'AbortError') return;
    
    dispatch({
      type: DELETE_INVENTORY_ITEM_FAILURE,
      payload: error.message
    });
    throw error;
  }
};