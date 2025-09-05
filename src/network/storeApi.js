// src/network/storeApi.js
import axiosInstance from './axiosConfig';

// Constants
const STORES_ENDPOINT = '/stores';
const DATA_PATH = '/data/stores.json';

// Determine if we should use the mock API or direct JSON files
const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';

/**
 * Store API service
 */
const storeApi = {
  /**
   * Get all stores
   * @returns {Promise} Promise with stores data
   */
  getAll: () => {
    return axiosInstance.get(useMockApi ? STORES_ENDPOINT : DATA_PATH);
  },

  /**
   * Get store by ID
   * @param {number} id - Store ID
   * @returns {Promise} Promise with store data
   */
  getById: (id) => {
    if (useMockApi) {
      return axiosInstance.get(`${STORES_ENDPOINT}/${id}`);
    } else {
      // For direct JSON access, we need to get all stores and filter
      return axiosInstance.get(DATA_PATH)
        .then(response => {
          const stores = response.data;
          const store = Array.isArray(stores) ? stores.find(s => s.id === parseInt(id, 10)) : null;
          
          if (store) {
            return { data: store };
          }
          
          throw new Error('Store not found');
        });
    }
  },

  /**
   * Create a new store
   * @param {Object} storeData - Store data
   * @returns {Promise} Promise with created store data
   */
  create: (storeData) => {
    return axiosInstance.post(STORES_ENDPOINT, storeData);
  },

  /**
   * Update an existing store
   * @param {number} id - Store ID
   * @param {Object} storeData - Updated store data
   * @returns {Promise} Promise with updated store data
   */
  update: (id, storeData) => {
    return axiosInstance.put(`${STORES_ENDPOINT}/${id}`, storeData);
  },

  /**
   * Delete a store
   * @param {number} id - Store ID
   * @returns {Promise} Promise with deletion status
   */
  delete: (id) => {
    return axiosInstance.delete(`${STORES_ENDPOINT}/${id}`);
  },

  /**
   * Search stores by query
   * @param {string} query - Search query
   * @returns {Promise} Promise with search results
   */
  search: (query) => {
    return axiosInstance.get(`${STORES_ENDPOINT}/search`, {
      params: { q: query }
    });
  }
};

export default storeApi;