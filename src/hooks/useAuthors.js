// src/hooks/useAuthors.js
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAuthors,
  fetchAuthorById
} from '../store/actions/authorActions';

const useAuthors = () => {
  const dispatch = useDispatch();
  const { authors, currentAuthor, loading, error } = useSelector(state => state.authors);

  // Fetch all authors
  const getAuthors = useCallback(() => {
    dispatch(fetchAuthors());
  }, [dispatch]);

  // Fetch an author by ID
  const getAuthorById = useCallback((id) => {
    dispatch(fetchAuthorById(id));
  }, [dispatch]);

  // Fetch authors on component mount
  useEffect(() => {
    getAuthors();
  }, [getAuthors]);

  // Create a map of authors with formatted names
  const authorMap = {};
  authors.forEach(author => {
    authorMap[author.id] = { 
      ...author, 
      name: `${author.first_name} ${author.last_name}` 
    };
  });

  return {
    // State
    authors,
    currentAuthor,
    loading,
    error,
    authorMap,
    
    // Actions
    getAuthors,
    getAuthorById
  };
};

export default useAuthors;