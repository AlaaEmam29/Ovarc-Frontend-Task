// src/mocks/handlers.js
import { http, HttpResponse } from "msw";

import authors from "./data/authors.json";
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
  
  http.post("/api/inventory", async ({ request }) => {
    const newItem = await request.json();
    
    // In a real app, we would save this to the database
    // For mock purposes, we'll just return the item with an ID
    return HttpResponse.json({ ...newItem, id: Date.now() }, { status: 201 });
  }),
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
    const store = stores.find((store) => store.id === parseInt(id));

    if (!store) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(store);
  }),
  
  // Store inventory endpoints
  http.get("/api/stores/:storeId/inventory", ({ params }) => {
    const { storeId } = params;
    const storeInventory = inventory.filter((item) => item.store_id === parseInt(storeId));
    return HttpResponse.json(storeInventory);
  }),
  
  http.post("/api/stores/:storeId/inventory", async ({ params, request }) => {
    const { storeId } = params;
    const newItem = await request.json();
    
    // In a real app, we would save this to the database
    // For mock purposes, we'll just return the item with an ID
    return HttpResponse.json({ ...newItem, id: Date.now(), store_id: parseInt(storeId) }, { status: 201 });
  }),
  
  http.put("/api/stores/:storeId/inventory/:id", async ({ params, request }) => {
    const { storeId, id } = params;
    const updatedItem = await request.json();
    
    // In a real app, we would update the database
    return HttpResponse.json({ ...updatedItem, id: parseInt(id), store_id: parseInt(storeId) });
  }),
  
  http.delete("/api/stores/:storeId/inventory/:id", ({ params }) => {
    // In a real app, we would delete from the database
    return new HttpResponse(null, { status: 204 });
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
