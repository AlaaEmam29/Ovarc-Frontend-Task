// src/store/reducers/bookReducer.js
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
} from '../actions/types';

const initialState = {
  books: [],
  currentBook: null,
  loading: false,
  error: null,
  searchResults: []
};

const bookReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch all books
    case FETCH_BOOKS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_BOOKS_SUCCESS:
      return {
        ...state,
        loading: false,
        books: action.payload,
        error: null
      };
    case FETCH_BOOKS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Fetch single book
    case FETCH_BOOK_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_BOOK_SUCCESS:
      return {
        ...state,
        loading: false,
        currentBook: action.payload,
        error: null
      };
    case FETCH_BOOK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Add book
    case ADD_BOOK_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case ADD_BOOK_SUCCESS:
      return {
        ...state,
        loading: false,
        books: [...state.books, action.payload],
        error: null
      };
    case ADD_BOOK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Update book
    case UPDATE_BOOK_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case UPDATE_BOOK_SUCCESS:
      return {
        ...state,
        loading: false,
        books: state.books.map(book => 
          book.id === action.payload.id ? action.payload : book
        ),
        currentBook: action.payload,
        error: null
      };
    case UPDATE_BOOK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Delete book
    case DELETE_BOOK_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case DELETE_BOOK_SUCCESS:
      return {
        ...state,
        loading: false,
        books: state.books.filter(book => book.id !== action.payload),
        error: null
      };
    case DELETE_BOOK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Search books
    case SEARCH_BOOKS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case SEARCH_BOOKS_SUCCESS:
      return {
        ...state,
        loading: false,
        searchResults: action.payload,
        error: null
      };
    case SEARCH_BOOKS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default bookReducer;