// src/network/bookApi.js
import axiosInstance from './axiosConfig';

// Constants
const BOOKS_ENDPOINT = '/books';
const DATA_PATH = '/data/books.json';

// Determine if we should use the mock API or direct JSON files
const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';

/**
 * Book API service
 */
const bookApi = {
  /**
   * Get all books
   * @returns {Promise} Promise with books data
   */
  getAll: () => {
    return axiosInstance.get(useMockApi ? BOOKS_ENDPOINT : DATA_PATH);
  },

  /**
   * Get book by ID
   * @param {number} id - Book ID
   * @returns {Promise} Promise with book data
   */
  getById: (id) => {
    if (useMockApi) {
      return axiosInstance.get(`${BOOKS_ENDPOINT}/${id}`);
    } else {
      // For direct JSON access, we need to get all books and filter
      return axiosInstance.get(DATA_PATH)
        .then(response => {
          const books = response.data;
          const book = Array.isArray(books) ? books.find(b => b.id === parseInt(id, 10)) : null;
          
          if (book) {
            return { data: book };
          }
          
          throw new Error('Book not found');
        });
    }
  },

  /**
   * Create a new book
   * @param {Object} bookData - Book data
   * @returns {Promise} Promise with created book data
   */
  create: (bookData) => {
    return axiosInstance.post(BOOKS_ENDPOINT, bookData);
  },

  /**
   * Update an existing book
   * @param {number} id - Book ID
   * @param {Object} bookData - Updated book data
   * @returns {Promise} Promise with updated book data
   */
  update: (id, bookData) => {
    return axiosInstance.put(`${BOOKS_ENDPOINT}/${id}`, bookData);
  },

  /**
   * Delete a book
   * @param {number} id - Book ID
   * @returns {Promise} Promise with deletion status
   */
  delete: (id) => {
    return axiosInstance.delete(`${BOOKS_ENDPOINT}/${id}`);
  },

  /**
   * Search books by query
   * @param {string} query - Search query
   * @returns {Promise} Promise with search results
   */
  search: (query) => {
    return axiosInstance.get(`${BOOKS_ENDPOINT}/search`, {
      params: { q: query }
    });
  }
};

export default bookApi;