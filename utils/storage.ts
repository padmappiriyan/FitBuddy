import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_STORAGE_KEY = "@FitBuddy_auth_token";
const USER_STORAGE_KEY = "@FitBuddy_user";

export const storageUtils = {
  // Auth token
  saveAuthToken: async (token: string): Promise<void> => {
    try {
      if (!token) {
        throw new Error(
          "Cannot save invalid token: token is empty or undefined"
        );
      }
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, token);
    } catch (error) {
      console.error("Failed to save auth token:", error);
      throw error;
    }
  },

  getAuthToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to get auth token:", error);
      return null;
    }
  },

  removeAuthToken: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to remove auth token:", error);
      throw error;
    }
  },

  // User data
  saveUser: async (user: any): Promise<void> => {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Failed to save user:", error);
      throw error;
    }
  },

  getUser: async (): Promise<any | null> => {
    try {
      const user = await AsyncStorage.getItem(USER_STORAGE_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Failed to get user:", error);
      return null;
    }
  },

  removeUser: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to remove user:", error);
      throw error;
    }
  },

  // Clear all auth data
  clearAuthData: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([AUTH_STORAGE_KEY, USER_STORAGE_KEY]);
    } catch (error) {
      console.error("Failed to clear auth data:", error);
      throw error;
    }
  },
};