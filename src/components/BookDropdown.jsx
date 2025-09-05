// src/components/BookDropdown.jsx
import React, { useState, useEffect, useRef } from 'react';

const BookDropdown = ({ 
  books, 
  selectedBookId, 
  onBookSelect, 
  excludeBookIds = [],
  maxInitialItems = 7 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter available books (exclude already added books)
  const availableBooks = books.filter(book => !excludeBookIds.includes(book.id));

  // Filter books based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      // Show only first 7 books when no search term
      setFilteredBooks(availableBooks.slice(0, maxInitialItems));
    } else {
      // Filter by book name containing search term (case insensitive)
      const filtered = availableBooks.filter(book =>
        book.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  }, [searchTerm, availableBooks, maxInitialItems]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleBookSelect = (book) => {
    onBookSelect(book.id);
    setIsOpen(false);
    setSearchTerm('');
  };

  const selectedBook = books.find(book => book.id === parseInt(selectedBookId));

  return (
    <div className="relative" ref={dropdownRef}>
      <label htmlFor="book_select" className="block text-gray-700 font-medium mb-1">
        Select Book
      </label>
      
      {/* Dropdown trigger */}
      <div
        className="border border-gray-300 rounded p-2 w-full cursor-pointer bg-white flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedBook ? 'text-gray-900' : 'text-gray-500'}>
          {selectedBook ? selectedBook.name : '-- Select a book --'}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Book list */}
          <div className="max-h-40 overflow-y-auto">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                  onClick={() => handleBookSelect(book)}
                >
                  <div className="font-medium text-gray-900">{book.name}</div>
                  <div className="text-xs text-gray-500">
                    Pages: {book.page_count} | Format: {book.format}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-500 text-sm text-center">
                {searchTerm ? 'No books found matching your search' : 'No books available'}
              </div>
            )}
          </div>

          {/* Show more indicator */}
          {searchTerm === '' && availableBooks.length > maxInitialItems && (
            <div className="p-2 bg-gray-50 text-xs text-gray-600 text-center border-t border-gray-200">
              Showing {Math.min(maxInitialItems, availableBooks.length)} of {availableBooks.length} books. 
              Use search to find more.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookDropdown;

