import apiClient from "./apiClient"; // Axios instance
import { Exercise } from "../types";

// Base URL: https://api.api-ninjas.com/v1/exercises

export const fitnessService = {
  // Fetch all exercises (optionally filtered by muscle, type, or difficulty)
  getExercises: async (filters?: {
    muscle?: string;
    type?: string;
    difficulty?: string;
  }): Promise<Exercise[]> => {
    try {
      const params: any = {};
      if (filters?.muscle) params.muscle = filters.muscle;
      if (filters?.type) params.type = filters.type;
      if (filters?.difficulty) params.difficulty = filters.difficulty;

      const response = await apiClient.get("/exercises", { params });
      return response.data || [];
    } catch (error) {
      console.error("Failed to fetch exercises:", error);
      return [];
    }
  },

  // Search exercises by name keyword
  searchExercises: async (keyword: string): Promise<Exercise[]> => {
    if (!keyword) return [];
    try {
      const response = await apiClient.get("/exercises", {
        params: { name: keyword },
      });
      return response.data || [];
    } catch (error) {
      console.error("Failed to search exercises:", error);
      return [];
    }
  },

  // Get exercise details by exact name
  getExerciseDetails: async (name: string): Promise<Exercise | null> => {
    try {
      const response = await apiClient.get("/exercises", {
        params: { name },
      });
      return response.data?.[0] || null;
    } catch (error) {
      console.error("Failed to fetch exercise details:", error);
      return null;
    }
  },

  // Filter exercises by muscle group
  getExercisesByMuscle: async (muscle: string): Promise<Exercise[]> => {
    try {
      const response = await apiClient.get("/exercises", {
        params: { muscle },
      });
      return response.data || [];
    } catch (error) {
      console.error("Failed to fetch exercises by muscle:", error);
      return [];
    }
  },

  // Filter exercises by difficulty
  getExercisesByDifficulty: async (difficulty: string): Promise<Exercise[]> => {
    try {
      const response = await apiClient.get("/exercises", {
        params: { difficulty },
      });
      return response.data || [];
    } catch (error) {
      console.error("Failed to fetch exercises by difficulty:", error);
      return [];
    }
  },
};
