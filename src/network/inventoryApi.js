// src/network/inventoryApi.js
import axiosInstance from './axiosConfig';

// Constants
const INVENTORY_ENDPOINT = '/inventory';
const STORES_ENDPOINT = '/stores';
const DATA_PATH = '/data/inventory.json';

// Determine if we should use the mock API or direct JSON files
const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';

/**
 * Inventory API service
 */
const inventoryApi = {
  /**
   * Get all inventory items
   * @returns {Promise} Promise with inventory data
   */
  getAll: () => {
    return axiosInstance.get(useMockApi ? INVENTORY_ENDPOINT : DATA_PATH);
  },

  /**
   * Get inventory item by ID
   * @param {number} id - Inventory item ID
   * @returns {Promise} Promise with inventory item data
   */
  getById: (id) => {
    if (useMockApi) {
      return axiosInstance.get(`${INVENTORY_ENDPOINT}/${id}`);
    } else {
      // For direct JSON access, we need to get all inventory items and filter
      return axiosInstance.get(DATA_PATH)
        .then(response => {
          const inventory = response.data;
          const item = Array.isArray(inventory) ? inventory.find(i => i.id === parseInt(id, 10)) : null;
          
          if (item) {
            return { data: item };
          }
          
          throw new Error('Inventory item not found');
        });
    }
  },

  /**
   * Get inventory items for a specific store
   * @param {number} storeId - Store ID
   * @returns {Promise} Promise with store inventory data
   */
  getByStoreId: (storeId) => {
    if (useMockApi) {
      return axiosInstance.get(`${STORES_ENDPOINT}/${storeId}/inventory`);
    } else {
      // For direct JSON access, we need to get all inventory items and filter by store ID
      return axiosInstance.get(DATA_PATH)
        .then(response => {
          const inventory = response.data;
          const storeInventory = Array.isArray(inventory) 
            ? inventory.filter(item => item.store_id === parseInt(storeId, 10))
            : [];
          
          return { data: storeInventory };
        });
    }
  },

  /**
   * Create a new inventory item
   * @param {Object} inventoryData - Inventory item data
   * @returns {Promise} Promise with created inventory item data
   */
  create: (inventoryData) => {
    return axiosInstance.post(INVENTORY_ENDPOINT, inventoryData);
  },

  /**
   * Update an existing inventory item
   * @param {number} id - Inventory item ID
   * @param {Object} inventoryData - Updated inventory item data
   * @returns {Promise} Promise with updated inventory item data
   */
  update: (id, inventoryData) => {
    return axiosInstance.put(`${INVENTORY_ENDPOINT}/${id}`, inventoryData);
  },

  /**
   * Delete an inventory item
   * @param {number} id - Inventory item ID
   * @returns {Promise} Promise with deletion status
   */
  delete: (id) => {
    return axiosInstance.delete(`${INVENTORY_ENDPOINT}/${id}`);
  }
};

export default inventoryApi;