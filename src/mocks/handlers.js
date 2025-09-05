// src/mocks/handlers.js
import { http, HttpResponse } from "msw";

import authors from "./data/authors.json";
import books from "./data/books.json";
import inventory from "./data/inventory.json";
import stores from "./data/stores.json";
import users from "./data/users.json";

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
  
  http.put("/api/inventory/:id", async ({ params, request }) => {
    const { id } = params;
    const updatedItem = await request.json();
    
    // In a real app, we would update the database
    return HttpResponse.json({ ...updatedItem, id: parseInt(id) });
  }),
  
  http.delete("/api/inventory/:id", ({ params }) => {
    // In a real app, we would delete from the database
    return new HttpResponse(null, { status: 204 });
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

  // Authentication endpoints
  http.post("/api/auth/login", async ({ request }) => {
    const { email, password } = await request.json();
    
    // Find user by email and password
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return HttpResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }
    
    // Return user data without password and with token
    const { password: _, ...userWithoutPassword } = user;
    return HttpResponse.json({
      user: userWithoutPassword,
      token: `mock-jwt-token-${user.id}-${Date.now()}`
    });
  }),

  http.post("/api/auth/logout", () => {
    return HttpResponse.json({ message: "Logged out successfully" });
  }),

  // Get current user (for token validation)
  http.get("/api/auth/me", ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    
    // Simple token validation (extract user ID from mock token)
    const tokenMatch = token.match(/mock-jwt-token-(\d+)-/);
    if (!tokenMatch) {
      return HttpResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }
    
    const userId = parseInt(tokenMatch[1]);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return HttpResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    
    const { password: _, ...userWithoutPassword } = user;
    return HttpResponse.json({ user: userWithoutPassword });
  }),
];
