// src/hooks/useInventory.js
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInventory,
  fetchInventoryItemById,
  fetchStoreInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from "../store/actions/inventoryActions";

const useInventory = () => {
  const dispatch = useDispatch();
  const { inventory, storeInventory, currentItem, loading, error } =
    useSelector((state) => state.inventory);

  // Fetch all inventory items
  const getInventory = useCallback(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  // Fetch an inventory item by ID
  const getInventoryItemById = useCallback(
    (id) => {
      dispatch(fetchInventoryItemById(id));
    },
    [dispatch]
  );

  // Fetch inventory for a specific store
  const getStoreInventory = useCallback(
    (storeId) => {
      return dispatch(fetchStoreInventory(storeId));
    },
    [dispatch]
  );

  // Add a new inventory item
  const addItem = useCallback(
    (inventoryData) => {
      return dispatch(addInventoryItem(inventoryData));
    },
    [dispatch]
  );

  // Update an inventory item
  const updateItem = useCallback(
    (id, inventoryData) => {
      return dispatch(updateInventoryItem(id, inventoryData));
    },
    [dispatch]
  );

  // Delete an inventory item
  const deleteItem = useCallback(
    (id, storeId) => {
      return dispatch(deleteInventoryItem(id, storeId));
    },
    [dispatch]
  );

  // Fetch inventory on component mount
  useEffect(() => {
    getInventory();
  }, [getInventory]);

  return {
    // State
    inventory,
    storeInventory,
    currentItem,
    loading,
    error,

    // Actions
    getInventory,
    getInventoryItemById,
    getStoreInventory,
    addItem,
    updateItem,
    deleteItem,
  };
};

export default useInventory;
