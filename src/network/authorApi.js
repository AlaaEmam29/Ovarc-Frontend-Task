// src/network/authorApi.js
import axiosInstance from './axiosConfig';

// Constants
const AUTHORS_ENDPOINT = '/authors';
const DATA_PATH = '/data/authors.json';

// Determine if we should use the mock API or direct JSON files
const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';

/**
 * Author API service
 */
const authorApi = {
  /**
   * Get all authors
   * @returns {Promise} Promise with authors data
   */
  getAll: () => {
    return axiosInstance.get(useMockApi ? AUTHORS_ENDPOINT : DATA_PATH);
  },

  /**
   * Get author by ID
   * @param {number} id - Author ID
   * @returns {Promise} Promise with author data
   */
  getById: (id) => {
    if (useMockApi) {
      return axiosInstance.get(`${AUTHORS_ENDPOINT}/${id}`);
    } else {
      // For direct JSON access, we need to get all authors and filter
      return axiosInstance.get(DATA_PATH)
        .then(response => {
          const authors = response.data;
          const author = Array.isArray(authors) ? authors.find(a => a.id === parseInt(id, 10)) : null;
          
          if (author) {
            return { data: author };
          }
          
          throw new Error('Author not found');
        });
    }
  },

  /**
   * Create a new author
   * @param {Object} authorData - Author data
   * @returns {Promise} Promise with created author data
   */
  create: (authorData) => {
    return axiosInstance.post(AUTHORS_ENDPOINT, authorData);
  },

  /**
   * Update an existing author
   * @param {number} id - Author ID
   * @param {Object} authorData - Updated author data
   * @returns {Promise} Promise with updated author data
   */
  update: (id, authorData) => {
    return axiosInstance.put(`${AUTHORS_ENDPOINT}/${id}`, authorData);
  },

  /**
   * Delete an author
   * @param {number} id - Author ID
   * @returns {Promise} Promise with deletion status
   */
  delete: (id) => {
    return axiosInstance.delete(`${AUTHORS_ENDPOINT}/${id}`);
  },

  /**
   * Search authors by query
   * @param {string} query - Search query
   * @returns {Promise} Promise with search results
   */
  search: (query) => {
    return axiosInstance.get(`${AUTHORS_ENDPOINT}/search`, {
      params: { q: query }
    });
  }
};

export default authorApi;