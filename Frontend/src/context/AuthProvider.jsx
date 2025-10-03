import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  // Register function
  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      const response = await API.post("/auth/register", userData);

      // FIX: Check for token instead of success
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      } else {
        return {
          success: false,
          message: "Registration failed: No token received",
        };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Login function

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await API.post("/auth/login", credentials);

      // FIX: Check for token instead of success
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      } else {
        // If no token, return failure
        return { success: false, message: "Login failed: No token received" };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await API.put("/users/profile", profileData);

      if (response.data.success) {
        const updatedUser = response.data.user;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true, user: updatedUser };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Profile update failed";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Get profile function
  const getProfile = async () => {
    try {
      const response = await API.get("/users/profile");
      return { success: true, user: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch profile";
      return { success: false, message: errorMessage };
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    getProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
