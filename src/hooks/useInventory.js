// src/hooks/useInventory.js
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchInventory,
  fetchInventoryItemById
} from '../store/actions/inventoryActions';

const useInventory = () => {
  const dispatch = useDispatch();
  const { inventory, currentItem, loading, error } = useSelector(state => state.inventory);

  // Fetch all inventory items
  const getInventory = useCallback(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  // Fetch an inventory item by ID
  const getInventoryItemById = useCallback((id) => {
    dispatch(fetchInventoryItemById(id));
  }, [dispatch]);

  // Fetch inventory on component mount
  useEffect(() => {
    getInventory();
  }, [getInventory]);

  return {
    // State
    inventory,
    currentItem,
    loading,
    error,
    
    // Actions
    getInventory,
    getInventoryItemById
  };
};

export default useInventory;