import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fitnessService } from "../../services/fitnessService"; 
import { ExercisesState, Exercise } from "../../types";

const initialState: ExercisesState = {
  exercises: [],
  isLoading: false,
  error: null,
};

// Fetch exercises from Fitness API Ninjas
export const fetchExercises = createAsyncThunk(
  "exercises/fetchExercises",
  async (_, { rejectWithValue }) => {
    try {
      const exercises = await fitnessService.getExercises();
      return exercises;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch exercises");
    }
  }
);

// Search exercises by name
export const searchExercises = createAsyncThunk(
  "exercises/searchExercises",
  async (query: string, { rejectWithValue }) => {
    try {
      const exercises = await fitnessService.searchExercises(query);
      return exercises;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to search exercises");
    }
  }
);

const exercisesSlice = createSlice({
  name: "exercises",
  initialState,
  reducers: {
    clearExercises: (state) => {
      state.exercises = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch exercises
      .addCase(fetchExercises.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExercises.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exercises = action.payload;
      })
      .addCase(fetchExercises.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Search exercises
      .addCase(searchExercises.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchExercises.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exercises = action.payload;
      })
      .addCase(searchExercises.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearExercises } = exercisesSlice.actions;
export default exercisesSlice.reducer;
