import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Exercise, FavoritesState } from "../../types";

const FAVORITES_EXERCISES_KEY = "@fitness_favorite_exercises";

const initialState: FavoritesState = {
  favoriteExercises: [],
  isLoading: false,
};

// Load favorites from AsyncStorage
export const loadFavorites = createAsyncThunk(
  "favorites/loadFavorites",
  async () => {
    try {
      const exercisesData = await AsyncStorage.getItem(FAVORITES_EXERCISES_KEY);
      return {
        exercises: exercisesData ? JSON.parse(exercisesData) : [],
      };
    } catch (error) {
      console.error("Failed to load favorites:", error);
      return { exercises: [] };
    }
  }
);

// Add exercise to favorites
export const addFavoriteExercise = createAsyncThunk(
  "favorites/addFavoriteExercise",
  async (exercise: Exercise, { getState }) => {
    try {
      const state = getState() as { favorites: FavoritesState };
      const updatedExercises = [...state.favorites.favoriteExercises, exercise];
      await AsyncStorage.setItem(
        FAVORITES_EXERCISES_KEY,
        JSON.stringify(updatedExercises)
      );
      return exercise;
    } catch (error) {
      console.error("Failed to add favorite exercise:", error);
      throw error;
    }
  }
);

// Remove exercise from favorites
export const removeFavoriteExercise = createAsyncThunk(
  "favorites/removeFavoriteExercise",
  async (exerciseName: string, { getState }) => {
    try {
      const state = getState() as { favorites: FavoritesState };
      const updatedExercises = state.favorites.favoriteExercises.filter(
        (exercise) => exercise.name !== exerciseName
      );
      await AsyncStorage.setItem(
        FAVORITES_EXERCISES_KEY,
        JSON.stringify(updatedExercises)
      );
      return exerciseName;
    } catch (error) {
      console.error("Failed to remove favorite exercise:", error);
      throw error;
    }
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.favoriteExercises = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Load favorites
      .addCase(loadFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favoriteExercises = action.payload.exercises;
      })
      .addCase(loadFavorites.rejected, (state) => {
        state.isLoading = false;
      })

      // Add favorite exercise
      .addCase(addFavoriteExercise.fulfilled, (state, action) => {
        // Avoid duplicates
        const exists = state.favoriteExercises.some(
          (ex) => ex.name === action.payload.name
        );
        if (!exists) state.favoriteExercises.push(action.payload);
      })

      // Remove favorite exercise
      .addCase(removeFavoriteExercise.fulfilled, (state, action) => {
        state.favoriteExercises = state.favoriteExercises.filter(
          (exercise) => exercise.name !== action.payload
        );
      });
  },
});

export const { clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
