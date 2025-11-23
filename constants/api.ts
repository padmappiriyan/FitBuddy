// ===============================
// API NINJAS FITNESS API (PUBLIC)
// ===============================

// Base URL for the API Ninjas Exercise API
export const API_BASE_URL = "https://api.api-ninjas.com/v1";


// Endpoints for the API
export const API_ENDPOINTS = {
  EXERCISES: "/exercises", // Example: /exercises?muscle=chest
};


const API_KEY = process.env.EXPO_PUBLIC_API_NINJA_KEY;
console.log("API Key:", API_KEY);

/**
 * Fetch exercises from API Ninjas
 * @param params Optional filters (muscle, type, difficulty, name)
 * @returns Exercise[] array
 */
export const getExercises = async (params?: {
  muscle?: string;
  type?: string;
  difficulty?: string;
  name?: string;
}) => {

  try {
    let query = "";

    if (params) {
      const q = new URLSearchParams(params as any).toString();
      query = "?" + q;
    }

    const url = API_BASE_URL + API_ENDPOINTS.EXERCISES + query;
    console.log("Fetching URL:", url);
    const response = await fetch(url, {
      headers: {
        "X-Api-Key": API_KEY!,
      },
    });

    if (!response.ok) {
      console.error("API Error:", response.status);
      throw new Error("Failed to fetch exercises");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching exercises:", error);
    throw error;
  }
};

/**
 * Fetch exercises by muscle group
 * Example: getExercisesByMuscle("chest")
 */
export const getExercisesByMuscle = (muscle: string) => {
  return getExercises({ muscle });
};

/**
 * Fetch exercises by difficulty
 * Example: getExercisesByDifficulty("beginner")
 */
export const getExercisesByDifficulty = (difficulty: string) => {
  return getExercises({ difficulty });
};

/**
 * Fetch exercise by name
 * Example: searchExercise("push up")
 */
export const searchExercise = (name: string) => {
  return getExercises({ name });
};

// Dummy Auth API (using DummyJSON)
export const AUTH_API_BASE = "https://dummyjson.com";
