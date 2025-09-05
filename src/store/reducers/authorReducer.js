// src/store/reducers/authorReducer.js
import {
  FETCH_AUTHORS_REQUEST,
  FETCH_AUTHORS_SUCCESS,
  FETCH_AUTHORS_FAILURE,
  FETCH_AUTHOR_REQUEST,
  FETCH_AUTHOR_SUCCESS,
  FETCH_AUTHOR_FAILURE
} from '../actions/types';

const initialState = {
  authors: [],
  currentAuthor: null,
  loading: false,
  error: null
};

const authorReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch all authors
    case FETCH_AUTHORS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_AUTHORS_SUCCESS:
      return {
        ...state,
        loading: false,
        authors: action.payload,
        error: null
      };
    case FETCH_AUTHORS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Fetch single author
    case FETCH_AUTHOR_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_AUTHOR_SUCCESS:
      return {
        ...state,
        loading: false,
        currentAuthor: action.payload,
        error: null
      };
    case FETCH_AUTHOR_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default authorReducer;