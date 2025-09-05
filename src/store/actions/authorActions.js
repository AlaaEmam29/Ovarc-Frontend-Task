// src/store/actions/authorActions.js
import {
  FETCH_AUTHORS_REQUEST,
  FETCH_AUTHORS_SUCCESS,
  FETCH_AUTHORS_FAILURE,
  FETCH_AUTHOR_REQUEST,
  FETCH_AUTHOR_SUCCESS,
  FETCH_AUTHOR_FAILURE
} from './types';
import authorApi from '../../network/authorApi';

// Create a map to store abort controllers for each request type
const abortControllers = {
  fetchAuthors: null,
  fetchAuthor: null
};

// Helper to abort previous requests of the same type
const abortPreviousRequest = (requestType) => {
  if (abortControllers[requestType]) {
    abortControllers[requestType].abort();
  }
  abortControllers[requestType] = new AbortController();
  return abortControllers[requestType].signal;
};

// Fetch all authors
export const fetchAuthors = () => async (dispatch) => {
  try {
    // Abort any previous fetchAuthors request
    const signal = abortPreviousRequest('fetchAuthors');
    
    dispatch({ type: FETCH_AUTHORS_REQUEST });
    
    const response = await authorApi.getAll(signal);
    dispatch({
      type: FETCH_AUTHORS_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    // Don't dispatch failure for aborted requests
    if (error.name === 'AbortError') return;
    
    dispatch({
      type: FETCH_AUTHORS_FAILURE,
      payload: error.message
    });
  }
};

// Fetch a single author by ID
export const fetchAuthorById = (id) => async (dispatch) => {
  try {
    // Abort any previous fetchAuthor request
    const signal = abortPreviousRequest('fetchAuthor');
    
    dispatch({ type: FETCH_AUTHOR_REQUEST });
    
    const response = await authorApi.getById(id, signal);
    dispatch({
      type: FETCH_AUTHOR_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    // Don't dispatch failure for aborted requests
    if (error.name === 'AbortError') return;
    
    dispatch({
      type: FETCH_AUTHOR_FAILURE,
      payload: error.message
    });
  }
};