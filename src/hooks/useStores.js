// src/hooks/useStores.js
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchStores,
  fetchStoreById
} from '../store/actions/storeActions';

const useStores = () => {
  const dispatch = useDispatch();
  const { stores, currentStore, loading, error } = useSelector(state => state.stores);

  // Fetch all stores
  const getStores = useCallback(() => {
    dispatch(fetchStores());
  }, [dispatch]);

  // Fetch a store by ID
  const getStoreById = useCallback((id) => {
    dispatch(fetchStoreById(id));
  }, [dispatch]);

  // Fetch stores on component mount
  useEffect(() => {
    getStores();
  }, [getStores]);

  // Create a map of stores
  const storeMap = {};
  stores.forEach(store => {
    storeMap[store.id] = store;
  });

  return {
    // State
    stores,
    currentStore,
    loading,
    error,
    storeMap,
    
    // Actions
    getStores,
    getStoreById
  };
};

export default useStores;