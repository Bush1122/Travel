import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage
import authReducer from "./auth-slice";
import postReducer from "./post-slice";
import deleteReducer from "./delete-slice";
import updateReducer from "./update-slice";

// Persist configuration (only for 'auth')
const persistConfig = {
  key: "auth", // Key for the persisted state
  storage, // Storage engine (localStorage)
  whitelist: ["isAuthenticated", "user"], // Only persist these fields from auth
};

// Wrap the auth reducer with persistReducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// Create the store
const store = configureStore({
  reducer: {
    auth: persistedAuthReducer, // Persisted auth
    posts: postReducer,
    delete: deleteReducer,
    update: updateReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Create the persistor
export const persistor = persistStore(store);

export default store;
