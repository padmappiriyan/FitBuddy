// User types
export interface User {
  id: string;
  username: string;
  email: string;
  
}
// Exercise type returned by API Ninjas
export interface Exercise {
 
  name: string;          // Exercise name, e.g. "Push-Up"
  type: string;          // Type of exercise, e.g. "strength", "cardio"
  muscle: string;        // Main muscle, e.g. "chest", "legs"
  equipment: string;     // Equipment used, e.g. "body_only", "dumbbell"
  difficulty: string;    // Difficulty, e.g. "beginner", "intermediate", "expert"
  instructions: string;  // Step-by-step instructions
}

// Exercises state for Redux or global state
export interface ExercisesState {
  exercises: Exercise[];  // List of exercises
  isLoading: boolean;     // Loading state
  error: string | null;   // Error message
}

// Favorites state for exercises
export interface FavoritesState {
  favoriteExercises: Exercise[];  // User's favorite exercises
  isLoading: boolean;             // Loading state
}


// Auth types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
}