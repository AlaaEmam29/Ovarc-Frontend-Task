// src/store/actions/bookActions.js
import {
  FETCH_BOOKS_REQUEST,
  FETCH_BOOKS_SUCCESS,
  FETCH_BOOKS_FAILURE,
  FETCH_BOOK_REQUEST,
  FETCH_BOOK_SUCCESS,
  FETCH_BOOK_FAILURE,
  ADD_BOOK_REQUEST,
  ADD_BOOK_SUCCESS,
  ADD_BOOK_FAILURE,
  UPDATE_BOOK_REQUEST,
  UPDATE_BOOK_SUCCESS,
  UPDATE_BOOK_FAILURE,
  DELETE_BOOK_REQUEST,
  DELETE_BOOK_SUCCESS,
  DELETE_BOOK_FAILURE,
  SEARCH_BOOKS_REQUEST,
  SEARCH_BOOKS_SUCCESS,
  SEARCH_BOOKS_FAILURE
} from './types';
import bookApi from '../../network/bookApi';

// Create a map to store abort controllers for each request type
const abortControllers = {
  fetchBooks: null,
  fetchBook: null,
  addBook: null,
  updateBook: null,
  deleteBook: null,
  searchBooks: null
};

// Helper to abort previous requests of the same type
const abortPreviousRequest = (requestType) => {
  if (abortControllers[requestType]) {
    abortControllers[requestType].abort();
  }
  abortControllers[requestType] = new AbortController();
  return abortControllers[requestType].signal;
};

// Fetch all books
export const fetchBooks = () => async (dispatch) => {
  try {
    // Abort any previous fetchBooks request
    const signal = abortPreviousRequest('fetchBooks');
    
    dispatch({ type: FETCH_BOOKS_REQUEST });
    
    const response = await bookApi.getAll(signal);
    dispatch({
      type: FETCH_BOOKS_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    // Don't dispatch failure for aborted requests
    if (error.name === 'AbortError') return;
    
    dispatch({
      type: FETCH_BOOKS_FAILURE,
      payload: error.message
    });
  }
};

// Fetch a single book by ID
export const fetchBookById = (id) => async (dispatch) => {
  try {
    // Abort any previous fetchBook request
    const signal = abortPreviousRequest('fetchBook');
    
    dispatch({ type: FETCH_BOOK_REQUEST });
    
    const response = await bookApi.getById(id, signal);
    dispatch({
      type: FETCH_BOOK_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    // Don't dispatch failure for aborted requests
    if (error.name === 'AbortError') return;
    
    dispatch({
      type: FETCH_BOOK_FAILURE,
      payload: error.message
    });
  }
};

// Add a new book
export const addBook = (bookData) => async (dispatch) => {
  try {
    // Abort any previous addBook request
    const signal = abortPreviousRequest('addBook');
    
    dispatch({ type: ADD_BOOK_REQUEST });
    
    const response = await bookApi.create(bookData, signal);
    dispatch({
      type: ADD_BOOK_SUCCESS,
      payload: response.data
    });
    return response.data;
  } catch (error) {
    // Don't dispatch failure for aborted requests
    if (error.name === 'AbortError') return;
    
    dispatch({
      type: ADD_BOOK_FAILURE,
      payload: error.message
    });
    throw error;
  }
};

// Update an existing book
export const updateBook = (id, bookData) => async (dispatch) => {
  try {
    // Abort any previous updateBook request
    const signal = abortPreviousRequest('updateBook');
    
    dispatch({ type: UPDATE_BOOK_REQUEST });
    
    const response = await bookApi.update(id, bookData, signal);
    dispatch({
      type: UPDATE_BOOK_SUCCESS,
      payload: response.data
    });
    return response.data;
  } catch (error) {
    // Don't dispatch failure for aborted requests
    if (error.name === 'AbortError') return;
    
    dispatch({
      type: UPDATE_BOOK_FAILURE,
      payload: error.message
    });
    throw error;
  }
};

// Delete a book
export const deleteBook = (id) => async (dispatch) => {
  try {
    // Abort any previous deleteBook request
    const signal = abortPreviousRequest('deleteBook');
    
    dispatch({ type: DELETE_BOOK_REQUEST });
    
    await bookApi.delete(id, signal);
    dispatch({
      type: DELETE_BOOK_SUCCESS,
      payload: id
    });
  } catch (error) {
    // Don't dispatch failure for aborted requests
    if (error.name === 'AbortError') return;
    
    dispatch({
      type: DELETE_BOOK_FAILURE,
      payload: error.message
    });
    throw error;
  }
};

// Search books
export const searchBooks = (query) => async (dispatch) => {
  try {
    // Abort any previous searchBooks request
    const signal = abortPreviousRequest('searchBooks');
    
    dispatch({ type: SEARCH_BOOKS_REQUEST });
    
    const response = await bookApi.search(query, signal);
    dispatch({
      type: SEARCH_BOOKS_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    // Don't dispatch failure for aborted requests
    if (error.name === 'AbortError') return;
    
    dispatch({
      type: SEARCH_BOOKS_FAILURE,
      payload: error.message
    });
  }
};