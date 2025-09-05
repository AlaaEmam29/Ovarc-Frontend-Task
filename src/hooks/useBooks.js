// src/hooks/useBooks.js
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBooks,
  fetchBookById,
  addBook,
  updateBook,
  deleteBook,
  searchBooks
} from '../store/actions/bookActions';

const useBooks = () => {
  const dispatch = useDispatch();
  const { books, currentBook, loading, error, searchResults } = useSelector(state => state.books);

  // Fetch all books
  const getBooks = useCallback(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  // Fetch a book by ID
  const getBookById = useCallback((id) => {
    dispatch(fetchBookById(id));
  }, [dispatch]);

  // Add a new book
  const createBook = useCallback(async (bookData) => {
    try {
      return await dispatch(addBook(bookData));
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  }, [dispatch]);

  // Update an existing book
  const updateBookById = useCallback(async (id, bookData) => {
    try {
      return await dispatch(updateBook(id, bookData));
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  }, [dispatch]);

  // Delete a book
  const removeBook = useCallback(async (id) => {
    try {
      await dispatch(deleteBook(id));
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  }, [dispatch]);

  // Search books
  const search = useCallback((query) => {
    dispatch(searchBooks(query));
  }, [dispatch]);

  // Fetch books on component mount
  useEffect(() => {
    getBooks();
  }, [getBooks]);

  return {
    // State
    books,
    currentBook,
    loading,
    error,
    searchResults,
    
    // Actions
    getBooks,
    getBookById,
    createBook,
    updateBookById,
    removeBook,
    search
  };
};

export default useBooks;