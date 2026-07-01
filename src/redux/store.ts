// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { baseApi } from "./api/baseApi";
import aiChatReducer from "./features/aiChatSlice";
// Reducers
import authReducer from "./features/auth";
import compareReduce from "../redux/features/compareSlice";

// Create a storage that works on both client and server
const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

// Persist config for auth
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "accessToken", "refreshToken", "isLoading"],
};

// Persist config for AI chat (optional - to persist chat history)
const aiChatPersistConfig = {
  key: "aiChat",
  storage,
  whitelist: ["threadId", "messages", "currentSuggestions"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedAiChatReducer = persistReducer(
  aiChatPersistConfig,
  aiChatReducer,
);

export const store = configureStore({
  reducer: {
    // Persisted reducers
    auth: persistedAuthReducer,
    aiChat: persistedAiChatReducer,
    // propertyEdit: propertyEditReducer,

    // API reducers
    [baseApi.reducerPath]: baseApi.reducer,
    compare: compareReduce,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types from redux-persist
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
        ],
        // Ignore these paths in the state
        ignoredPaths: ["aiChat.messages.timestamp"],
      },
    })
      .concat(baseApi.middleware)
});

export const persistor = persistStore(store);

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export a typed version of useDispatch and useSelector for convenience
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
