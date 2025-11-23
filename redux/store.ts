import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import favoritesReducer from "./slices/favoriteSlice";
import exercisesReducer from "./slices/exercisesSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoritesReducer,
     exercises: exercisesReducer,
    },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: ["favorites/loadFavorites/fulfilled"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;