import axios from "axios";
import { AUTH_API_BASE } from "../constants/api";
import { User } from "../types/index";
import { storageUtils } from "../utils/storage";

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
username: string;
email: string;
password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

// Using DummyJSON for authentication simulation
export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // DummyJSON login endpoint
      const response = await axios.post(`${AUTH_API_BASE}/auth/login`, {
        username: credentials.username,
        password: credentials.password,
        expiresInMins: 60,
      });

      // DummyJSON returns 'accessToken' not 'token'
      const { accessToken, id, username, email, firstName, lastName } =
        response.data;

      // Validate that we received a token
      if (!accessToken) {
        console.error("Login response data:", response.data);
        throw new Error("No authentication token received from server");
      }

      const user: User = {
        id: id.toString(),
        username: username || credentials.username,
        email: email || "",
       
      };

      // Store token and user
      await storageUtils.saveAuthToken(accessToken);
      await storageUtils.saveUser(user);

      return { user, token: accessToken };
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error("Invalid username or password");
      }
      console.error("Login error:", error);
      throw new Error(error.message || "Login failed. Please try again.");
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      // DummyJSON doesn't have a real register endpoint, so we'll simulate it
      // In a real app, this would call a proper registration API

      // Simulate registration by creating a user object
      const user: User = {
        id: Math.random().toString(36).substring(7),
        username: data.username,
        email: data.email,
        
      };

      // Generate a dummy token
      const token = "dummy_token_" + Math.random().toString(36).substring(7);

      // Store token and user
      await storageUtils.saveAuthToken(token);
      await storageUtils.saveUser(user);

      return { user, token };
    } catch {
      throw new Error("Registration failed. Please try again.");
    }
  },

  logout: async (): Promise<void> => {
    try {
      await storageUtils.clearAuthData();
    } catch {
      throw new Error("Logout failed");
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const user = await storageUtils.getUser();
      return user;
    } catch {
      return null;
    }
  },

  isAuthenticated: async (): Promise<boolean> => {
    try {
      const token = await storageUtils.getAuthToken();
      return !!token;
    } catch {
      return false;
    }
  },
};