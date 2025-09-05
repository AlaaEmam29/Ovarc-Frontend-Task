import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "./reducers/bookReducer";
import authorReducer from "./reducers/authorReducer";
import storeReducer from "./reducers/storeReducer";
import inventoryReducer from "./reducers/inventoryReducer";

const store = configureStore({
  reducer: {
    books: bookReducer,
    authors: authorReducer,
    stores: storeReducer,
    inventory: inventoryReducer,
  },
  devTools: import.meta.env.MODE !== "production",
});

export default store;
