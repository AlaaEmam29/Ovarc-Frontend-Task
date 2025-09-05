// src/store/reducers/inventoryReducer.js
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
} from '../actions/types';

const initialState = {
  inventory: [],
  storeInventory: [],
  currentItem: null,
  loading: false,
  error: null
};

const inventoryReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch all inventory items
    case FETCH_INVENTORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_INVENTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        inventory: action.payload,
        error: null
      };
    case FETCH_INVENTORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Fetch single inventory item
    case FETCH_INVENTORY_ITEM_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_INVENTORY_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        currentItem: action.payload,
        error: null
      };
    case FETCH_INVENTORY_ITEM_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Fetch store inventory
    case FETCH_STORE_INVENTORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_STORE_INVENTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        storeInventory: action.payload,
        error: null
      };
    case FETCH_STORE_INVENTORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Add inventory item
    case ADD_INVENTORY_ITEM_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case ADD_INVENTORY_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        inventory: [...state.inventory, action.payload],
        storeInventory: state.storeInventory.length > 0 ? 
          [...state.storeInventory, action.payload] : 
          state.storeInventory,
        error: null
      };
    case ADD_INVENTORY_ITEM_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Update inventory item
    case UPDATE_INVENTORY_ITEM_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case UPDATE_INVENTORY_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        inventory: state.inventory.map(item => 
          item.id === action.payload.id ? action.payload : item
        ),
        storeInventory: state.storeInventory.map(item => 
          item.id === action.payload.id ? action.payload : item
        ),
        currentItem: state.currentItem?.id === action.payload.id ? 
          action.payload : state.currentItem,
        error: null
      };
    case UPDATE_INVENTORY_ITEM_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Delete inventory item
    case DELETE_INVENTORY_ITEM_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case DELETE_INVENTORY_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        inventory: state.inventory.filter(item => item.id !== action.payload),
        storeInventory: state.storeInventory.filter(item => item.id !== action.payload),
        currentItem: state.currentItem?.id === action.payload ? null : state.currentItem,
        error: null
      };
    case DELETE_INVENTORY_ITEM_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default inventoryReducer;