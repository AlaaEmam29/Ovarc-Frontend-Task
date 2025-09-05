// src/mocks/handlers.js
import { http, HttpResponse } from "msw";

import authors from "./data/books.json";
import books from "./data/books.json";
import inventory from "./data/inventory.json";
import stores from "./data/stores.json";

// Define handlers for API endpoints
export const handlers = [
  // Books endpoints
  http.get("/api/books", () => {
    return HttpResponse.json(books);
  }),

  http.get("/api/books/:id", ({ params }) => {
    const { id } = params;
    const book = books.find((book) => book.id === id);

    if (!book) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(book);
  }),
  http.get("/api/inventory", () => HttpResponse.json(inventory)),
  http.get("/api/stores", () => HttpResponse.json(stores)),
  http.get("/api/inventory/:id", ({ params }) => {
    const { id } = params;
    const item = inventory.find((i) => i.id === id);

    if (!item) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(item);
  }),
  http.get("/api/stores/:id", ({ params }) => {
    const { id } = params;
    const stores = stores.find((stores) => stores.id === id);

    if (!stores) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(stores);
  }),
  // Authors endpoints
  http.get("/api/authors", () => {
    return HttpResponse.json(authors);
  }),

  http.get("/api/authors/:id", ({ params }) => {
    const { id } = params;
    const author = authors.find((author) => author.id === id);

    if (!author) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(author);
  }),
];
