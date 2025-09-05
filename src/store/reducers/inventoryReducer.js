// src/store/reducers/inventoryReducer.js
import {
  FETCH_INVENTORY_REQUEST,
  FETCH_INVENTORY_SUCCESS,
  FETCH_INVENTORY_FAILURE,
  FETCH_INVENTORY_ITEM_REQUEST,
  FETCH_INVENTORY_ITEM_SUCCESS,
  FETCH_INVENTORY_ITEM_FAILURE
} from '../actions/types';

const initialState = {
  inventory: [],
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

    default:
      return state;
  }
};

export default inventoryReducer;