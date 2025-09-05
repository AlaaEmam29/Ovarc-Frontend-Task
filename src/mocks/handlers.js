// src/mocks/handlers.js
import { http, HttpResponse } from 'msw';

// Sample data for mocking
const books = [
  { id: '1', title: 'The Great Gatsby', author_id: '1', price: 12.99, pages: 180 },
  { id: '2', title: 'To Kill a Mockingbird', author_id: '2', price: 14.99, pages: 281 },
];

const authors = [
  { id: '1', name: 'F. Scott Fitzgerald' },
  { id: '2', name: 'Harper Lee' },
];

// Define handlers for API endpoints
export const handlers = [
  // Books endpoints
  http.get('/api/books', () => {
    return HttpResponse.json(books);
  }),
  
  http.get('/api/books/:id', ({ params }) => {
    const { id } = params;
    const book = books.find(book => book.id === id);
    
    if (!book) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(book);
  }),
  
  // Authors endpoints
  http.get('/api/authors', () => {
    return HttpResponse.json(authors);
  }),
  
  http.get('/api/authors/:id', ({ params }) => {
    const { id } = params;
    const author = authors.find(author => author.id === id);
    
    if (!author) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(author);
  }),
];